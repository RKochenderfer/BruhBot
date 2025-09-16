import { SlashCommandBuilder } from 'discord.js'
import { Parser } from 'expr-eval'
import { AsciiTable } from '../ascii-table'
import Command from '../command'
import { ChatInputCommandInteractionWrapper } from '../extensions/chatInputCommandInteractionWrapper'
import { Logger } from 'pino'
import { EventBus } from '../events/eventBus'
import { RollInformation } from '../models/rollInformation'
import { DiceRolledInfo } from '../models/diceRolledInfo'
import { Notification } from '../events'

export default class DiceRoller extends Command {
	private readonly _regex = /^\d+d\d+([+|-]\d)?/
	private readonly _parser: Parser
	private readonly _eventBus: EventBus

	constructor(eventBus: EventBus) {
		const name = 'roll'
		const data = new SlashCommandBuilder()
			.setName('roll')
			.setDescription('rolls the specified die and the number of dice to be rolled')
			.addStringOption(option =>
				option.setName('dice').setDescription('Number and type of dice to roll. ex: 2d6+1').setRequired(true),
			)
			.addBooleanOption(option =>
				option.setName('whisper').setDescription('whisper the roll to the sender').setRequired(false),
			)

		super(name, data)
		this._parser = new Parser()
		this._eventBus = eventBus
	}

	execute = async (logger: Logger, interaction: ChatInputCommandInteractionWrapper): Promise<void> => {
		logger.debug('Started to roll dice')

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
		const rollInfo = this.processRoll(rollString)
		const displayRoll = this.displayRoll(rollInfo)
		const diceRolledInfo = DiceRolledInfo.from(
			rollInfo,
			interaction.userId,
			interaction.username,
			interaction.guildId!,
			interaction.interaction.channelId,
			new Date(),
		)
		const notification = Notification.from('diceRolled', diceRolledInfo)

		this._eventBus.publish('diceRolled', notification, logger)

		await interaction.reply({
			content: displayRoll,
			ephemeral: isWhisper,
		})

		logger.debug('Completed roll')
	}

	private processRoll(rollString: string): RollInformation {
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

		const mod = modString === '' ? 0 : this._parser.evaluate(modString)
		const total = values.reduce((prev, curr) => prev + curr, 0) + mod

		return RollInformation.from(dieCount, dieType, modString, values, total)
	}

	private displayRoll(rollInfo: RollInformation): string {
		const rollEntry = `${rollInfo.diceCount}d${rollInfo.dieType}${rollInfo.modifier}`
		const data = [
			['Roll', 'Values', 'Total'],
			[rollEntry, rollInfo.values.toString(), rollInfo.total],
		]

		const asciiTable = new AsciiTable()

		return asciiTable.render(data)
	}

	private getRandomInt(type: number): number {
		return Math.floor(Math.random() * type) + 1
	}
}
