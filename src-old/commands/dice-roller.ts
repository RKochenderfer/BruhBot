import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
import { Parser } from 'expr-eval'
import { AsciiTable } from '../ascii-table'

interface RollInformation {
	diceCount: number
	dieType: number
	modifier: string
	values: number[]
}

const parser = new Parser()

const getRandomInt = (type: number) => {
	return Math.floor(Math.random() * type) + 1
}

const displayRoll = (rollInfo: RollInformation): string => {
	const rollEntry = `${rollInfo.diceCount}d${rollInfo.dieType}${rollInfo.modifier}`

	const mod =
		rollInfo.modifier === '' ? 0 : parser.evaluate(rollInfo.modifier)
	const data = [
		['Roll', 'Values', 'Total'],
		[
			rollEntry,
			rollInfo.values.toString(),
			rollInfo.values.reduce((prev, curr) => prev + curr, 0) + mod,
		],
	]

	const asciiTable = new AsciiTable()

	return asciiTable.render(data)
}

const processRoll = async (rollString: string): Promise<string> => {
	const values = []
	const split = rollString.split('d')
	let dieType = 0
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
		firstIndex =
			additionIndex < subtractionIndex ? additionIndex : subtractionIndex
	}

	if (firstIndex === -1) {
		dieType = Number.parseInt(split[1])
	} else {
		modString = split[1].substring(firstIndex)
		dieType = Number.parseInt(split[1].substring(0, firstIndex))
	}

	for (let i = 0; i < dieCount; i++) {
		values.push(getRandomInt(dieType))
	}

	return displayRoll({
		diceCount: dieCount,
		dieType: dieType,
		modifier: modString,
		values: values,
	} as RollInformation)
}

/**
 * Rolls dice through discord
 */
module.exports = {
	data: new SlashCommandBuilder()
		.setName('roll')
		.setDescription(
			'rolls the specified die and the number of dice to be rolled',
		)
		.addStringOption(option =>
			option
				.setName('dice')
				.setDescription('Number and type of dice to roll. ex: 2d6+1')
				.setRequired(true),
		)
		.addBooleanOption(option =>
			option
				.setName('whisper')
				.setDescription('whisper the roll to the sender')
				.setRequired(false),
		),

	async execute(interaction: ChatInputCommandInteraction) {
		const regex = /^\d+d\d+([+|-]\d)?/

		const rollString = interaction.options.getString('dice')
		const isWhisper = interaction.options.getBoolean('whisper') ?? false

		if (!rollString) return

		// validate that the roll is using the correct format
		if (!regex.test(rollString)) {
			interaction.reply({
				content: 'Your roll must be formatted as `#d# or `#d#[+|-]#`',
				ephemeral: true,
			})
			return
		}

		interaction.reply({
			content: await processRoll(rollString),
			ephemeral: isWhisper,
		})
	},
}
