import { InteractionLog } from '../log'

export default class Log {
	constructor(
		public level: string,
		public timestamp: string,
		public message?: string,
		public interactionLog?: InteractionLog,
	) {}
}
