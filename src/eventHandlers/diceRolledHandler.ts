import { Logger } from 'pino'
import { DiceRolledInfo } from '../models/diceRolledInfo'
import { Handler } from '.'
import { Notification } from '../events'
import { InitiativeService } from '../services/initiativeService'

export class DiceRolledHandler implements Handler {
	constructor(private readonly _initiativeService: InitiativeService) {}

	handle = async (logger: Logger, data: Notification<DiceRolledInfo>): Promise<void> => {
		logger.debug('Started to handle dice rolled event')

		if (this._initiativeService.hasActiveInitiativeGathering(data.data)) {
			this._initiativeService.addDiceRoll(data.data)
		}

		logger.debug('Completed handling dice rolled event')
	}
}
