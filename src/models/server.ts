import FlaggedPattern from '../message-checker/flagged-pattern'
import Pin from './pin'

export default class Server {
	constructor(
		public name: string,
		public guildId: string,
		public pins?: Pin[],
		public flaggedPatterns?: FlaggedPattern[],
	) {}
}
