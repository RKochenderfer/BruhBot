import { Collection, Db } from 'mongodb'
import FlaggedPattern from '../message-checker/flagged-pattern'
import Server from '../models/server'
import { Nullable } from 'typescript-nullable'

export class ServerCollection {
	private existingServers = new Set()

	private constructor(private _serverCollection: Collection<Server>) { }

	static from = (serverCollection: Collection<Server>): ServerCollection => {
		return new ServerCollection(serverCollection)
	}

	findServer = async (guildId: string): Promise<Nullable<Server>> => {
		return await this._serverCollection.findOne({ guildId: guildId })
	}

	isServerInDb = async (guildId: string): Promise<boolean> => {
		return await this.serverExists(guildId)
	}

	insertServer = async (server: Server): Promise<void> => {
		this._serverCollection.insertOne({
			name: server.name,
			guildId: server.guildId,
			pins: server.pins,
			flaggedPatterns: server.flaggedPatterns
		})
	}

	addPattern = async (guildId: string, patternToAdd: FlaggedPattern): Promise<void> => {
		await this._serverCollection.updateOne({ guildId: guildId }, { $push: { flaggedPatterns: patternToAdd } })
	}

	findOne = async (query: any): Promise<any> => {
		return await this._serverCollection.findOne(query)
	}

	updateOne = async (filter: any, update: any, options?: any, callback?: any): Promise<any> => {
		return await this._serverCollection.updateOne(filter, update, options, callback)
	}

	private serverExists = async (guildId: string): Promise<boolean> => {
		if (this.existingServers.has(guildId)) {
			return true
		}

		if (Nullable.isSome(await this.findServer(guildId))) {
			this.existingServers.add(guildId)
			return true
		}
		return false
	}
}
