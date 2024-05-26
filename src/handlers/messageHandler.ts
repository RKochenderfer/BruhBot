import { Message } from 'discord.js';
import { Logger } from 'pino';
import Handler from './handler';
import { updateCommands } from '../command-updater';
import { DiscordCommandRegister, MessageChecker } from '..';
import OnAceHandler from './onAceHandler';

export default class MessageHandler implements Handler {
	constructor(private _logger: Logger, private _message: Message<boolean>) { }

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
			aceHandler.execute()
		}

		await this.CheckIfMessageFlagged()
		this._logger.debug('Completed message handler')
	}

	private CheckIfMessageFlagged = async () => {
		const flaggedMessage = await MessageChecker.getFlagged(this._message.guildId!, this._message)

		if (flaggedMessage) {
			this._logger.info(flaggedMessage, 'Flagged message found')
			await this._message.channel.send(MessageChecker.buildResponse(flaggedMessage))
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