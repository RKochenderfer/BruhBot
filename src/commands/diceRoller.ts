import { GuildMember, SlashCommandBuilder } from 'discord.js'
import { Parser } from 'expr-eval'
import Command from '../command'
import { ChatInputCommandInteractionWrapper } from '../extensions/chatInputCommandInteractionWrapper'
import { Logger } from 'pino'
import { EventBus } from '../events/eventBus'
import { RollInformation } from '../models/rollInformation'
import { DiceRolledInfo } from '../models/diceRolledInfo'
import { Notification } from '../events'
import { RollDisplayService } from '../services/rollDisplayService'

export default class DiceRoller extends Command {
	/**
	 * Checks to see if the string matches the values xdy where x and y are any number, and the letter d is in there.
	 * Also adds a check to make sure if there is a modifier it is entered correctly
	 */
	private readonly _diceRollRegex = /^\d*d\d+([+|-]\d)?/
	private readonly _parser: Parser
	private readonly _eventBus: EventBus
	private readonly _rollDisplayService: RollDisplayService

	private static readonly _rollCommandName: string = 'roll'
	private static readonly _diceOptionName: string = 'dice'
	private static readonly _whisperOptionName: string = 'whisper'
	private static readonly _nameOptionName: string = 'name'

	constructor(eventBus: EventBus, rollDisplayService: RollDisplayService) {
		const data = new SlashCommandBuilder()
			.setName(DiceRoller._rollCommandName)
			.setDescription('rolls the specified die and the number of dice to be rolled')
			.addStringOption(option =>
				option
					.setName(DiceRoller._diceOptionName)
					.setDescription('Number and type of dice to roll. ex: 2d6+1')
					.setRequired(true),
			)
			.addBooleanOption(option =>
				option
					.setName(DiceRoller._whisperOptionName)
					.setDescription('whisper the roll to the sender')
					.setRequired(false),
			)
			.addStringOption(option =>
				option.setName(DiceRoller._nameOptionName).setDescription('the name of the entity the roll is for'),
			)

		super(DiceRoller._rollCommandName, data)
		this._parser = new Parser()
		this._eventBus = eventBus
		this._rollDisplayService = rollDisplayService
	}

	execute = async (logger: Logger, interaction: ChatInputCommandInteractionWrapper): Promise<void> => {
		logger.debug('Started to roll dice')

		const rollString = interaction.options.getString(DiceRoller._diceOptionName)
		const isWhisper = interaction.options.getBoolean(DiceRoller._whisperOptionName) ?? false
		const optionalName = interaction.options.getString(DiceRoller._nameOptionName)
		const member = interaction.interaction.member! as GuildMember
		const name = optionalName === null ? member.displayName : optionalName

		if (!rollString) return

		// validate that the roll is using the correct format
		if (!this._diceRollRegex.test(rollString)) {
			await interaction.reply({
				content: 'Your roll must be formatted as `#d# or `#d#[+|-]#`',
				ephemeral: true,
			})
			return
		}
		try {
			const rollInfo = this.processRoll(rollString)
			const diceRolledInfo = DiceRolledInfo.from(
				rollInfo,
				interaction.userId,
				name,
				interaction.guildId!,
				interaction.interaction.channelId,
				new Date(),
			)
			const displayRoll = this._rollDisplayService.createSingleRollDisplay(diceRolledInfo)

			const notification = Notification.from('diceRolled', diceRolledInfo)

			this._eventBus.publish('diceRolled', notification, logger)

			await interaction.reply({
				content: displayRoll,
				ephemeral: isWhisper,
			})
		} catch (error) {
			logger.error(error, 'There was an error while trying to roll a die')
		}

		logger.debug('Completed roll')
	}

	private processRoll(rollString: string): RollInformation {
		const values = []
		const split = rollString.split('d')
		let dieType = 0
		let modString = ''
		const additionIndex = split[1].indexOf('+')
		const subtractionIndex = split[1].indexOf('-')
		const dieCount = split[0] === '' ? 1 : Number.parseInt(split[0])

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

		return RollInformation.from(dieCount, dieType, modString, mod, values, total)
	}

	private getRandomInt(type: number): number {
		return Math.floor(Math.random() * type) + 1
	}
}
