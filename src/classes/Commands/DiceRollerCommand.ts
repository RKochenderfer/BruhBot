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
		modifier: number,
		values: number[],
	): string {

		let rollEntry = ''
		if (modifier > 0) {
			rollEntry = `${dieCount}d${dieType}+${modifier}`
		} else if (modifier < 0) {
			rollEntry = `${dieCount}d${dieType}-${modifier}`
		} else {
			rollEntry = `${dieCount}d${dieType}`
		}
		
		const data = [
			['Roll', 'Values','Total'],
			[
				rollEntry,
				values.toString(),
				values.reduce((prev, curr) => prev + curr, 0) + modifier,
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
		const regex = /^\d+d\d+([+|-]\d)?/

		const rollString = interaction.options.getString(
			RollCommand.rollTypeName,
		)!
		if (!regex.test(rollString)) {
			interaction.reply({
				content: 'Your roll must be formatted as `#d#` or `#d#[+|-]#`',
			})
			return
		}

		let split = rollString.split('d')
		let dieType = 0
		let modifier = 0

		if (split[1].includes('+')) {
			const modSplit = split[1].split('+')
			dieType = Number.parseInt(modSplit[0])
			modifier = Number.parseInt(modSplit[1])
		} else if (split[1].includes('-')) {
			const modSplit = split[1].split('-')
			dieType = Number.parseInt(modSplit[0])
			modifier = -1 * Number.parseInt(modSplit[1])
		} else {
			dieType = Number.parseInt(split[1])
		}
		const dieCount = Number.parseInt(split[0])

		let values = []
		for (let i = 0; i < dieCount; i++) {
			values.push(this.getRandomInt(dieType))
		}

		interaction.reply({
			content: this.displayRoll(dieCount, dieType, modifier, values),
		})
	}
}
