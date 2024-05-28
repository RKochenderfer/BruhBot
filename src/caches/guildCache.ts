import { Nullable } from 'typescript-nullable'
import { ServerCollection } from '../extensions/server-collection'
import Guild from '../models/server'
import { LFUCache } from './LFUCache'
import { Logger } from 'pino'

export default class GuildCache extends LFUCache<Guild> {
	private static _instance: GuildCache
	private _logger: Logger | undefined

	private constructor(private _serverCollection: ServerCollection) {
		super(10)
	}

	public static getInstance(serverCollection?: ServerCollection) {
		if (!this._instance && !serverCollection) {
			throw new Error(
				'The first usage of getInstance requires that server collection parameter is set',
			)
		} else if (!this._instance && serverCollection) {
			return (this._instance = new this(serverCollection))
		}
		return this._instance
	}

	public async add(guild: Guild) {
		this.logInfo(guild, 'Attempting to add guild')
		if (await this.has(guild.guildId)) throw new Error('Guild already in cache')

		super.addCacheEntry(guild.guildId, guild)

		await this._serverCollection.insertServer(guild)
	}

	public async update(guildId: string, guild: Guild) {
		this.logInfo(guild, 'Attempting to update guild')
		if (guildId !== guild.guildId)
			throw new Error(
				`Provided guildId ${guildId} does not match guildId in server ${guild.guildId}`,
			)
		if (!(await this.has(guildId)))
			throw new Error(`Guild with id ${guildId} does not exist in cache`)

		super.updateCacheEntry(guildId, guild)

		await this._serverCollection.updateOne({ guildId: guildId }, guild)
	}

	public async get(guildId: string): Promise<Guild | undefined> {
		this.logDebug(undefined, `Attempting to get guild ${guildId}`)
		let guild = super.getCacheEntry(guildId)

		if (guild) return guild

		const findResult = await this._serverCollection.findServer(guildId)
		if (Nullable.isNone(findResult)) return undefined
		super.addCacheEntry(guildId, findResult)

		return findResult
	}

	public async has(guildId: string): Promise<boolean> {
		// check if in cache
		this.logDebug(undefined, `Attempting to check if guild ${guildId} is in cache`)
		const entry = await this.get(guildId)

		return entry !== undefined
	}

	public setLogger(logger: Logger) {
		this._logger = logger
	}

	private logInfo(data: Guild | undefined, message: string | undefined) {
		if (!this._logger) return

		this._logger.info(message)
	}

	private logDebug(data: Guild | undefined, message: string | undefined) {
		if (!this._logger) return

		this._logger.debug(message)
	}
}
