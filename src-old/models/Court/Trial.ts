import { Snowflake } from 'discord.js'
import { ObjectId } from 'mongodb'
import { Attorney } from './Attorney'
import { Vote } from './Vote'

export class Trial {
	constructor(
		public guildId: string,
		public judge: string,
		public startDate: string,
		public complete: boolean,
		public caseDescription: string,
		public prosecutor?: Attorney,
		public defender?: Attorney,
		public verdict?: string,
		public votingIsOpen?: boolean,
		public votes?: Vote[],
		public _id?: ObjectId
	) {}
}