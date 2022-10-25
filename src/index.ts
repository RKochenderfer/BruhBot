import * as fs from 'fs'
import * as path from 'path'
import {
	BaseInteraction,
	ChatInputCommandInteraction,
	Client,
	Collection,
	Events,
	GatewayIntentBits,
	Message,
	Partials,
	REST,
	Routes,
} from 'discord.js'
import { Logger } from './log'

import { token, clientId } from '../config.json'
import BotClient from './bot-client'
import Command from './command'
import { MessageChecker } from './message-interactions/message-checker'

export const logger = new Logger()


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
		GatewayIntentBits.MessageContent,
	],
	partials: [Partials.Message, Partials.Channel, Partials.User],
})

const updateCommands = async (message: Message) => {
	logger.log('INFO', `Updating commands for guild: ${message.guildId} at ${getTimestamp()}`)
	const commands: any[] = []
	const rest = new REST({ version: '10' }).setToken(token)

	try {
		const commandsPath = path.join(__dirname, 'commands')
		const commandFiles = fs
			.readdirSync(commandsPath)
			.filter(file => file.endsWith('.js'))

		for (const file of commandFiles) {
			// eslint-disable-next-line @typescript-eslint/no-var-requires
			const command = require(`./commands/${file}`)
			commands.push(command.data.toJSON())
		}

		logger.log(
			'INFO',
			`Started refreshing ${commands.length} application (/) commands`,
		)

		if (!message.guildId) return

		const data: any = await rest.put(
			Routes.applicationGuildCommands(clientId, message.guildId),
			{ body: commands },
		)

		logger.log(
			'INFO',
			`Successfully reloaded ${data.length} application (/) commands`,
		)
	} catch (error) {
		logger.log('ERROR', error)
	}
}

client.on(Events.MessageCreate, async message => {
	if (message.author.bot) return

	if (message.content === '!deploy' && message.author.id === '208376655129870346') {
		await updateCommands(message)
		return
	}
	try {
		await MessageChecker.CheckMessage(message)
	} catch (error) {
		logger.log('ERROR', error)
	}
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

const getTimestamp = () => {
	const pad = (n: any, s = 2) => (`${new Array(s).fill(0)}${n}`).slice(-s)
	const d = new Date()

	return `${pad(d.getFullYear(), 4)}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.${pad(d.getMilliseconds(), 3)}`
}

try {
	client.commands = new Collection()

	getCommands(client)

	// Log that client is online
	client.once('ready', async (c: any) => {
		logger.log('INFO', `Ready! logged in as ${c.user.tag} at ${getTimestamp()}`)
	})

	client.login(token)
} catch (error) {
	logger.log('ERROR', error.message)
}
