import {
	BaseGuildTextChannel,
	CommandInteraction,
	SlashCommandBuilder,
} from 'discord.js'
import * as db from '../db'
import Pin from '../models/pin'

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addpins')
		.setDescription('Adds all pinned comments to quote database'),

	/**
	 * Goes through every channel in the sender's server and adds them to the database
	 * @param interaction
	 */
	async execute(interaction: CommandInteraction) {
		const channels = interaction.guild?.channels.cache!
		let pins: Pin[] = []

		for (let [_channelId, base] of channels) {
			if (base.isTextBased() && !base.isVoiceBased()) {
				const textChannel = base as BaseGuildTextChannel
				const pinnedMessages = await textChannel.messages.fetchPinned()
				pins = [
					...pins,
					...pinnedMessages.map(
						(message, _id) =>
							new Pin(
								message.content,
								message.createdTimestamp.toString(),
								message.author.id,
							),
					),
				]
			}
		}

		try {
			const key = { guildId: interaction.guildId! }
			const newValues = {
				$set: {
					name: interaction.guild!.name,
					pins: pins,
					guildId: interaction.guildId!,
				},
			}
			db.collections.servers?.updateOne(
				key,
				newValues,
				{ upsert: true },
			)
		} catch (error) {
			console.error(error)
			throw error
		}

		interaction.reply({
			content: 'Complete',
			ephemeral: true,
		})
	},
}
