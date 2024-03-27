import { Client, Collection, Events, GatewayIntentBits, Partials } from 'discord.js'
import BotClient from './models/bot-client'
import { connectToDatabase } from './db'
import { AppState } from './models/state'
import { RenderQueue } from './ace'
import { getCommands } from './command-updater'
import { MessageChecker as Checker } from './message-checker/message-checker'
import * as listeners from './listeners'
import * as utils from './utils/utils'
import { logger } from './utils/logger'
import CommandRegister from './command-register'
import EditPhrase from './commands/edit-phrase'
import AddPhrase from './commands/add-phrase'
import { ServerCollection } from './extensions/server-collection'

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

botClient.on(Events.MessageCreate, listeners.onMessageCreate)

botClient.on(Events.ChannelPinsUpdate, listeners.onChannelPinsUpdate)

botClient.on(Events.InteractionCreate, listeners.onInteractionCreate)

const init = async () => {
	const database = await connectToDatabase()
	botClient.commands = new Collection()
	// Start objection-engine rendering queue
	RenderQueue.timer = setInterval(async () => {
		await RenderQueue.render()
	}, 5000)
	registerCommands(database.servers!)
	getCommands(botClient, DiscordCommandRegister)

	// Log that client is online
	botClient.once('ready', async (c: Client<true>) => {
		logger.info(`Ready! Logged in as ${c.user.tag} at ${utils.getTimestamp()}`)
	})

	// start discord bot
	botClient.login(process.env.TOKEN)
}

const registerCommands = (serverCollection: ServerCollection) => {
	DiscordCommandRegister.register(new EditPhrase(serverCollection))
	DiscordCommandRegister.register(new AddPhrase(serverCollection))
}

(async () => {
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
		init()
	} catch (error) {
		logger.error(error)
	}
})()
