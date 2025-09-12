import { Logger } from 'pino'
import { Handler } from '.'
import { Message } from 'discord.js'
import { render } from '../ace'
import { Notification } from '../events'

/**
 * Handles events to render ace attorney renderings messages
 */
export class AceMessageReceivedHandler implements Handler {
	handle = async (logger: Logger, data: Notification<Message>): Promise<void> => {
		logger.debug('Started to handle ace message')
		const message = data.data
		try {
			message.reply('Your request has beben added to the queue')
			await render(data.data)
		} catch (error) {
			logger.error(error, 'Error occurred while handling ace message')
		}
		logger.debug('Completed handling ace message')
	}
}
