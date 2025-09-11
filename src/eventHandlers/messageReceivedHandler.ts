import { Message } from 'discord.js'
import { Notification } from '../events'
import { Handler } from '.'
import { Logger } from 'pino'
import LogSession from '../log/logSession'

/**
 * Handles a message event that originated from a user (not a bot)
 */
export class UserMessageReceivedHandler implements Handler {
	constructor(private readonly logger: Logger) {}

	handle = async (data: Notification<Message>): Promise<void>  =>{
		const logSession = LogSession.fromMessage(data.data)
		const childLogger = this.logger.child(logSession)
		
		childLogger.debug('Started to handle message')
		// stuff
		childLogger.debug('Completed handling message')
	}
}
