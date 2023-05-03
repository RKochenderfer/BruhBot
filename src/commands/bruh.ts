import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bruh')
		.setDescription('Replies to sender with bruh.'),

	async execute(interaction: ChatInputCommandInteraction) {
		await interaction.reply('bruh')
	},
}
