import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction } from 'discord.js'
import { Command } from './Command'
import { AsciiTable } from '../AsciiTable'

export class RollCommand extends Command {
	private static dieCountName = 'count'
	private static diceTypeName = 'type'
	private static rollTypeName = 'roll'

	constructor() {
		super('roll', 'rolls the specified die and the number to be rolled')
	}

	private displayRoll(
		dieCount: number,
		dieType: number,
		values: number[],
	): string {
		const data = [
			['Die Count', 'Die Type', 'Values', 'Total'],
			[
				dieCount,
				`d${dieType}`,
				values.toString(),
				values.reduce((prev, curr) => prev + curr, 0),
			],
		]
		const asciiTable = new AsciiTable('Roll Info')
		let string = asciiTable.render(data)

		return string
	}

	buildCommand(): SlashCommandBuilder {
		let builder = super.buildCommand()

		builder.addStringOption(option =>
			option
				.setName(RollCommand.rollTypeName)
				.setDescription('number and type of dice to roll. ex: 2d6')
				.setRequired(true),
		)

		return builder
	}

	private getRandomInt(type: number) {
		return Math.floor(Math.random() * type) + 1
	}

	async execute(interaction: CommandInteraction) {
		const regex = /^\d+d\d+$/

		const rollString = interaction.options.getString(RollCommand.rollTypeName)!
		if (!regex.test(rollString)) {
			interaction.reply({ content: 'Your roll must be formatted as #d#' })
			return
		}

		const split = rollString.split('d')
		const dieCount = Number.parseInt(split[0])
		const dieType = Number.parseInt(split[1])

		let values = []
		for (let i = 0; i < dieCount; i++) {
			values.push(this.getRandomInt(dieType))
		}

		interaction.reply({
			content: this.displayRoll(dieCount, dieType, values)
		})
	}
}
