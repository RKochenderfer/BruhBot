import { SlashCommandBuilder } from 'discord.js'
import GuildCache from '../caches/guildCache';
import { ChatInputCommandInteractionWrapper } from '../extensions/chatInputCommandInteractionWrapper';
import { Logger } from 'pino';
import Command from '../command';

export default class Bruh extends Command {
	constructor(private _guildCache: GuildCache, private _logger: Logger) {
		const name = 'bruh'
		const data = new SlashCommandBuilder()
			.setName(name)
			.setDescription('Replies to sender with bruh.')

		super(name, data)
	}

	execute = async (interaction: ChatInputCommandInteractionWrapper): Promise<void> => {
		await interaction.reply('bruh')
	}
}
