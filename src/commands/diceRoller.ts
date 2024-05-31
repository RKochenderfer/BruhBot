import { SlashCommandBuilder } from 'discord.js'
import { Parser } from 'expr-eval'
import { AsciiTable } from '../ascii-table'
import Command from '../command'
import { ChatInputCommandInteractionWrapper } from '../extensions/chatInputCommandInteractionWrapper'
import GuildCache from '../caches/guildCache'
import { Logger } from 'pino'

interface RollInformation {
	diceCount: number
	dieType: number
	modifier: string
	values: number[]
}

export default class DiceRoller extends Command {
	private readonly _regex = /^\d+d\d+([+|-]\d)?/
	private readonly _parser: Parser

	constructor(private _logger: Logger) {
		const name = 'roll'
		const data = new SlashCommandBuilder()
			.setName('roll')
			.setDescription('rolls the specified die and the number of dice to be rolled')
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
			)

		super(name, data)
		this._parser = new Parser()
	}

	execute = async (interaction: ChatInputCommandInteractionWrapper): Promise<void> => {
		this._logger.debug('Started to roll dice')

		const rollString = interaction.options.getString('dice')
		const isWhisper = interaction.options.getBoolean('whisper') ?? false

		if (!rollString) return

		// validate that the roll is using the correct format
		if (!this._regex.test(rollString)) {
			await interaction.reply({
				content: 'Your roll must be formatted as `#d# or `#d#[+|-]#`',
				ephemeral: true,
			})
			return
		}

		await interaction.reply({
			content: await this.processRoll(rollString),
			ephemeral: isWhisper,
		})

		this._logger.debug('Completed roll')
	}

	private processRoll = async (rollString: string): Promise<string> => {
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

		return this.displayRoll({
			diceCount: dieCount,
			dieType: dieType,
			modifier: modString,
			values: values,
		} as RollInformation)
	}

	private displayRoll = (rollInfo: RollInformation): string => {
		const rollEntry = `${rollInfo.diceCount}d${rollInfo.dieType}${rollInfo.modifier}`

		const mod = rollInfo.modifier === '' ? 0 : this._parser.evaluate(rollInfo.modifier)
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

	private getRandomInt = (type: number) => {
		return Math.floor(Math.random() * type) + 1
	}
}
