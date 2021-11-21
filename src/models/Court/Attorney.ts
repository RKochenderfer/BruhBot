import { Snowflake } from 'discord.js'
import { ObjectId } from 'mongodb'

export class Attorney {
	constructor(
		public userId: Snowflake,
		public points?: number,
		public id?: ObjectId,
	) {}
}
