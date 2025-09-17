export class InitiativeError extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'InitiativeError'
		Object.setPrototypeOf(this, InitiativeError.prototype)
	}
}
