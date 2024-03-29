import { CommandInteraction, SlashCommandBuilder } from 'discord.js'
import { updatePins } from '../update-pins'
import { logger } from '../utils/logger'

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addpins')
		.setDescription('Adds all pinned comments to quote database'),

	/**
	 * Goes through every channel in the sender's server and adds them to the database
	 * @param interaction
	 */
	async execute(interaction: CommandInteraction) {
		try {
			await updatePins(
				interaction.guild!.channels.cache!,
				interaction.guildId!,
				interaction.guild!.name!,
			)
		} catch (error) {
			logger.error(error)
			throw error
		}

		interaction.reply({
			content: 'Complete',
			ephemeral: true,
		})
	},
}
