import { Message } from 'discord.js'
import { Notification } from '../events'
import { Handler } from '.'
import { Logger } from 'pino'

/**
 * Handles a message event that originated from a user (not a bot)
 */
export class BotMessageReceivedHandler implements Handler {
	handle = async (logger: Logger, _data: Notification<Message>): Promise<void> => {
		logger.debug('Started to handle bot message')
		// stuff
		logger.debug('Completed handling bot message')
	}
}
