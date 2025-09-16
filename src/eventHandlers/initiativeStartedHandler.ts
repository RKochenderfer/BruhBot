import { Logger } from 'pino'
import { Handler } from '.'
import { InitiativeStarted } from '../events/initiativeStarted'
import { Notification } from '../events'
import { InitiativeCache } from '../caches/initiativeCache'

export class InitiativeStartedHandler implements Handler {
	constructor(private readonly _initiativeCache: InitiativeCache) {}

	handle = async (logger: Logger, data: Notification<InitiativeStarted>) => {
		logger.debug(
			`Started to handle initiative started event for GuildId: ${data.data.guildId} and ChannelId: ${data.data.channelId}`,
		)

		try {
			this._initiativeCache.startInitiative(data.data.guildId, data.data.channelId)
		} catch (error) {
			if (this._initiativeCache.hasInitiativeTrackingStartedFor(data.data.guildId, data.data.channelId)) {
				data.data.interaction.reply({
					content: 'The initiative tracking has already started here',
					flags: 'Ephemeral',
				})
			} else {
				data.data.interaction.reply({
					content: 'Something went wrong',
					flags: 'Ephemeral',
				})
				logger.error(error, 'An error occurred while trying to start initiative')
			}
		}

		logger.debug('Completed handling initiative started event')
	}
}
