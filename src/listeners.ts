import {
	BaseGuildTextChannel,
	BaseInteraction,
	ChatInputCommandInteraction,
	Message,
	TextBasedChannel,
} from 'discord.js'
import { State } from '.'
import { updateCommands } from './command-updater'
import { render } from './ace'
import { updatePins } from './update-pins'
import { logger } from './utils/logger'
import { ServerState } from './models/state'
import BotClient from './models/bot-client'
import Command from './command'
import { MessageChecker } from '.'
import { ChatInputCommandInteractionWrapper } from './extensions/chat-input-command-interaction-wrapper'
import * as db from './db'

/**
 * Handles the MessageCreate event
 * @param message - The sent message
 */
export const onMessageCreate = async (message: Message<boolean>) => {
	if (message.author.bot) return
	if (message.content === '!deploy' && message.author.id === '208376655129870346') {
		await updateCommands(message)
		return
	} else if (message.content.match(/^!ace \d+$/)) {
		message.reply('Starting render')
		render(message)
		return
	}

	// Check is message is part of the flagged phrases
	try {
		const flaggedMessage = await MessageChecker.getFlagged(message.guildId!, message)
		if (flaggedMessage !== null) {
			await message.channel.send(MessageChecker.buildResponse(flaggedMessage))
			return
		}
	} catch (error) {
		logger.error(error.message, error, message)
		return
	}

	logger.debug(message)
}

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
				db.collections.servers,
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
