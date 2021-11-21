import { Snowflake } from 'discord.js';
import { ObjectId } from 'mongodb'
import { Attorney } from './Attorney';

export class Trial {
    constructor(
        public judge: Snowflake,
        public startDate: Date,
        public complete: boolean,
        public caseDescription: string,
        public prosecutor?: Attorney,
        public defender?: Attorney,
        public ruling?: string,
        public id?: ObjectId
    ) {}
}