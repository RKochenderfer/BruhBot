import { Message } from 'discord.js'
import { EventBuss, Notification } from '../events'
import { Handler } from '.'
import { Logger } from 'pino'

/**
 * Handles a message event that originated from a user (not a bot)
 */
export class MessageReceivedHandler implements Handler {
	constructor(private readonly eventBus: EventBuss) {}

	handle = async (logger: Logger, data: Notification<Message>): Promise<void> => {
		logger.debug('Started to handle generic message')
		try {
			this.publishSpecificMessageEvent(data, logger)
		} catch (error) {
			logger.error(error, 'Error occurred while handling generic message')
		}
		logger.debug('Completed handling generic message')
	}

	/**
	 * Publishes a new specific message event based on the the author and the content
	 * @param data the message data
	 * @param logger 
	 */
	private publishSpecificMessageEvent(data: Notification<Message<boolean>>, logger: Logger) {
		if (data.data.author.bot) {
			this.eventBus.publish('botMessageReceived', data, logger)
		} else if (this.isDeploy(data.data.content)) {
			this.eventBus.publish('deployMessageReceived', data, logger)
		} else {
			this.eventBus.publish('userMessageReceived', data, logger)
		}
	}

	private isDeploy(messageContent: string): boolean {
		return messageContent === '!deploy'
	}
}
