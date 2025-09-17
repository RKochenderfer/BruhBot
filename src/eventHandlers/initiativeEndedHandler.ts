import { Logger } from 'pino'
import { Handler } from '.'
import { Notification } from '../events'
import { InitiativeEnded } from '../events/initiativeEnded'
import { DiceRolledInfo } from '../models/diceRolledInfo'
import { AsciiTable, RenderRequest } from '../ascii-table'
import { InitiativeService } from '../services/initiativeService'

export class InitiativeEndedHandler implements Handler {
	constructor(
		private readonly _initiativeService: InitiativeService,
		private readonly _asciiTableHelper: AsciiTable,
	) {}

	handle = async (logger: Logger, data: Notification<InitiativeEnded>) => {
		logger.debug(
			`Started to handle initiative started event for GuildId: ${data.data.guildId} and ChannelId: ${data.data.channelId}`,
		)

		try {
			const rolls = this._initiativeService.endInitiative(data.data)
			const displayString = this.createDisplayString(rolls)
			const channel = data.data.interaction.textChannel!
			await channel.send(displayString)
		} catch (error) {
			await data.data.interaction.textChannel!.send(error)
		}

		logger.debug('Completed handling initiative started event')
	}

	private createDisplayString(rolls: DiceRolledInfo[]): string {
		const headers = ['Name', 'Modifiers', 'Total']
		const data: string[][] = rolls.map(x => [x.name, x.roll.modifier, x.roll.total.toString()])

		const renderRequest = RenderRequest.from(headers, data)
		// the encasing ` are there so discord will format the table as code and use mono-spacing font
		return '`' + this._asciiTableHelper.renderRequest(renderRequest) + '`'
	}
}
