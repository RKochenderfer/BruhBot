import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction } from 'discord.js'
import { Command } from './Command'
import { AsciiTable } from '../AsciiTable'

export class RollCommand extends Command {
	private static dieCountName = 'count'
	private static diceTypeName = 'type'

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
		// return AsciiTable.default.run([['x', 'y'], ['a', 'b'], ['c', 'd']])
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

		interaction.reply({
			content: `${this.displayRoll(dieCount, dieType, values)}`,
		})
	}
}
