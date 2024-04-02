export default class FlaggedMessage {
	constructor(
		public lastAuthorId: string = '',
		public lastAuthorUsername: string = '',
		public count: number = 0,
		public lastFound: Date = new Date(),
		public prevLastFound: Date = new Date(),
	) {}
}
