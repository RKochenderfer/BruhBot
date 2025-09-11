import { Message } from 'discord.js'
import { Notification } from '../events'
import { Handler } from '.'
import { Logger } from 'pino'
import LogSession from '../log/logSession'

/**
 * Handles a message event that originated from a user (not a bot)
 */
export class BotMessageReceivedHandler implements Handler {
	constructor() {}

	handle = async (logger: Logger, data: Notification<Message>): Promise<void>  =>{
		const logSession = LogSession.fromMessage(data.data)
		
		logger.debug('Started to handle bot message')
		// stuff
		logger.debug('Completed handling bot message')
	}
}
