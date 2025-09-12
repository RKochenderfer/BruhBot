import { Message, TextChannel } from 'discord.js'
import { Notification } from '../events'
import { Handler } from '.'
import { Logger } from 'pino'
import GuildCache from '../caches/guildCache'
import FlaggedPatternHelper from '../message-checker/flaggedPatternHelper'
import Guild from '../models/guild'

/**
 * Handles a message event that originated from a user (not a bot)
 */
export class UserMessageReceivedHandler implements Handler {
	constructor(private _guildCache: GuildCache) {}

	handle = async (logger: Logger, data: Notification<Message>): Promise<void> => {
		logger.debug('Started to handle user message')
		try {
			// load the guild from the cache
			const message = data.data
			const content = message.content
			// guild should always be in the cache
			const guild = await this._guildCache.get(message.guildId!)

			if (!guild) throw new Error('Guild in message was not found')

			if (!guild.flaggedPatterns) return

			const flaggedPatternHelper = new FlaggedPatternHelper(guild.flaggedPatterns)
			const isFlagged = flaggedPatternHelper.isTextFlagged(content)

			if (isFlagged) {
				logger.debug(flaggedPatternHelper.matchedFlag, `Flagged message found in guild ${message.guild?.name} ${message.guildId}`)
				await this.updateFlaggedPattern(flaggedPatternHelper, message, guild)
			}
		} catch (error) {
			logger.error(error, 'Error occurred while handling user message')
		}
		logger.debug('Completed handling user message')
	}

	/**
	 * Update the flagged pattern history and notify the channel with the response
	 * @param flaggedPatternHelper
	 * @param message
	 * @param guild
	 */
	private async updateFlaggedPattern(flaggedPatternHelper: FlaggedPatternHelper, message: Message<boolean>, guild: Guild) {
		flaggedPatternHelper.updateHistory(message)
		await this._guildCache.updateFlaggedPattern(guild.guildId, flaggedPatternHelper.matchedFlag!)
		const channel = message.channel as TextChannel
		await channel.send(flaggedPatternHelper.buildMatchedResponse())
	}
}
