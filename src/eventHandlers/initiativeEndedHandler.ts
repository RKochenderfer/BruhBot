import { Logger } from 'pino'
import { Handler } from '.'
import { Notification } from '../events'
import { InitiativeEnded } from '../events/initiativeEnded'
import { InitiativeService } from '../services/initiativeService'
import { RollDisplayService } from '../services/rollDisplayService'

export class InitiativeEndedHandler implements Handler {
	constructor(
		private readonly _initiativeService: InitiativeService,
		private readonly _rollDisplayService: RollDisplayService,
	) {}

	handle = async (logger: Logger, data: Notification<InitiativeEnded>) => {
		logger.debug(
			`Started to handle initiative started event for GuildId: ${data.data.guildId} and ChannelId: ${data.data.channelId}`,
		)

		try {
			const rolls = this._initiativeService.endInitiative(data.data)
			const displayString = this._rollDisplayService.createInitiativeDisplay(rolls)
			const channel = data.data.interaction.textChannel!
			await channel.send(displayString)
		} catch (error) {
			await data.data.interaction.textChannel!.send(error)
		}

		logger.debug('Completed handling initiative started event')
	}
}
