import { Snowflake } from 'discord.js'
import { ObjectId } from 'mongodb'

export class Vote {
	constructor(
		public user: Snowflake,
		public vote: string,
		public id?: ObjectId,
	) {}
}
