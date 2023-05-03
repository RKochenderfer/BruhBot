import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
import * as db from '../db'

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rmphrase')
		.setDescription('Removes a phrase from the message checker')
		.addStringOption(option =>
			option
				.setName('key')
				.setDescription('Removes a phrase from the message checker')
				.setRequired(true),
		),

	async execute(interaction: ChatInputCommandInteraction) {
		await interaction.deferReply()

		const key = interaction.options.getString('key')!

		const serverExists = await db.collections.servers?.findOne({
			guildId: interaction.guildId!,
		})

		if (!serverExists) {
			interaction.followUp(
				'Your Discord server was not found in the database',
			)
			return
		}

		const res = await db.collections.servers?.updateOne(
			{ guildId: interaction.guildId! },
			{ $pull: { flaggedPatterns: { key: key } } },
		)

		if (!res)
			throw new Error('Database error. Unable to remove flaggedPhrase.')

		interaction.followUp({
			content:
				res?.modifiedCount === 1
					? `Phrase with key: ${key} was removed.`
					: `Key: ${key} was not found.`,
			ephemeral: true,
		})
	},
}
