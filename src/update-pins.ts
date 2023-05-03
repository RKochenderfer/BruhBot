import { BaseGuildTextChannel, Collection, GuildBasedChannel } from 'discord.js'
import Pin from './models/pin'
import * as db from './db'

export const updatePins = async (
	channels: Collection<string, GuildBasedChannel>,
	guildId: string,
	guildName: string,
) => {
	let pins: Pin[] = []

	for (const [_channelId, base] of channels) {
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
		const key = { guildId: guildId }
		const newValues = {
			$set: {
				name: guildName,
				pins: pins,
				guildId: guildId,
			},
		}
		db.collections.servers?.updateOne(key, newValues, { upsert: true })
	} catch (error) {
		console.error(error)
		throw error
	}
}
