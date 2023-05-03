import {
	BaseGuildTextChannel,
	BaseInteraction,
	ChatInputCommandInteraction,
	Message,
	TextBasedChannel,
} from 'discord.js'
import { ChatBot, Logger, State } from '.'
import { updateCommands } from './command-updater'
import { render } from './ace'
import { logMessage } from './utils'
import { updatePins } from './update-pins'
import * as utils from './utils'
import { ServerState } from './models/state'
import BotClient from './models/bot-client'
import Command from './command'
import { MessageChecker } from '.'

/**
 * Handles the MessageCreate event
 * @param message - The sent message
 */
export const onMessageCreate = async (message: Message<boolean>) => {
	if (message.author.bot) return
	if (
		message.content === '!deploy' &&
		message.author.id === '208376655129870346'
	) {
		await updateCommands(message)
		return
	} else if (message.content.match(/^!ace \d+$/)) {
		message.reply('Starting render')
		render(message)
		return
	}

	const start = Date.now()
	// Check is message is part of the flagged phrases
	try {
		const flaggedMessage = await MessageChecker.getFlagged(message.guildId!, message)
		if (flaggedMessage !== null) {
			await message.channel.send(MessageChecker.buildResponse(flaggedMessage))
			return
		}
	} catch (error) {
		await logMessage(message, start, error)
		return
	}

	await logMessage(message, start)
	if (
		State.servers.has(message.guildId!) &&
		State.servers.get(message.guildId!)!.chattyEnabled
	) {
		try {
			// Reach out to chatbot to get reply
			const reply = await ChatBot.getResponse(
				message.content,
				message.guildId!,
			)
			if (!reply) return
			await message.channel.send({ content: reply![0].text })
		} catch (error) {
			await Logger.logError(error)
		}
	}
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
		console.error(error)
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

	const command = interactionClient.commands?.get(
		interaction.commandName,
	) as Command

	if (!command) {
		Logger.logWarn(
			`No command matching ${interaction.commandName} was found`,
		)
		return
	}

	const start = Date.now()
	try {
		await command.execute(interaction)
	} catch (error) {
		utils.logInteraction(
			baseInteraction,
			interaction.commandType.toString(),
			interaction.commandName,
			start,
			error,
		)
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
	utils.logInteraction(
		baseInteraction,
		interaction.commandType.toString(),
		interaction.commandName,
		start,
	)
}
