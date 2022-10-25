import { SlashCommandBuilder } from 'discord.js'
import { CommandInteraction } from 'discord.js'
import { Command } from './Command'
import { AsciiTable } from '../AsciiTable'
import { Parser } from 'expr-eval'

export class RollCommand extends Command {
	private static dieCountName = 'count'
	private static diceTypeName = 'type'
	private static rollTypeName = 'roll'
	private static isWhisperName = 'whisper'
	private static parser = new Parser()

	constructor() {
		super('roll', 'rolls the specified die and the number to be rolled')
	}

	private displayRoll(
		dieCount: number,
		dieType: number,
		modifier: string,
		values: number[],
	): string {
		let rollEntry = `${dieCount}d${dieType}${modifier}`

		let mod = modifier === '' ? 0 : RollCommand.parser.evaluate(modifier)

		const data = [
			['Roll', 'Values', 'Total'],
			[
				rollEntry,
				values.toString(),
				values.reduce((prev, curr) => prev + curr, 0) + mod,
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
		builder.addBooleanOption(option =>
			option
				.setName(RollCommand.isWhisperName)
				.setDescription('whisper the roll the user')
				.setRequired(false),
		)

		return builder
	}

	private getRandomInt(type: number) {
		return Math.floor(Math.random() * type) + 1
	}

	async execute(interaction: CommandInteraction) {
		let values = []
		const regex = /^\d+d\d+([+|-]\d)?/

		const rollString = interaction.options.getString(
			RollCommand.rollTypeName,
		)!
		const isWhisper = interaction.options.getBoolean(
			RollCommand.isWhisperName,
		)
		if (!regex.test(rollString)) {
			interaction.reply({
				content: 'Your roll must be formatted as `#d#` or `#d#[+|-]#`',
			})
			return
		}

		let split = rollString.split('d')
		let dieType = 0
		let modifier = 0
		let modString = ''
		const additionIndex = split[1].indexOf('+')
		const subtractionIndex = split[1].indexOf('-')
		const dieCount = Number.parseInt(split[0])

		let firstIndex = -1
		if (additionIndex < 0 && subtractionIndex > 0) {
			firstIndex = subtractionIndex
		} else if (additionIndex > 0 && subtractionIndex < 0) {
			firstIndex = additionIndex
		} else {
			firstIndex = additionIndex < subtractionIndex ? additionIndex : subtractionIndex
		}

		if (firstIndex === -1) {
			dieType = Number.parseInt(split[1])
		} else {
			modString = split[1].substring(firstIndex)
			dieType = Number.parseInt(split[1].substring(0, firstIndex))
		}
		
		for (let i = 0; i < dieCount; i++) {
			values.push(this.getRandomInt(dieType))
		}

		console.log(
			`--------------\n*ROLL COMMAND*\nDie Count: ${dieCount}\nDie Type: ${dieType}\nModifier: ${modString}\nValues: ${values}\n--------------`,
		)

		interaction.reply({
			content: this.displayRoll(dieCount, dieType, modString, values),
			ephemeral: isWhisper ? true : false,
		})
	}
}
