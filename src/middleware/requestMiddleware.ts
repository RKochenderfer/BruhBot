import { Message } from 'discord.js'
import MessageMiddleware from './messageMiddleware'
import LogSession from '../log/logSession'
import { Middleware } from './middleware'
import { ServerCollection } from '../extensions/server-collection'
import { logger } from '../log/logger'

export class RequestMiddleware extends Middleware {
	constructor(private serverCollection: ServerCollection) {
		super()
	}

	execute = async () => {
		const logSession = super.getNextLogSessionInfo()
		const childLogger = logger.child(logSession)
		super.setLogger(childLogger)
		super.setNextLogger(childLogger)

		this._logger?.debug('Started to handle request')
		await this.addGuildToDatabaseIfNotPresent(logSession.guildId)

		super.next()
		super.cleanup()

		this._logger?.debug('Completed handling request')
	}

	generateLogSessionInfo(): LogSession {
		throw new Error('Method not implemented.')
	}

	onMessageCreate = async (message: Message<boolean>) => {
		const messageMiddleware = new MessageMiddleware(message)
		super.setNext(messageMiddleware)
		this.execute()
	}

	private addGuildToDatabaseIfNotPresent = async (guildId: string): Promise<void> => {
		this._logger?.debug('Started to add guild to database if not present')

		this._logger?.debug('Completed handling request')
	}
}
