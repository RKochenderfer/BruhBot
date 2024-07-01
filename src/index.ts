import {
	BaseGuildTextChannel,
	BaseInteraction,
	CacheType,
	ChatInputCommandInteraction,
	Client,
	Collection,
	Events,
	GatewayIntentBits,
	Interaction,
	Message,
	Partials,
	TextBasedChannel,
} from 'discord.js'
import BotClient from './models/bot-client'
import { connectToDatabase } from './db'
import { AppState } from './models/state'
import { RenderQueue } from './ace'
import { getCommands } from './command-updater'
import { MessageChecker as Checker } from './message-checker/message-checker'
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
import LogSession from './log/logSession'
import GuildService from './services/guildService'
import MessageHandler from './handlers/messageHandler'
import Guild from './models/guild'
import PinHandler from './handlers/pinHandler'
import InteractionHandler from './handlers/interactionHandler'

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
	botClient.on(Events.MessageCreate, (message: Message<boolean>) => onMessageCreate(message))

	botClient.on(Events.ChannelPinsUpdate, (channelWithPinsUpdated: TextBasedChannel) =>
		onChannelPinsUpdate(channelWithPinsUpdated),
	)
	botClient.on(Events.InteractionCreate, interaction => onInteractionCreate(interaction))
}

const onMessageCreate = (message: Message<boolean>) => {
	const logSession = LogSession.fromMessage(message)
	const loggerForRequest = logger.child(logSession)
	const guildCache = GuildCache.getInstance()
	const guildService = new GuildService(loggerForRequest, db.collections.servers!, guildCache)
	const messageHandler = new MessageHandler(loggerForRequest, message, guildService)

	const requestMiddleware = new RequestMiddleware(
		loggerForRequest,
		guildService,
		messageHandler,
		createGuildFromLogSession(logSession),
	)
	requestMiddleware.execute()
}

const onChannelPinsUpdate = (channelWithPinsUpdated: TextBasedChannel) => {
	const baseGuildTextChannel = channelWithPinsUpdated as BaseGuildTextChannel
	const logSession = LogSession.fromBaseGuildTextChannel(baseGuildTextChannel)
	const loggerForRequest = logger.child(logSession)
	const guildCache = GuildCache.getInstance()
	const guildService = new GuildService(loggerForRequest, db.collections.servers!, guildCache)
	const pinHandler = new PinHandler(loggerForRequest, baseGuildTextChannel, guildCache)

	const requestMiddleware = new RequestMiddleware(
		loggerForRequest,
		guildService,
		pinHandler,
		createGuildFromLogSession(logSession),
	)
	requestMiddleware.execute()
}

const onInteractionCreate = (interaction: Interaction<CacheType>) => {
	const baseInteraction = interaction as BaseInteraction
	const logSession = LogSession.fromBaseInteraction(baseInteraction)
	const loggerForRequest = logger.child(logSession)
	const guildCache = GuildCache.getInstance()
	const guildService = new GuildService(loggerForRequest, db.collections.servers!, guildCache)
	const pinHandler = new InteractionHandler(loggerForRequest, baseInteraction as ChatInputCommandInteraction)

	const requestMiddleware = new RequestMiddleware(
		loggerForRequest,
		guildService,
		pinHandler,
		createGuildFromLogSession(logSession),
	)
	requestMiddleware.execute()
}

const createGuildFromLogSession = (logSession: LogSession): Guild => {
	return {
		name: logSession.guildName,
		guildId: logSession.guildId,
	} as Guild
}

const init = () => {
	GuildCache.initialize()
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
