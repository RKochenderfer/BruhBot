import { SlashCommandBuilder } from 'discord.js'
import Command from '../command'
import { ChatInputCommandInteractionWrapper } from '../extensions/chatInputCommandInteractionWrapper'
import { Logger } from 'pino'
import { EventBus, Notification } from '../events'
import { InitiativeStarted } from '../events/initiativeStarted'
import { InitiativeCache } from '../caches/initiativeCache'
import { AsciiTable, RenderRequest } from '../ascii-table'
import { DiceRolledInfo } from '../models/diceRolledInfo'

export default class Initiative extends Command {
	private readonly _eventBus: EventBus
	private readonly _initiativeCache: InitiativeCache
	private readonly _asciiTableHelper: AsciiTable
	private static readonly _stateSubcommandName: string = 'state'
	private static readonly _stateName: string = 'state'
	private static readonly _startChoice: string = 'start'
	private static readonly _endChoice: string = 'end'
	private static readonly _removeSubcommandName: string = 'remove'
	private static readonly _name: string = 'namefromtable'

	constructor(eventBus: EventBus, initiativeCache: InitiativeCache, asciiTableHelper: AsciiTable) {
		const name = 'initiative'
		const data = new SlashCommandBuilder()
			.setName(name)
			.setDescription('Handles initiative flow')
			.addSubcommand(subcommand =>
				subcommand
					.setName(Initiative._stateSubcommandName)
					.setDescription('Change the initiative state')
					.addStringOption(option =>
						option
							.setName(Initiative._stateName)
							.setDescription('Choose to start or end the initiative')
							.setRequired(true)
							.addChoices(
								{ name: Initiative._startChoice, value: Initiative._startChoice },
								{ name: Initiative._endChoice, value: Initiative._endChoice },
							),
					),
			)
			.addSubcommand(subcommand =>
				subcommand
					.setName(Initiative._removeSubcommandName)
					.setDescription('Remove an entry from the initiative')
					.addStringOption(option =>
						option
							.setName(Initiative._name)
							.setDescription('The name from the table you wish to remove')
							.setRequired(true),
					),
			)

		super(name, data)
		this._eventBus = eventBus
		this._initiativeCache = initiativeCache
		this._asciiTableHelper = asciiTableHelper
	}

	execute = async (logger: Logger, interaction: ChatInputCommandInteractionWrapper): Promise<void> => {
		logger.debug('Started to handling initiative command')

		try {
			await this.handleSubcommand(interaction, logger)
		} catch (error) {
			interaction.textChannel?.send('There was an error handling the initiative command')
			logger.error(error, 'Error while handling an initiative request')
		}

		logger.debug('Completed handling initiative command')
	}

	private async handleSubcommand(interaction: ChatInputCommandInteractionWrapper, logger: Logger) {
		switch (interaction.subcommand) {
			case Initiative._stateSubcommandName:
				await this.handleStateSubcommand(logger, interaction)
				break
			case Initiative._removeSubcommandName:
				await this.handleRemoveSubcommand(logger, interaction)
				break
			default:
				throw new Error('No subcommand found')
		}
	}

	private async handleRemoveSubcommand(logger: Logger, interaction: ChatInputCommandInteractionWrapper) {
		logger.debug('Started to handle remove command')
		const optionValue = interaction.options.getString(Initiative._name)

		if (!optionValue) {
			interaction.reply('Name must have a value')
			return
		}

		const removed = this._initiativeCache.removeFor(interaction.guildId!, interaction.channelId, optionValue)
		if (!removed) {
			interaction.reply({ content: 'There was no value to remove', flags: 'Ephemeral' })
		} else {
			interaction.reply({ content: 'Entry removed', flags: 'Ephemeral' })
		}

		const rolls = this._initiativeCache.getOrderedRolls(interaction.guildId!, interaction.channelId, true)
		const renderString = this.createDisplayString(rolls)

		interaction.textChannel!.send(renderString)
	}

	private createDisplayString(rolls: DiceRolledInfo[]): string {
		const headers = ['Name', 'Modifiers', 'Total']
		const data: string[][] = rolls.map(x => [x.name, x.roll.modifier, x.roll.total.toString()])

		const renderRequest = RenderRequest.from(headers, data)
		// the encasing ` are there so discord will format the table as code and use mono-spacing font
		return '`' + this._asciiTableHelper.renderRequest(renderRequest) + '`'
	}

	private async handleStateSubcommand(logger: Logger, interaction: ChatInputCommandInteractionWrapper) {
		logger.debug('Handle state command')
		const optionValue = interaction.options.getString(Initiative._stateName)

		if (!optionValue) {
			interaction.reply('The state option must have a value')
			return
		}

		if (optionValue === Initiative._startChoice) {
			this.handleStateStartChoice(logger, interaction)
		} else if (optionValue === Initiative._endChoice) {
			this.handleStateEndChoice(interaction, logger)
		} else {
			logger.error('Unknown option was selected for initiative command')
		}

		await this.replyToUserForStateSubcommand(interaction, optionValue === Initiative._startChoice)
	}

	private handleStateEndChoice(interaction: ChatInputCommandInteractionWrapper, logger: Logger) {
		const initiativeStarted = InitiativeStarted.from(
			interaction.guildId!,
			interaction.interaction.channelId,
			interaction,
		)
		const notification = Notification.from('initiativeEnded', initiativeStarted)
		this._eventBus.publish('initiativeEnded', notification, logger)
	}

	private handleStateStartChoice(logger: Logger, interaction: ChatInputCommandInteractionWrapper) {
		const initiativeStarted = InitiativeStarted.from(
			interaction.guildId!,
			interaction.interaction.channelId,
			interaction,
		)
		const notification = Notification.from('initiativeStarted', initiativeStarted)
		this._eventBus.publish('initiativeStarted', notification, logger)
	}

	private async replyToUserForStateSubcommand(interaction: ChatInputCommandInteractionWrapper, isStart: boolean) {
		if (isStart) {
			await interaction.reply({ content: 'Started initiative tracking', flags: 'Ephemeral' })
		} else {
			await interaction.reply({ content: 'Ended initiative tracking', flags: 'Ephemeral' })
		}
	}
}
