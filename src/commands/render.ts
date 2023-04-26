import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'

module.exports = {
	data: new SlashCommandBuilder()
		.setName('render')
		.setDescription('Renders out messages like Ace Attorney Bot.'),

	async execute(interaction: ChatInputCommandInteraction) {
		await interaction.reply('Rendering')
	},
}
