import { Logger } from 'pino'
import LogSession from '../log/logSession'

export abstract class Middleware {
	private _next: Middleware | undefined
	protected _logger: Logger | undefined

	constructor() {}

	abstract execute(): Promise<void>
	abstract generateLogSessionInfo(): LogSession

	protected async next() {
		await this._next?.execute()
	}

	protected setNext(next: Middleware) {
		this._next = next
	}

	protected getNextLogSessionInfo(): LogSession {
		return this._next?.generateLogSessionInfo()!
	}

	protected setLogger(logger: Logger) {
		this._logger = logger
	}

	protected setNextLogger(logger: Logger) {
		this._next?.setLogger(logger)
	}

	protected cleanup() {
		this._next = undefined
		this._logger = undefined
	}
}
