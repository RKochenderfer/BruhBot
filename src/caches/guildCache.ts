import { Nullable } from 'typescript-nullable'
import { GuildCollection } from '../extensions/guildCollection'
import Guild from '../models/guild'
import { LFUCache } from './LFUCache'
import { Logger } from 'pino'
import Pin from '../models/pin'
import FlaggedPattern from '../message-checker/flagged-pattern'

export default class GuildCache extends LFUCache<Guild> {
	private static _instance: GuildCache
	private _logger: Logger | undefined

	private constructor(private _guildCollection: GuildCollection) {
		super(10)
	}

	public static initialize(guildCollection: GuildCollection): GuildCache {
		if (this._instance) {
			return this._instance // maybe throw error here in future
		}

		return (this._instance = new this(guildCollection))
	}

	public static getInstance(): GuildCache {
		if (!this._instance) {
			throw new Error('Guild cache has not been initialized')
		}
		return this._instance
	}

	public static isInitialized(): boolean {
		return this._instance !== undefined
	}

	public async add(guild: Guild) {
		this.logInfo('Started to add guild')
		if (await this.has(guild.guildId)) throw new Error('Guild already in cache')

		super.addCacheEntry(guild.guildId, guild)

		await this._guildCollection.insertGuild(guild)
		this.cleanup()
	}

	public async updateGuild(guildId: string, guild: Guild) {
		this.logInfo('Started to update guild')
		if (guildId !== guild.guildId)
			throw new Error(
				`Provided guildId ${guildId} does not match guildId in server ${guild.guildId}`,
			)
		if (!(await this.has(guildId)))
			throw new Error(`Guild with id ${guildId} does not exist in cache`)

		super.updateCacheEntry(guildId, guild)

		await this._guildCollection.updateGuild(guild)
		this.cleanup()
	}

	public async updateFlaggedPattern(guildId: string, flaggedPattern: FlaggedPattern) {
		this.logInfo('Started to update flagged pattern')

		const guild = await this.get(guildId)

		if (!guild) throw new Error(`GuildId ${guildId} not found`)
		if (guild.flaggedPatterns == undefined)
			throw new Error(`Guild ${guildId} contains no flagged patterns to update`)

		const index = guild.flaggedPatterns.findIndex(x => x.key === flaggedPattern.key)

		if (index === -1)
			throw new Error(`Index for flagged pattern ${flaggedPattern.key} was not found`)

		guild.flaggedPatterns[index] = flaggedPattern

		super.updateCacheEntry(guildId, guild)
		await this._guildCollection.upsertPattern(guildId, flaggedPattern)
		this.cleanup()
	}

	public async get(guildId: string): Promise<Guild | undefined> {
		this.logDebug(`Attempting to get guild ${guildId}`)
		let guildCacheEntry = super.getCacheEntry(guildId)

		if (guildCacheEntry) return guildCacheEntry

		const findResult = await this._guildCollection.findGuild(guildId)
		if (Nullable.isNone(findResult)) return undefined

		const guild = this.initializeGuild(findResult)
		super.addCacheEntry(guildId, guild)
		
		this.cleanup()

		return guild
	}

	public async has(guildId: string): Promise<boolean> {
		// check if in cache
		this.logDebug(`Attempting to check if guild ${guildId} is in cache`)
		const entry = await this.get(guildId)

		this.cleanup()

		return entry !== undefined
	}

	public setLogger(logger: Logger) {
		this._logger = logger
	}

	private logInfo(message: string | undefined) {
		if (!this._logger) return

		this._logger.info(message)
	}

	private logDebug(message: string | undefined) {
		if (!this._logger) return

		this._logger.debug(message)
	}

	private cleanup() {
		this._logger = undefined
	}

	private initializeGuild(uninitializedGuild: Guild): Guild {
		const guild = {
			name: uninitializedGuild.name,
			guildId: uninitializedGuild.guildId,
			pins: [],
			flaggedPatterns: [],
		} as Guild

		// setup pins
		if (uninitializedGuild.pins) {
			guild.pins = [...this.initializePins(uninitializedGuild.pins)]
		}

		// setup flagged patterns
		if (uninitializedGuild.flaggedPatterns) {
			guild.flaggedPatterns = [
				...this.initializeFlaggedPatterns(uninitializedGuild.flaggedPatterns),
			]
		}

		return guild
	}

	private initializeFlaggedPatterns(
		uninitializedFlaggedPatterns: FlaggedPattern[],
	): FlaggedPattern[] {
		const patterns = []
		for (const pattern of uninitializedFlaggedPatterns) {
			patterns.push(
				new FlaggedPattern(
					pattern.key,
					pattern.expression,
					pattern.response,
					pattern.flags,
					pattern.messageHistory,
				),
			)
		}

		return patterns
	}

	private initializePins(uninitializedPins: Pin[]): Pin[] {
		const pins = []
		for (const pin of uninitializedPins) pins.push(new Pin(pin.message, pin.date, pin.userId))

		return pins
	}
}
