import {
	BaseGuildTextChannel,
	BaseInteraction,
	ChatInputCommandInteraction,
	Message,
	TextBasedChannel,
} from 'discord.js'
import { State } from '.'
import { updatePins } from './update-pins'
import { logger } from './log/logger'
import { ServerState } from './models/state'
import BotClient from './models/bot-client'
import Command from './command'
import { ChatInputCommandInteractionWrapper } from './extensions/chat-input-command-interaction-wrapper'
import * as db from './db'
import LogSession from './log/logSession'
import { HandlerType } from './models/handlerType'

/**
 * Handles the ChannelPinsUpdate event
 * @param channel - The channel the pins were updated in
 */
export const onChannelPinsUpdate = async (channel: TextBasedChannel) => {
	try {
		const textChannel = channel as BaseGuildTextChannel
		await updatePins(
			textChannel.guild.channels.cache,
			textChannel.guildId,
			textChannel.guild.name,
		)
	} catch (error) {
		logger.error(error)
	}
}

/**
 * Handles the InteractionCreate event
 * @param baseInteraction - The interaction (slash command) used
 */
export const onInteractionCreate = async (baseInteraction: BaseInteraction) => {
	if (!baseInteraction.isChatInputCommand()) return
	if (!State.servers.has(baseInteraction.guildId!)) {
		State.servers.set(baseInteraction.guildId!, new ServerState())
	}

	const interaction = baseInteraction as ChatInputCommandInteraction
	const interactionClient = interaction.client as BotClient

	const command = interactionClient.commands?.get(interaction.commandName) as Command

	if (!command) {
		logger.info(`No command matching ${interaction.commandName} was found`)
		return
	}

	try {
		if (interaction.commandName.includes('phrase')) {
			await command.execute(
				ChatInputCommandInteractionWrapper.from(interaction),
				db.collections.servers!,
			)
		} else {
			await command.execute(interaction)
		}
	} catch (error) {
		logger.error(error, error.message, baseInteraction)

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
	logger.debug(baseInteraction)
}
