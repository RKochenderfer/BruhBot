import { Collection } from 'mongodb'
import FlaggedPattern from '../message-checker/flaggedPattern'
import Guild from '../models/guild'
import Pin from '../models/pin'

export class GuildRepository {
	private existingGuilds = new Set()

	private constructor(private _serverCollection: Collection<Guild>) {}

	static from = (guildCollection: Collection<Guild>): GuildRepository => {
		return new GuildRepository(guildCollection)
	}

	findGuild = async (guildId: string): Promise<Guild | undefined> => {
		return (await this._serverCollection.findOne({ guildId: guildId })) as Guild
	}

	isServerInDb = async (guildId: string): Promise<boolean> => {
		return await this.guildExists(guildId)
	}

	insertGuild = async (guild: Guild): Promise<void> => {
		this._serverCollection.insertOne({
			name: guild.name,
			guildId: guild.guildId,
			pins: guild.pins,
			flaggedPatterns: guild.flaggedPatterns,
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
						messageHistory: patternToUpdate.messageHistory,
					} as FlaggedPattern,
				},
			},
		)
	}

	removePattern = async (guildId: string, keyToBeRemoved: string): Promise<void> => {
		await this._serverCollection.updateOne(
			{ guildId: guildId },
			{ $pull: { flaggedPatterns: { key: keyToBeRemoved } } },
		)
	}

	updatePins = async (guildId: string, pins: Pin[]): Promise<void> => {
		await this._serverCollection.updateOne(
			{ guildId: guildId },
			{
				$set: {
					pins: pins,
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

	private guildExists = async (guildId: string): Promise<boolean> => {
		if (this.existingGuilds.has(guildId)) {
			return true
		}

		if ((await this.findGuild(guildId)) !== undefined ) {
			this.existingGuilds.add(guildId)
			return true
		}
		return false
	}
}
