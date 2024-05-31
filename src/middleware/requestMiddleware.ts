import { BaseGuildTextChannel, BaseInteraction, Message, TextBasedChannel, ThreadMemberFlagsBitField } from 'discord.js'
import MessageMiddleware from './messageMiddleware'
import LogSession from '../log/logSession'
import { Middleware } from './middleware'
import { logger } from '../log/logger'
import GuildCache from '../caches/guildCache'
import Guild from '../models/guild'
import InteractionMiddleware from './interactionMiddleware'
import PinMiddleware from './pinMiddleware'

export class RequestMiddleware extends Middleware {
	constructor(private _guildCache: GuildCache) {
		super()
	}

	execute = async () => {
		const logSession = super.getNextLogSessionInfo()
		const childLogger = logger.child(logSession)
		super.setLogger(childLogger)
		super.setNextLogger(childLogger)

		this._logger?.debug('Started to handle request')
		try {
			await this.addGuildToDatabaseIfNotPresent(logSession)
			await super.next()
		} catch (error) {
			// handle uncaught errors
			childLogger.error(error, 'Unhandled request processing error')
		} finally {
			super.cleanup()

			this._logger?.debug('Completed handling request')
		}
	}

	generateLogSessionInfo(): LogSession {
		throw new Error('Method not implemented.')
	}

	onMessageCreate = async (message: Message<boolean>) => {
		const messageMiddleware = new MessageMiddleware(message, this._guildCache)
		super.setNext(messageMiddleware)
		await this.execute()
	}

	onInteractionCreate = async (baseInteraction: BaseInteraction) => {
		const interactionMiddleware = new InteractionMiddleware(baseInteraction, this._guildCache)
		super.setNext(interactionMiddleware)
		await this.execute()
	}

	onChannelPinUpdate = async (channel: TextBasedChannel) => {
		const pinMiddleware = new PinMiddleware(channel as BaseGuildTextChannel, this._guildCache)
		super.setNext(pinMiddleware)
		await this.execute()
	}

	private addGuildToDatabaseIfNotPresent = async (logSession: LogSession): Promise<void> => {
		this._logger?.debug('Started to add guild to database if not present')

		if (!(await this._guildCache.has(logSession.guildId))) {
			const guild = this.createGuildFromLogSession(logSession)
			this._logger?.info(guild, 'New guild created')
			await this._guildCache.add(guild)
		}

		this._logger?.debug('Completed handling request')
	}

	private createGuildFromLogSession(logSession: LogSession): Guild {
		return {
			name: logSession.guildName,
			guildId: logSession.guildId,
		} as Guild
	}
}
