import { Snowflake } from 'discord.js'
import { ObjectId } from 'mongodb'

export class Vote {
	constructor(
		public userId: string,
		public vote: string,
	) {}
}
