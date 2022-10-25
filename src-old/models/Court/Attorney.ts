import { Snowflake } from 'discord.js'
import { ObjectId } from 'mongodb'

export class Attorney {
	constructor(
		public userId: string,
		public points: number = 0,
	) {}
}
