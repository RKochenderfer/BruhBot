import { Collection } from 'mongodb'
import FlaggedPattern from '../message-checker/flagged-pattern'
import Server from '../models/server'
import { Nullable } from 'typescript-nullable'

export class ServerCollection extends Collection<Server> {
	private existingServers = new Set()
	async findServer(guildId: string): Promise<Nullable<Server>> {
		return await this.findOne({ guildId: guildId })
	}

	async isServerInDb(guildId: string): Promise<boolean> {
		return this.serverExists(guildId)
	}

	async insertServer(server: Server): Promise<void> {
		this.insertOne({
			name: server.name,
			guildId: server.guildId,
			pins: server.pins,
			flaggedPatterns: server.flaggedPatterns
		})
	}

	async addPattern(guildId: string, patternToAdd: FlaggedPattern): Promise<void> {
		await this.updateOne({ guildId: guildId }, { $push: { flaggedPatterns: patternToAdd } })
	}

	private async serverExists(guildId: string): Promise<boolean> {
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
