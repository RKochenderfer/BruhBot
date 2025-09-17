import { Logger } from 'pino'
import { Handler } from '.'
import { InitiativeStarted } from '../events/initiativeStarted'
import { Notification } from '../events'
import { InitiativeService } from '../services/initiativeService'

export class InitiativeStartedHandler implements Handler {
	constructor(private readonly _initiativeService: InitiativeService) {}

	handle = async (logger: Logger, data: Notification<InitiativeStarted>) => {
		logger.debug(
			`Started to handle initiative started event for GuildId: ${data.data.guildId} and ChannelId: ${data.data.channelId}`,
		)

		try {
			this._initiativeService.startInitiative(data.data)
		} catch (error: unknown) {
			const err = error as Error
			if (err.name === 'InitiativeError') {
				logger.debug(err, 'an initiative error was thrown')
				data.data.interaction.reply({
					content: err.message,
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
