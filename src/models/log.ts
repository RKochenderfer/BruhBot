import { InteractionLog, Type } from '../log'

export default class Log {
	constructor(
		public level: string,
		public timestamp: string,
		public type?: Type,
		public message?: string,
		public interactionLog?: InteractionLog,
	) {}
}
