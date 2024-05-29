import { Collection, Db, UpdateResult } from 'mongodb'
import FlaggedPattern from '../message-checker/flagged-pattern'
import Guild from '../models/guild'
import { Nullable } from 'typescript-nullable'

export class ServerCollection {
	private existingServers = new Set()

	private constructor(private _serverCollection: Collection<Guild>) {}

	static from = (serverCollection: Collection<Guild>): ServerCollection => {
		return new ServerCollection(serverCollection)
	}

	findServer = async (guildId: string): Promise<Nullable<Guild>> => {
		return await this._serverCollection.findOne({ guildId: guildId })
	}

	isServerInDb = async (guildId: string): Promise<boolean> => {
		return await this.serverExists(guildId)
	}

	insertServer = async (server: Guild): Promise<void> => {
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

	updateGuild = async (guild: Guild): Promise<void> => {
		await this._serverCollection.updateOne(
			{ guildId: guild.guildId },
			{
				$set: {
					name: guild.name,
					pins: guild.pins,
					flaggedPatterns: guild.flaggedPatterns,
				},
			},
		)
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
