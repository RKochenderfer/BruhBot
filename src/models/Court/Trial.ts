import { Snowflake } from 'discord.js';
import { ObjectId } from 'mongodb'
import { Attorney } from './Attorney';

export class Trial {
    constructor(
        public guildId: string,
        public judge: string,
        public startDate: number,
        public complete: boolean,
        public caseDescription: string,
        public prosecutor?: Attorney,
        public defender?: Attorney,
        public verdict?: string,
        public id?: ObjectId
    ) {}
}