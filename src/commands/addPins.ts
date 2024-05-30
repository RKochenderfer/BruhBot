import {
	BaseGuildTextChannel,
	Collection,
	GuildBasedChannel,
	SlashCommandBuilder,
} from 'discord.js'
import Command from '../command'
import GuildCache from '../caches/guildCache'
import { Logger } from 'pino'
import { ChatInputCommandInteractionWrapper } from '../extensions/chatInputCommandInteractionWrapper'
import Pin from '../models/pin'

export default class AddPins extends Command {
	constructor(private _guildCache: GuildCache, private _logger: Logger) {
		const name = 'addpins'
		const data = new SlashCommandBuilder()
			.setName('addpins')
			.setDescription('Adds all pinned comments to quote database')

		super(name, data)
	}

	execute = async (interaction: ChatInputCommandInteractionWrapper): Promise<void> => {
		this._logger.debug('Started to add pins')

		const pins = await this.aggregatePins(interaction.guild!.channels.cache)
		await this._guildCache.updatePins(interaction.guildId!, pins)

		this._logger.debug('Completed adding pins')
	}

	private aggregatePins = async (
		guildChannels: Collection<string, GuildBasedChannel>,
	): Promise<Pin[]> => {
		let pins: Pin[] = []

		for (const [_channelId, guildBaseChannel] of guildChannels) {
			if (guildBaseChannel.isTextBased()) {
				const textChannel = guildBaseChannel as BaseGuildTextChannel
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

		return pins
	}
}
