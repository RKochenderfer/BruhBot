import { CommandInteraction, SlashCommandBuilder } from 'discord.js'

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clipshow')
		.setDescription(
			'Gets a random quote from the pinned list or previously pinned comments'
		),

	async execute(interaction: CommandInteraction) {
		// use mongodb to get a random entry
	}
}
