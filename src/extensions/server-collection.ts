import { Collection, Db } from 'mongodb'
import FlaggedPattern from '../message-checker/flagged-pattern'
import Server from '../models/server'
import { Nullable } from 'typescript-nullable'
import {logger} from '../utils/logger'


export class ServerCollection {
	private existingServers = new Set()

	private constructor(private _serverCollection: Collection<Server>) {}

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
		logger.info(`Created server document for server ${server.name} with id ${server.guildId}`)
		this._serverCollection.insertOne({
			name: server.name,
			guildId: server.guildId,
			pins: server.pins,
			flaggedPatterns: server.flaggedPatterns,
		})
	}

	addPattern = async (guildId: string, patternToAdd: FlaggedPattern): Promise<void> => {
		await this.updateOne(
			{ guildId: guildId },
			{
				$push: {
					flaggedPatterns: {
						key: patternToAdd.key,
						expression: patternToAdd.expression,
						response: patternToAdd.response,
						flags: patternToAdd.flags,
					},
				},
			},
		)
	}

	upsertPattern = async (guildId: string, patternToUpdate: FlaggedPattern): Promise<void> => {
		await this._serverCollection.updateOne(
			{ guildId: guildId, 'flaggedPatterns.key': patternToUpdate.key },
			{
				$set: {
					'flaggedPatterns.$': {
						key: patternToUpdate.key,
						expression: patternToUpdate.expression,
						response: patternToUpdate.response,
						flags: patternToUpdate.flags,
					} as FlaggedPattern,
				},
			},
		)
	}

	findOne = async (query: any): Promise<any> => {
		return await this._serverCollection.findOne(query)
	}

	updateOne = async (filter: any, update: any, options?: any): Promise<any> => {
		return this._serverCollection.updateOne(filter, update, options)
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
