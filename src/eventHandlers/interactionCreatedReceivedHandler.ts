import { Logger } from 'pino'
import { Notification } from '../events'
import { ChatInputCommandInteraction } from 'discord.js'
import BotClient from '../models/bot-client'
import Command from '../command'
import { ChatInputCommandInteractionWrapper } from '../extensions/chatInputCommandInteractionWrapper'
import { Handler } from '.'

/**
 * Handles a / command interaction from a user
 */
export class InteractionCreatedReceivedHandler implements Handler {
	handle = async (logger: Logger, data: Notification<ChatInputCommandInteraction>): Promise<void> => {
		logger.debug('Received interaction created event')

		try {
			// Interaction handling logic would go here
			const command = this.getCommand(logger, data.data)
			logger.debug(`Executing command: ${command.name}`)
			await command.execute(logger, ChatInputCommandInteractionWrapper.from(data.data))
		} catch (error) {
			this.resolveErroredInteraction(data.data)
			logger.error(error, 'Error occurred while handling interaction created event')
		}
		logger.debug('Completed handling interaction created event')
	}

	/**
	 * Retrieves the command associated with the interaction
	 * @param logger
	 * @param interaction
	 * @returns
	 */
	getCommand(logger: Logger, interaction: ChatInputCommandInteraction): Command {
		if (!interaction.client) {
			throw new Error('Interaction client is not defined')
		}
		const interactionClient = interaction.client as BotClient

		if (!interactionClient.commands) {
			throw new Error('Interaction client commands are not defined')
		}

		const command = interactionClient.commands.get(interaction.commandName) as Command

		if (!command) {
			logger.error(`Command ${interaction.commandName} was not found`)
			throw new Error('Command not found')
		}

		return command
	}

	/**
	 * Resolves the client interaction so it is not left pending in the discord view
	 * @param interaction
	 */
	private async resolveErroredInteraction(interaction: ChatInputCommandInteraction) {
		if (!interaction.deferred && !interaction.replied) {
			await interaction.reply({
				content: 'There was an error executing this command!',
				ephemeral: true,
			})
		} else if (interaction.deferred && !interaction.replied) {
			await interaction.followUp({
				content: 'There was an error executing this command!',
				ephemeral: true,
			})
		}
	}
}
