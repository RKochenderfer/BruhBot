import { Nullable } from 'typescript-nullable'
import { ServerCollection } from '../extensions/server-collection'
import Server from '../models/server'
import { LFUCache } from './LFUCache'

export default class GuildCache extends LFUCache<Server> {
	private static _instance: GuildCache

	private constructor(private _serverCollection: ServerCollection) {
		super(10)
	}

	public static getInstance(serverCollection?: ServerCollection) {
		if (!this._instance && !serverCollection) {
			throw new Error('The first usage of getInstance requires that server collection parameter is set')
		} else if (!this._instance && serverCollection) {
			return this._instance = new this(serverCollection)
		}
		return this._instance
	}

	public async add(server: Server) {
		if (await this.has(server.guildId)) throw new Error('Guild already in cache')

		super.addCacheEntry(server.guildId, server)

		// add details to database
		await this._serverCollection.insertServer(server)
	}

	public async update(guildId: string, server: Server) {
		if (guildId !== server.guildId) throw new Error(`Provided guildId ${guildId} does not match guildId in server ${server.guildId}`)
		if (!await this.has(guildId)) throw new Error(`Guild with id ${guildId} does not exist in cache`)

		super.updateCacheEntry(guildId, server)

		await this._serverCollection.updateOne(
			{ guildId: guildId },
			server
		)
	}

	public get(guildId: string): Server | undefined {
		return super.getCacheEntry(guildId)
	}

	public async has(guildId: string): Promise<boolean> {
		// check if in cache
		const entry = super.getCacheEntry(guildId)

		if (!entry) {
			const server = await this._serverCollection.findServer(guildId)
			if (Nullable.isNone(server)) return false
			super.addCacheEntry(guildId, server)
		}

		return true
	}
}
