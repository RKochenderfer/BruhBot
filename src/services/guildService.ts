import { Logger } from 'pino'
import GuildCache from '../caches/guildCache'
import { GuildRepository } from '../repositories/guildRepository'
import Guild from '../models/guild'
import FlaggedPattern from '../message-checker/flaggedPattern'
import Pin from '../models/pin'

export default class GuildService {
	public constructor(
		private _logger: Logger,
		private _guildRepository: GuildRepository,
		private _guildCache: GuildCache,
	) {}

	public isNewGuild = async (guildId: string): Promise<boolean> => {
		this._logger.debug(`Started to check if guild is new`)

		let isNewGuild = this._guildCache.has(guildId)
			? true
			: (await this.getGuildFromDatabaseWith(guildId)) === undefined

		this._logger.debug(`Completed checking if guild is new with result: ${isNewGuild}`)

		return isNewGuild
	}

	public isExistingGuild = async (guildId: string): Promise<boolean> => {
		return !this.isNewGuild(guildId)
	}

	public add = async (guild: Guild) => {
		this._logger.debug(`Started to add guild`)
		if (await this.isExistingGuild(guild.guildId)) throw new Error('Guild already exists')

		await this._guildRepository.insertGuild(guild)
		this._guildCache.add(guild)
		this._logger.debug('Completed adding guild')
	}

	public get = async (guildId: string): Promise<Guild | undefined> => {
		this._logger.debug('Started to get guild')
		const cacheResult = this._guildCache.get(guildId)

		if (cacheResult) {
			this._logger.debug('Guild found in cache')
			return cacheResult
		}

		const guildDatabaseResult = await this.getGuildFromDatabaseWith(guildId)
		if (guildDatabaseResult) {
			this._logger.debug('Guild found in database')
		} else {
			this._logger.debug('Guild was not found in database')
		}

		return guildDatabaseResult
	}

	public updateFlaggedPattern = async (guildId: string, flaggedPattern: FlaggedPattern) => {
		this._logger.debug('Started to update flagged pattern')

		const guild = await this.get(guildId)
		if (!guild) 
			throw new Error(`Unable to find guildId: ${guildId}`)
		if (guild.flaggedPatterns == undefined)
			throw new Error('Guild has no flagged patterns to update')
		if (guild.flaggedPatterns.findIndex(x => x.key === flaggedPattern.key) == -1)
			throw new Error(
				`Unable to find flagged pattern with key: ${flaggedPattern.key} in guild`,
			)

		await this._guildRepository.upsertPattern(guildId, flaggedPattern)
		this._guildCache.updateFlaggedPattern(guildId, flaggedPattern)
	}

	private getGuildFromDatabaseWith = async (guildId: string): Promise<Guild | undefined> => {
		const findGuildResult = await this._guildRepository.findGuild(guildId)

		if (!findGuildResult) return undefined

		const initializedGuild = this.initializeGuild(findGuildResult) // Has to be initialized or else pins and flagged message methods won't work
		this._guildCache.add(initializedGuild) // since guild was used, needs to be added to cache

		return initializedGuild
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
