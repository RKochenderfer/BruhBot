import { SlashCommandBuilder } from 'discord.js'

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bruh')
		.setDescription('Replies to sender with bruh.'),

	async execute(interaction: any) {
		await interaction.reply('bruh')
	},
}
