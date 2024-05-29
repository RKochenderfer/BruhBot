import { Message } from 'discord.js'
import { Logger } from 'pino'
import Handler from './handler'
import { updateCommands } from '../command-updater'
import { DiscordCommandRegister } from '..'
import OnAceHandler from './onAceHandler'
import GuildCache from '../caches/guildCache'
import FlaggedPatternHelper from '../message-checker/flaggedPatternHelper'

export default class MessageHandler implements Handler {
	constructor(
		private _logger: Logger,
		private _message: Message<boolean>,
		private _guildCache: GuildCache,
	) {}

	async execute() {
		this._logger.debug('Started message handler')
		if (this._message.author.bot) {
			this._logger.debug('Message was created by a bot so handler was stopped')
			return
		}

		if (this.isDeploy(this._message.content)) {
			await updateCommands(this._message, DiscordCommandRegister)
			return
		}

		if (this.isAce(this._message.content)) {
			const aceHandler = new OnAceHandler(this._logger, this._message)
			await aceHandler.execute()
		}

		await this.handleFlaggedMessages(this._message.content)
		this._logger.debug('Completed message handler')
	}

	private handleFlaggedMessages = async (message: string): Promise<void> => {
		const guild = await this._guildCache.get(this._message.guildId!)

		if (!guild) throw new Error('Guild in message was not found')

		if (!guild.flaggedPatterns) return

		const flaggedPatternHelper = new FlaggedPatternHelper(guild.flaggedPatterns)
		const isFlagged = flaggedPatternHelper.isTextFlagged(message)

		if (isFlagged) {
			this._logger.debug(flaggedPatternHelper.matchedFlag, `Flagged message found in guild ${this._message.guild?.name} ${this._message.guildId}`)
			await this._message.channel.send(flaggedPatternHelper.buildMatchedResponse())
		}
	}

	private isDeploy = (messageContent: string): boolean => {
		return messageContent === '!deploy'
	}

	private isAce = (messageContent: string): boolean => {
		// if match is null coalesces to 0 so returns false
		return (messageContent.match(/^!ace \d+$/)?.length ?? 0) > 0
	}
}
