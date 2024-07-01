import Guild from '../models/guild'
import { LFUCache } from './LFUCache'
import { Logger } from 'pino'
import Pin from '../models/pin'
import FlaggedPattern from '../message-checker/flaggedPattern'

export default class GuildCache extends LFUCache<Guild> {
	private static _instance: GuildCache
	private _logger: Logger | undefined

	private constructor() {
		super(10)
	}

	public static initialize(): GuildCache {
		if (this._instance) {
			return this._instance // maybe throw error here in future
		}

		return (this._instance = new this())
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

	public add(guild: Guild) {
		this.logInfo('Started to add guild')
		if (this.has(guild.guildId)) throw new Error('Guild already in cache')

		super.addCacheEntry(guild.guildId, guild)
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
	}

	public async removeFlaggedPattern(guildId: string, key: string) {
		this.logInfo('Started to remove pattern')

		const guild = await this.get(guildId)

		if (!guild) throw new Error(`GuildId ${guildId} not found`)
		if (guild.flaggedPatterns == undefined)
			throw new Error(`Guild ${guildId} contains no flagged patterns to update`)

		const index = guild.flaggedPatterns.findIndex(x => x.key === key)
		if (index === -1) throw new Error(`Index for flagged pattern ${key} was not found`)

		guild.flaggedPatterns.splice(index, 1)

		super.updateCacheEntry(guildId, guild)

		this.logInfo('Completed removing pattern')
	}

	public async updatePins(guildId: string, pins: Pin[]) {
		this.logInfo('Updating guild pins')

		const guild = await this.get(guildId)

		if (!guild) throw new Error(`GuildId ${guildId} not found`)

		guild.pins = [...pins]
		super.updateCacheEntry(guildId, guild)

		this.logInfo('Completed updating guild pins')
	}

	public get(guildId: string): Guild | undefined {
		return super.getCacheEntry(guildId)
	}

	public has(guildId: string): boolean {
		this.logDebug(`Attempting to check if guild ${guildId} is in cache`)
		const entry = this.get(guildId)
		this.logDebug(`Entry for guild Id: ${guildId} in cache - ${entry}`)

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
}
