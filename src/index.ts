import * as fs from 'fs'
import * as path from 'path'
import {
	BaseInteraction,
	ChatInputCommandInteraction,
	Client,
	Collection,
	Events,
	GatewayIntentBits,
	Partials,
} from 'discord.js'
import { Logger } from './log'

import { token } from '../config.json'
import BotClient from './bot-client'
import Command from './commands/command'

const logger = new Logger()

/**
 * Reads the files in commands and builds the commands
 * @param client The bot client instance
 */
const getCommands = (client: BotClient) => {
	const commandsPath = path.join(__dirname, 'commands')
	const commandFiles = fs
		.readdirSync(commandsPath)
		.filter(file => file.endsWith('.js'))

	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file)
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const command = require(filePath)

		if ('data' in command && 'execute' in command) {
			client.commands?.set(command.data.name, command)
		} else {
			logger.log(
				'WARNING',
				`The command at ${filePath} is missing a required "data" or "execute" property.`,
			)
		}
	}
}

const client: BotClient = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildPresences,
	],
	partials: [Partials.Message, Partials.Channel],
})

client.on(Events.MessageCreate, message => {
	console.log('message found', message)
})

/**
 * Handles the use of commands
 */
client.on(
	Events.InteractionCreate,
	async (baseInteraction: BaseInteraction) => {
		if (!baseInteraction.isChatInputCommand()) return

		const interaction = baseInteraction as ChatInputCommandInteraction
		const interactionClient = interaction.client as BotClient

		const command = interactionClient.commands?.get(
			interaction.commandName,
		) as Command

		if (!command) {
			logger.log(
				'ERROR',
				`No command matching ${interaction.commandName} was found`,
			)
			return
		}

		try {
			await command.execute(interaction)
		} catch (error) {
			logger.log('ERROR', error)
			await interaction.reply({
				content: 'There was an error executing this command!',
				ephemeral: true,
			})
		}
	},
)

try {
	client.commands = new Collection()

	getCommands(client)

	// Log that client is online
	client.once('ready', async (c: any) => {
		logger.log('INFO', `Ready! logged in as ${c.user.tag} at ${Date.now()}`)
	})

	client.login(token)
} catch (error) {
	logger.log('ERROR', error.message)
}
