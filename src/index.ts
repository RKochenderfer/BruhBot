import {
	Client,
	Collection,
	Events,
	GatewayIntentBits,
	Partials,
} from 'discord.js'
import {
	Logger as AppLogger,
} from './log'
import BotClient from './models/bot-client'
import { connectToDatabase } from './db'
import { AppState } from './models/state'
import Chatbot from './chatbot'
import { RenderQueue } from './ace'
import { getCommands } from './command-updater'
import * as listeners from './listeners'
import * as utils from './utils'
import { MessageChecker as Checker } from './message-checker/message-checker'

export const State = new AppState()
export const Logger = new AppLogger()
export const ChatBot = new Chatbot()
export const MessageChecker = new Checker()
export const ENV = process.env.ENVIRONMENT ?? 'Dev'

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

botClient.on(Events.MessageCreate, listeners.onMessageCreate)

botClient.on(Events.ChannelPinsUpdate, listeners.onChannelPinsUpdate)

botClient.on(Events.InteractionCreate, listeners.onInteractionCreate)

const init = () => {
	botClient.commands = new Collection()
	// Start objection-engine rendering queue
	RenderQueue.timer = setInterval(async () => {
		await RenderQueue.render()
	}, 5000)
	getCommands(botClient)

	// Log that client is online
	botClient.once('ready', async (c: any) => {
		await Logger.logInfo(
			`Ready! logged in as ${c.user.tag} at ${utils.getTimestamp()}`,
		)
	})

	// start discord bot
	botClient.login(process.env.TOKEN)
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
	Logger.logError(error.message)
}
