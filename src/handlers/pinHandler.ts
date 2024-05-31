import { Logger } from 'pino'
import Handler from './handler'
import { BaseGuildTextChannel, Collection, GuildBasedChannel } from 'discord.js'
import GuildCache from '../caches/guildCache'
import Pin from '../models/pin'

export default class PinHandler extends Handler {
	constructor(
		private _logger: Logger,
		private _channel: BaseGuildTextChannel,
		private _guildCache: GuildCache,
	) {
		super()
	}

	async execute(): Promise<void> {
		this._logger.debug('Started to handle pins')

		const pins = await this.aggregatePins(this._channel.guild.channels.cache)
		await this._guildCache.updatePins(this._channel.guildId, pins)


		this._logger.debug('Completed handling pins')
	}

	private aggregatePins = async (guildChannels: Collection<string, GuildBasedChannel>): Promise<Pin[]> => {
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
