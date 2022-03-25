import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction } from 'discord.js'
import { Command } from './Command'

export class RollCommand extends Command {
	private static dieCountName = 'count'
	private static diceTypeName = 'type'

	constructor() {
		super('roll', 'rolls the specified die and the number to be rolled')
	}

	private getMidpointWhitespace(x: number, y: number): string {
		let whitespace = ''
		for (let i = 0; i < Math.floor((x - y) / 2); i++) {
			whitespace += ' '
		}
		return whitespace
	}

	private padWhitespace(currentLength: number, endLength: number) {
		let built = ''

		for (let i = currentLength; i < endLength; i++) {
			built += ' '
		}

		return built
	}

	private buildRollInfo(dieCount: number, dieType: number): string {
		// todo: test this
		let built = ``
		const test = `
		===========================
		| Dice Rolled | Dice Type |
		| ----------- | --------- |
		|     10      |    d6     |
		===========================
		`
		const outSideBar = '==========================='
		const tableHeader = `
		| Dice Rolled | Dice Type |
		| ----------- | --------- |
		`
		const diceRolledCharLength = dieCount.toString().length
		const dieTypeCharLength = dieType.toString().length
		const dieRolledCellLength = 13
		const diceTypeCellLength = 11

		const firstPartDiceRolledWithWhitespace = `${this.getMidpointWhitespace(
			dieRolledCellLength,
			diceRolledCharLength,
		)}${dieCount}`
		const diceRolledWithWhitespace = `${firstPartDiceRolledWithWhitespace}${this.padWhitespace(
			firstPartDiceRolledWithWhitespace.length,
			dieRolledCellLength,
		)}`

		const firstPartDiceTypeWithWhitespace = `${this.getMidpointWhitespace(
			diceTypeCellLength,
			dieTypeCharLength + 1,
		)}d${dieType}`
		const diceTypeWithWhitespace = `${firstPartDiceTypeWithWhitespace}${this.padWhitespace(
			firstPartDiceTypeWithWhitespace.length,
			diceTypeCellLength,
		)}`

		built = `
		${outSideBar}
		${diceRolledWithWhitespace}|${diceTypeWithWhitespace}
		${outSideBar}
		`

		return built
	}

	private rollResultsTable(vals: number[]): string {
		let rollPresentation = `YOUR ROLLS: ${vals}`
		let total = `YOUR TOTAL: ${vals.reduce((accumVal, curVal) => {
			return accumVal + curVal
		}, 0)}`
		let border = ''

		for (let i = 0; i < total.length; i++) {
			border += '='
		}

		let built = `
		${border}
		${rollPresentation}
		${border}
		${total}
		${border}
		`

		return built
	}

	private displayRoll(
		dieCount: number,
		dieType: number,
		values: number[],
	): string {
		const rollInfoTable = this.buildRollInfo(dieCount, dieType)

		const rollResultsTable = this.rollResultsTable(values)
		
		return `
		${rollInfoTable}
		${rollResultsTable}
		`
	}

	buildCommand(): SlashCommandBuilder {
		let builder = super.buildCommand()

		builder
			.addIntegerOption(option =>
				option
					.setName(RollCommand.dieCountName)
					.setDescription('The number of dice to be rolled')
					.setRequired(true),
			)
			.addIntegerOption(option =>
				option
					.setName(RollCommand.diceTypeName)
					.setDescription('The number of face on the die')
					.setRequired(true),
			)

		return builder
	}

	private getRandomInt(type: number) {
		return Math.floor(Math.random() * type) + 1
	}

	async execute(interaction: CommandInteraction) {
		const dieCount = interaction.options.getInteger(
			RollCommand.dieCountName,
		)
		const dieType = interaction.options.getInteger(RollCommand.diceTypeName)

		if (!dieCount || !dieType) {
			interaction.reply({ content: 'Uh oh, something went wrong!' })
			console.error(
				`Error: die count: ${dieCount} | die type: ${dieType}`,
			)
			return
		}

		let values = []
		for (let i = 0; i < dieCount; i++) {
			values.push(this.getRandomInt(dieType))
		}

		interaction.reply({ content: `${this.displayRoll(dieCount, dieType, values)}` })
	}
}
