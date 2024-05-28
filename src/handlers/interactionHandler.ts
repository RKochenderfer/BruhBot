import { ChatInputCommandInteraction } from 'discord.js';
import { Logger } from 'pino';
import GuildCache from '../caches/guildCache';
import Handler from './handler';
import BotClient from '../models/bot-client';
import Command from '../command';

export default class InteractionHandler implements Handler {
	constructor(
		private _logger: Logger,
		private _interaction: ChatInputCommandInteraction,
		private _guildCache: GuildCache,
	) { }

	async execute() {
		const command = this.getCommand()
		command.execute(this._interaction)
	}

	private getCommand(): Command {
		const interactionClient = this._interaction.client as BotClient
		const command = interactionClient.commands?.get(this._interaction.commandName) as Command

		if (!command) {
			this._logger.error(`Command ${this._interaction.commandName} was not found`)
			throw new Error('Command not found')
		}

		return command
	}
}