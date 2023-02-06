import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
import { state } from '../index'

module.exports = {
	data: new SlashCommandBuilder()
		.setName('chatty')
		.setDescription('Toggles ability to chat')
		.addBooleanOption(option =>
			option
				.setName('enable')
				.setDescription('Enables chatty if true disables if false')
				.setRequired(true),
		),

	async execute(interaction: ChatInputCommandInteraction) {
		const enableStatus = interaction.options.getBoolean('enable')!
		if (state.chattyEnabled && !enableStatus) {
			state.chattyEnabled = false
			await interaction.reply('BruhBot chatty deactivated...')
		} else if (!state.chattyEnabled && enableStatus) {
			state.chattyEnabled = true
			await interaction.reply('BruhBot chatty activated...')
		}
	},
}
