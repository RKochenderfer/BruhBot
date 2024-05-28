import { Client, Collection, Events, GatewayIntentBits, Partials } from 'discord.js'
import BotClient from './models/bot-client'
import { connectToDatabase } from './db'
import { AppState } from './models/state'
import { RenderQueue } from './ace'
import { getCommands } from './command-updater'
import { MessageChecker as Checker } from './message-checker/message-checker'
import * as listeners from './listeners'
import * as utils from './utils/utils'
import * as db from './db'
import { logger } from './log/logger'
import CommandRegister from './command-register'
import EditPhrase from './commands/edit-phrase'
import { RequestMiddleware } from './middleware/requestMiddleware'
import GuildCache from './caches/guildCache'
import AddPhrase from './commands/add-phrase'

export const State = new AppState()
export const MessageChecker = new Checker()
export const ENV = process.env.ENVIRONMENT ?? 'Dev'
export const DiscordCommandRegister = CommandRegister.Instance

const botClient: BotClient = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.MessageContent,
	],
	partials: [Partials.Message, Partials.Channel, Partials.User],
})

const registerBotClientHandlers = () => {
	const guildCache = GuildCache.getInstance()
	const requestMiddleware = new RequestMiddleware(guildCache)

	botClient.on(Events.MessageCreate, requestMiddleware.onMessageCreate)
	botClient.on(Events.ChannelPinsUpdate, listeners.onChannelPinsUpdate)
	botClient.on(Events.InteractionCreate, listeners.onInteractionCreate)
}

const init = () => {
	GuildCache.initialize(db.collections.servers!)
	registerBotClientHandlers()
	botClient.commands = new Collection()
	// Start objection-engine rendering queue
	RenderQueue.timer = setInterval(async () => {
		await RenderQueue.render()
	}, 5000)
	registerCommands()
	getCommands(botClient, DiscordCommandRegister)

	// Log that client is online
	botClient.once('ready', async (c: Client<true>) => {
		logger.info(`Ready! Logged in as ${c.user.tag} at ${utils.getTimestamp()}`)
	})

	// start discord bot
	botClient.login(process.env.TOKEN)
}

const registerCommands = () => {
	const guildCache = GuildCache.getInstance()
	DiscordCommandRegister.register(new EditPhrase(guildCache))
	DiscordCommandRegister.register(new AddPhrase(guildCache))
}

try {
	// Make sure required env values are found
	if (!process.env.TOKEN) {
		throw new Error('Token not found in env.')
	} else if (!process.env.CLIENT_ID) {
		throw new Error('Client ID not found in env.')
	} else if (!process.env.BOT_USER_ID) {
		throw new Error('Bot user ID not found in env.')
	} else if (!process.env.MONGODB_CONNSTRING) {
		throw new Error('No mongodb connection string found')
	}
	// start database
	connectToDatabase().then(init)
} catch (error) {
	logger.error(error)
}
