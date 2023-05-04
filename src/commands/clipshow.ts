import { CommandInteraction, SlashCommandBuilder } from 'discord.js'
import * as db from '../db'

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clipshow')
		.setDescription(
			'Gets a random quote from the pinned list or previously pinned comments',
		),

	async execute(interaction: CommandInteraction) {
		const query = { guildId: interaction.guildId! }
		await interaction.deferReply()

		try {
			const result = await db.collections.servers?.findOne(query)

			if (!result) {
				await interaction.followUp(
					'There was an issue finding the server',
				)
				return
			}

			if (result.pins === null || result.pins?.length === 0) {
				await interaction.followUp('There are no pinned messages')
				return
			}

			const pinnedMessage =
				result.pins![Math.floor(Math.random() * result.pins!.length)]
			const author = await interaction.guild?.members.fetch(pinnedMessage.userId!)

			await interaction.followUp(`> ${pinnedMessage.message}\n\t-**${author?.nickname ? author.nickname : author?.user.username}**`)
		} catch (error) {
			interaction.followUp('there was an error')
		}

	},
}
