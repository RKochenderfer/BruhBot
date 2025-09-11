import {
	Client,
	Collection,
	Events,
	GatewayIntentBits,
	Message,
	OmitPartialGroupDMChannel,
	Partials,
} from 'discord.js'
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
import CommandRegister from './commandRegister'
import EditPhrase from './commands/editPhrase'
import { RequestMiddleware } from './middleware/requestMiddleware'
import GuildCache from './caches/guildCache'
import AddPhrase from './commands/addPhrase'
import { Logger } from 'pino'
import Bruh from './commands/bruh'
import AddPins from './commands/addPins'
import Clipshow from './commands/clipshow'
import DiceRoller from './commands/diceRoller'
import Hug from './commands/hug'
import RemovePhrase from './commands/removePhrase'
import { EventBuss as EventBus } from './events'
import {
	BotMessageReceivedHandler,
	MessageReceivedHandler,
	UserMessageReceivedHandler,
} from './eventHandlers'
import { NotificationBuilder } from './extensions/notificationBuilder'
import LogSession from './log/logSession'
import { CommandUpdaterService } from './services/commandUpdaterService'
import { DeployMessageReceivedHandler } from './eventHandlers/deployMessageReceivedHandler'

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

const registerBotClientHandlers = (eventBus: EventBus) => {
	const guildCache = GuildCache.getInstance()
	const requestMiddleware = new RequestMiddleware(guildCache)

	botClient.on(Events.MessageCreate, async message => {
		await requestMiddleware.onMessageCreate(message)
		await publishMessage(eventBus, message)
	})
	botClient.on(Events.ChannelPinsUpdate, listeners.onChannelPinsUpdate)
	botClient.on(Events.InteractionCreate, requestMiddleware.onInteractionCreate)
}

const publishMessage = async (eventBus: EventBus, message: Message<boolean>) => {
	const childLogger = logger.child(LogSession.fromMessage(message))
	try {
		const notification = NotificationBuilder.buildNotification('messageReceived', message)
		if (!notification) {
			childLogger.error('Failed to build notification for messageReceived event')
		} else {
			await eventBus.publish(notification.event, notification, childLogger)
		}
	} catch (error) {
		childLogger.error(error, 'Error publishing messageReceived event')
	}
}

const init = () => {
	const eventBus = EventBus.getinstance()

	GuildCache.initialize(db.collections.servers!)
	setupSubscribers(eventBus)
	registerBotClientHandlers(eventBus)
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

/**
 * Sets up the event bus and subscriptions for events
 */
const setupSubscribers = (eventBus: EventBus) => {
	const commandUpdaterService = new CommandUpdaterService(logger, DiscordCommandRegister)

	const messageReceivedHandler = new MessageReceivedHandler(eventBus)
	const userMessageReceivedHandler = new UserMessageReceivedHandler()
	const botMessageReceivedHandler = new BotMessageReceivedHandler()
	const deployMessageReceivedHandler = new DeployMessageReceivedHandler(commandUpdaterService)

	// setup subscriptions
	eventBus.subscribe('messageReceived', messageReceivedHandler.handle)
	eventBus.subscribe('userMessageReceived', userMessageReceivedHandler.handle)
	eventBus.subscribe('botMessageReceived', botMessageReceivedHandler.handle)
	eventBus.subscribe('deployMessageReceived', deployMessageReceivedHandler.handle)
}

const registerCommands = () => {
	const guildCache = GuildCache.getInstance()
	DiscordCommandRegister.register(
		EditPhrase.name,
		(logger: Logger) => new EditPhrase(guildCache, logger),
	)
	DiscordCommandRegister.register(
		AddPhrase.name,
		(logger: Logger) => new AddPhrase(guildCache, logger),
	)
	DiscordCommandRegister.register(Bruh.name, (logger: Logger) => new Bruh(guildCache, logger))
	DiscordCommandRegister.register(
		AddPins.name,
		(logger: Logger) => new AddPins(guildCache, logger),
	)
	DiscordCommandRegister.register(
		Clipshow.name,
		(logger: Logger) => new Clipshow(guildCache, logger),
	)
	DiscordCommandRegister.register(DiceRoller.name, (logger: Logger) => new DiceRoller(logger))
	DiscordCommandRegister.register(Hug.name, (logger: Logger) => new Hug(logger))
	DiscordCommandRegister.register(
		RemovePhrase.name,
		(logger: Logger) => new RemovePhrase(guildCache, logger),
	)
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
