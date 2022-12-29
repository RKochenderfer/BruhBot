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
import { DiscordInfo, Log, Logger, LogLevel, UserInfo } from './log'
import BotClient from './bot-client'
import Command from './command'
import { MessageChecker } from './message-interactions/message-checker'
import { connectToDatabase } from './db'

export const logger = new Logger()

if (!process.env.TOKEN) {
	throw new Error('Token not found in env.')
} else if (!process.env.CLIENT_ID) {
	throw new Error('Client ID not found in env.')
} else if (!process.env.BOT_USER_ID) {
	throw new Error('Bot user ID not found in env.')
} else if (!process.env.MONGODB_CONNSTRING) {
	throw new Error('No mongodb connection string found')
}

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
			logger.logWarn(
				`The command at ${filePath} is missing a required "data" or "execute" property.`,
			)
		}
	}
}

const botClient: BotClient = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.MessageContent,
	],
	partials: [Partials.Message, Partials.Channel, Partials.User],
})

/**
 * Updates the / commands for a server
 * @param message The sent message
 */
const updateCommands = async (message: Message) => {
	logger.logInfo(
		`Updating commands for guild: ${message.guildId} at ${getTimestamp()}`,
	)
	const commands: any[] = []
	const rest = new REST({ version: '10' }).setToken(process.env.TOKEN!)

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

		logger.logInfo(
			`Started refreshing ${commands.length} application (/) commands`,
		)

		if (!message.guildId) return

		const data: any = await rest.put(
			Routes.applicationGuildCommands(
				process.env.CLIENT_ID!,
				message.guildId,
			),
			{ body: commands },
		)

		logger.logInfo(
			`Successfully reloaded ${data.length} application (/) commands`,
		)
	} catch (error) {
		logger.logError(error)
	}
}

const logMessage = (
	message: Message,
	start: number,
	regexString?: string,
	error?: Error,
) => {
	logger.logInteraction({
		logLevel: LogLevel.INFO,
		discordInfo: {
			channelId: message.channelId,
			guildId: message.guildId,
			guildName: message.guild?.name,
			content: message.content,
			regex: regexString == undefined ? null : regexString,
			isError: error != null,
			error: error == undefined ? null : error,
			author: {
				id: message.author.id,
				bot: message.author.bot,
				username: message.author.username,
				discriminator: message.author.discriminator,
			} as UserInfo,
		} as DiscordInfo,
		executionTime: Date.now() - start,
		timestamp: getTimestamp(),
	} as Log)
}

botClient.on(Events.MessageCreate, async message => {
	if (message.author.bot) return
	if (
		message.content === '!deploy' &&
		message.author.id === '208376655129870346'
	) {
		await updateCommands(message)
		return
	}

	const start = Date.now()
	let regexString: string | undefined
	try {
		regexString = await MessageChecker.CheckMessage(message)
	} catch (error) {
		logMessage(message, start, error)
	}

	if (regexString) {
		logMessage(message, start, regexString)
	} else {
		logMessage(message, start)
	}
})

const logInteraction = (
	interaction: BaseInteraction,
	commandType: string,
	commandName: string,
	start: number,
	error?: Error,
) => {
	logger.logInteraction({
		logLevel: LogLevel.INFO,
		discordInfo: {
			channelId: interaction.channelId,
			guildId: interaction.guildId,
			guildName: interaction.guild?.name,
			command: commandName,
			commandType: commandType,
			isError: error != undefined,
			error: error == undefined ? null : error,
			author: {
				id: interaction.user.id,
				bot: interaction.user.bot,
				username: interaction.user.username,
				discriminator: interaction.user.discriminator,
			} as UserInfo,
		} as DiscordInfo,
		executionTime: Date.now() - start,
		timestamp: getTimestamp(),
	} as Log)
}

/**
 * Handles the use of commands
 */
botClient.on(
	Events.InteractionCreate,
	async (baseInteraction: BaseInteraction) => {
		if (!baseInteraction.isChatInputCommand()) return

		const interaction = baseInteraction as ChatInputCommandInteraction
		const interactionClient = interaction.client as BotClient

		const command = interactionClient.commands?.get(
			interaction.commandName,
		) as Command

		if (!command) {
			logger.logWarn(
				`No command matching ${interaction.commandName} was found`,
			)
			return
		}

		const start = Date.now()
		try {
			await command.execute(interaction)
		} catch (error) {
			logInteraction(
				baseInteraction,
				interaction.commandType.toString(),
				interaction.commandName,
				start,
				error,
			)
			await interaction.reply({
				content: 'There was an error executing this command!',
				ephemeral: true,
			})
		}
		logInteraction(
			baseInteraction,
			interaction.commandType.toString(),
			interaction.commandName,
			start,
		)
	},
)

const getTimestamp = () => {
	const pad = (n: any, s = 2) => `${new Array(s).fill(0)}${n}`.slice(-s)
	const d = new Date()

	return `${pad(d.getFullYear(), 4)}-${pad(d.getMonth() + 1)}-${pad(
		d.getDate(),
	)} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.${pad(
		d.getMilliseconds(),
		3,
	)}`
}

try {
	connectToDatabase().then(() => {
		console.log('Connected to database')
	})
	botClient.commands = new Collection()

	getCommands(botClient)

	// Log that client is online
	botClient.once('ready', async (c: any) => {
		logger.logInfo(`Ready! logged in as ${c.user.tag} at ${getTimestamp()}`)
	})

	botClient.login(process.env.TOKEN)
} catch (error) {
	logger.logError(error.message)
}
