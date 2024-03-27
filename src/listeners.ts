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
import { DiscordCommandRegister } from '.'
import Server from './models/server'

/**
 * Handles the MessageCreate event
 * @param message - The sent message
 */
export const onMessageCreate = async (message: Message<boolean>) => {
	if (message.author.bot) return
	if (message.content === '!deploy' && message.author.id === '208376655129870346') {
		await updateCommands(message, DiscordCommandRegister)
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
	const child = logger.child({ correlationId: crypto.randomUUID() })
	child.info('Start processing interaction')
	if (!baseInteraction.isChatInputCommand()) return
	if (!State.servers.has(baseInteraction.guildId!)) {
		State.servers.set(baseInteraction.guildId!, new ServerState())

		await handleServerNotInCache(baseInteraction)
	}

	const interaction = baseInteraction as ChatInputCommandInteraction
	const interactionClient = interaction.client as BotClient

	const command = interactionClient.commands?.get(interaction.commandName) as Command

	if (!command) {
		child.info(`No command matching ${interaction.commandName} was found`)
		return
	}

	try {
		command.logger = child
		await command.execute(ChatInputCommandInteractionWrapper.from(interaction), child)
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
	} finally {
		child.info('End processing interaction', baseInteraction)

		if (interaction.deferred && !interaction.replied) {
			await interaction.followUp({
				content: 'there was an error preventing the response',
				ephemeral: true
			})
		}
	}
}

const handleServerNotInCache = async (baseInteraction: BaseInteraction) => {
	if (await !db.collections.servers?.isServerInDb(baseInteraction.guildId!)) {
		await db.collections.servers?.insertServer({
			name: baseInteraction.guild?.name,
			guildId: baseInteraction.guildId,
			pins: [],
			flaggedPatterns: [],
		} as Server)
	}
}
