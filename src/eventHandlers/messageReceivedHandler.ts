import { Message } from 'discord.js'
import { EventBuss, Notification } from '../events'
import { Handler } from '.'
import { Logger } from 'pino'
import GuildCache from '../caches/guildCache'
import Guild from '../models/guild'

/**
 * Handles a message event that originated from a user (not a bot)
 */
export class MessageReceivedHandler implements Handler {
	constructor(private readonly _eventBus: EventBuss, private readonly _guildCache: GuildCache) {}

	handle = async (logger: Logger, data: Notification<Message>): Promise<void> => {
		logger.debug('Started to handle generic message')
		try {
			await this.addGuildToDatabaseIfNotPresent(logger, data.data)
			await this.publishSpecificMessageEvent(data, logger)
		} catch (error) {
			logger.error(error, 'Error occurred while handling generic message')
		}
		logger.debug('Completed handling generic message')
	}

	private async addGuildToDatabaseIfNotPresent(logger: Logger, message: Message): Promise<void> {
		logger.debug('Started to add guild to database if not present')
		const isGuildInCache = await this._guildCache.has(message.guildId!)
		if (!isGuildInCache) {
			const newGuild = {
				name: message.guild!.name,
				guildId: message.guildId!,
			} as Guild
			logger.info(newGuild, 'New guild created')
			await this._guildCache.add(newGuild)
		}

		logger.debug('Completed handling request')
	}

	/**
	 * Publishes a new specific message event based on the the author and the content
	 * @param data the message data
	 * @param logger
	 */
	private async publishSpecificMessageEvent(data: Notification<Message<boolean>>, logger: Logger) {
		if (data.data.author.bot) {
			await this._eventBus.publish('botMessageReceived', data, logger)
		} else if (this.isDeploy(data.data.content)) {
			await this._eventBus.publish('deployMessageReceived', data, logger)
		} else if (this.isAce(data.data.content)) {
			await this._eventBus.publish('aceRenderRequestMessageReceived', data, logger)
		} else {
			await this._eventBus.publish('userMessageReceived', data, logger)
		}
	}

	private isDeploy(messageContent: string): boolean {
		return messageContent === '!deploy'
	}

	private isAce(messageContent: string): boolean {
		return messageContent.startsWith('!ace')
	}
}
