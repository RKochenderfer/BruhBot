import { Message } from 'discord.js'
import { Notification } from '../events'
import { Handler } from '.'
import { Logger } from 'pino'

/**
 * Handles a message event that originated from a user (not a bot)
 */
export class UserMessageReceivedHandler implements Handler {
	constructor() {}

	handle = async (logger: Logger, data: Notification<Message>): Promise<void> => {
		logger.debug('Started to handle user message')
		// stuff
		logger.debug('Completed handling user message')
	}
}
