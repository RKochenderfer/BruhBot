import { ChatInputCommandInteraction } from 'discord.js';
import { Logger } from 'pino';
import Handler from './handler';
import BotClient from '../models/bot-client';
import Command from '../command';
import { ChatInputCommandInteractionWrapper } from '../extensions/chat-input-command-interaction-wrapper';

export default class InteractionHandler implements Handler {
	constructor(
		private _logger: Logger,
		private _interaction: ChatInputCommandInteraction,
	) { }

	async execute() {
		const command = this.getCommand()		
		try {
			await command.execute(ChatInputCommandInteractionWrapper.from(this._interaction))
		} catch (error) {
			await this.resolveErroredInteractions()
			throw new Error('Error occurred while running interaction', { cause: error })
		}
	}

	private getCommand = (): Command => {
		const interactionClient = this._interaction.client as BotClient
		const command = interactionClient.commands?.get(this._interaction.commandName) as Command

		if (!command) {
			this._logger.error(`Command ${this._interaction.commandName} was not found`)
			throw new Error('Command not found')
		}

		return command
	}

	private resolveErroredInteractions = async () => {
		if (!this._interaction.deferred && !this._interaction.replied) {
			await this._interaction.reply({
				content: 'There was an error executing this command!',
				ephemeral: true,
			})
		} else if (this._interaction.deferred && !this._interaction.replied) {
			await this._interaction.followUp({
				content: 'There was an error executing this command!',
				ephemeral: true,
			})
		}
	}
}