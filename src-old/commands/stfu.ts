import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
import { getVoiceConnection } from '@discordjs/voice'
import { logger } from '../utils/logger'

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stfu')
		.setDescription('Disconnects bruhbot from a voice channel'),

	async execute(interaction: ChatInputCommandInteraction) {
		if (!interaction.guildId) return
		try {
			const connection = getVoiceConnection(interaction.guildId)

			connection?.destroy()
			interaction.reply({
				content: 'Attempting to disconnect',
				ephemeral: true,
			})
		} catch (error) {
			logger.error(error)
		}
	},
}
