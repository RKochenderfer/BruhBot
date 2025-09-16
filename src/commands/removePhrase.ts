import { SlashCommandBuilder } from 'discord.js'
import Command from '../command'
import { ChatInputCommandInteractionWrapper } from '../extensions/chatInputCommandInteractionWrapper'
import GuildCache from '../caches/guildCache'
import { Logger } from 'pino'

export default class RemovePhrase extends Command {
	constructor(private _guildCache: GuildCache) {
		const name = 'rmphrase'
		const data = new SlashCommandBuilder()
			.setName('rmphrase')
			.setDescription('Removes a phrase from the message checker')
			.addStringOption(option =>
				option.setName('key').setDescription('Removes a phrase from the message checker').setRequired(true),
			)

		super(name, data)
	}

	execute = async (logger: Logger, interaction: ChatInputCommandInteractionWrapper): Promise<void> => {
		logger.info('Started to remove flagged phrase from guild')

		if (interaction.isNotAdmin()) {
			interaction.reply({ content: 'Only an Admin can use this command', ephemeral: true })
			return
		}
		await interaction.deferReply()

		const key = interaction.options.getString('key')!
		await this._guildCache.removeFlaggedPattern(interaction.guildId!, key)

		await interaction.followUp({
			content: `Pattern with key ${key} has been removed`,
			ephemeral: true,
		})

		logger.info('Completed removing flagged phrase from guild')
	}
}
