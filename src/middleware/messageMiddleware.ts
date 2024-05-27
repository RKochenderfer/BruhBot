import { Message } from 'discord.js'
import MessageHandler from '../handlers/messageHandler'
import LogSession from '../log/logSession'
import { Middleware } from './middleware'

export default class MessageMiddleware extends Middleware {
	constructor(private _message: Message<boolean>) {
		super()
	}
	
	async execute(): Promise<void> {
		if (!this._logger) throw new Error('Logger cannot be undefined')

		this._logger.debug(this._message, 'Started to handle message')
		const messageHandler = new MessageHandler(this._logger, this._message)

		try {
			messageHandler.execute()
		} catch (error) {
			this._logger.error(error, 'Error occurred while handling message')
		}
		this._logger.debug('Completed handling message')
	}

	generateLogSessionInfo(): LogSession {
		return LogSession.fromMessage(this._message)
	}
}