import { AsciiTable, RenderRequest } from '../ascii-table'
import { DiceRolledInfo } from '../models/diceRolledInfo'

/**
 * Service for creating formatted roll tables to display on discord
 */
export class RollDisplayService {
	constructor(private _asciiTableHelper: AsciiTable) {}

	/**
	 * Creates the display string to be sent as the content of a message
	 * to discord made from an individual roll
	 */
	createSingleRollDisplay(rollInfo: DiceRolledInfo): string {
		const rollEntry = `${rollInfo.roll.diceCount}d${rollInfo.roll.dieType}${rollInfo.roll.modifierString}`
		const headers = ['Name', 'Roll', 'Values', 'Total']
		const dataRows: string[][] = [
			[rollInfo.name, rollEntry, rollInfo.roll.values.toString(), rollInfo.roll.total.toString()],
		]

		const renderRequest = RenderRequest.from(headers, dataRows)
		const tableString = this._asciiTableHelper.renderRequest(renderRequest)

		return this.formatAsCodeBlock(tableString)
	}

	/**
	 * Creates the display string to be sent as the content of a message
	 * to discord made from a series of roll making up an initiative order
	 */
	createInitiativeDisplay(rolls: DiceRolledInfo[]): string {
		const headers = ['Name', 'Modifiers', 'Total']
		const data: string[][] = rolls.map(x => [x.name, x.roll.modifierString, x.roll.total.toString()])

		const renderRequest = RenderRequest.from(headers, data)
		const tableString = this._asciiTableHelper.renderRequest(renderRequest)

		return this.formatAsCodeBlock(tableString)
	}

	private formatAsCodeBlock(table: string): string {
		return '```md\n' + table + '\n```'
	}
}
