import { Logger } from 'pino'
import { DiceRolledInfo } from '../models/diceRolledInfo'
import { Handler } from '.'
import { Notification } from '../events'
import { InitiativeCache } from '../caches/initiativeCache'

export class DiceRolledHandler implements Handler {
	constructor(private readonly _initiativeCache: InitiativeCache) {}

	handle = async (logger: Logger, data: Notification<DiceRolledInfo>): Promise<void> => {
		logger.debug('Started to handle dice rolled event')

		const rollInfo = data.data
		this._initiativeCache.addDiceRoll(rollInfo)

		logger.debug('Completed handling dice rolled event')
	}
}
