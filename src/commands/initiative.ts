import { SlashCommandBuilder } from 'discord.js'
import Command from '../command'
import { ChatInputCommandInteractionWrapper } from '../extensions/chatInputCommandInteractionWrapper'
import { Logger } from 'pino'
import { EventBus, Notification } from '../events'
import { InitiativeStarted } from '../events/initiativeStarted'

export default class Initiative extends Command {
	private readonly eventBus: EventBus
	private static readonly _startOrStopOptionName: string = 'state'
	private static readonly _startChoice: string = 'start'
	private static readonly _stopChoice: string = 'end'

	constructor(eventBus: EventBus) {
		const name = 'initiative'
		const data = new SlashCommandBuilder()
			.setName(name)
			.setDescription('Rolls initiative')
			.addStringOption(option =>
				option
					.setName(Initiative._startOrStopOptionName)
					.setDescription('Choose to start or end the initiative')
					.setRequired(true)
					.addChoices(
						{ name: Initiative._startChoice, value: Initiative._startChoice },
						{ name: Initiative._stopChoice, value: Initiative._stopChoice },
					),
			)

		super(name, data)
		this.eventBus = eventBus
	}

	execute = async (logger: Logger, interaction: ChatInputCommandInteractionWrapper): Promise<void> => {
		logger.debug('Started to handling initiative command')

		const optionValue = interaction.options.getString(Initiative._startOrStopOptionName)

		if (!optionValue) {
			interaction.reply('The state option must have a value')
		}

		if (optionValue === Initiative._startChoice) {
			const initiativeStarted = InitiativeStarted.from(
				interaction.guildId!,
				interaction.interaction.channelId,
				interaction,
			)
			const notification = Notification.from('initiativeStarted', initiativeStarted)
			this.eventBus.publish('initiativeStarted', notification, logger)
		} else if (optionValue === Initiative._stopChoice) {
			const initiativeStarted = InitiativeStarted.from(
				interaction.guildId!,
				interaction.interaction.channelId,
				interaction,
			)
			const notification = Notification.from('initiativeEnded', initiativeStarted)
			this.eventBus.publish('initiativeEnded', notification, logger)
		} else {
			logger.error('Unknown option was selected for initiative command')
		}

		try {
			await this.replyToUser(interaction, optionValue === Initiative._startChoice)
		} catch (error) {
			logger.error(error, 'There was an error while trying to reply to the initiative command')
		}

		logger.debug('Completed handling initiative command')
	}

	private async replyToUser(interaction: ChatInputCommandInteractionWrapper, isStart: boolean) {
		if (isStart) {
			await interaction.reply({ content: 'Started initiative tracking', flags: 'Ephemeral' })
		} else {
			await interaction.reply({ content: 'Ended initiative tracking', flags: 'Ephemeral' })
		}
	}
}
