import { BaseInteraction, ChatInputCommandInteraction } from 'discord.js'
import { Middleware } from './middleware'
import GuildCache from '../caches/guildCache'
import LogSession from '../log/logSession'
import InteractionHandler from '../handlers/interactionHandler'

export default class InteractionMiddleware extends Middleware {
	constructor(private _baseInteraction: BaseInteraction, private _guildCache: GuildCache) {
		super()
	}

	async execute(): Promise<void> {
		if (!this._logger) throw new Error('Logger cannot be undefined')
		if (!this._baseInteraction.isChatInputCommand()) return

		this._logger.info(this._baseInteraction, 'Started to handled interaction')
		const interactionHandler = new InteractionHandler(
			this._logger,
			this._baseInteraction as ChatInputCommandInteraction,
		)

		try {
			await interactionHandler.execute()
		} catch (error) {
			this._logger.error(error, 'Error occurred while handling interaction')
		}

		this._logger.info('Completed handling interaction')
	}

	generateLogSessionInfo(): LogSession {
		return LogSession.fromBaseInteraction(this._baseInteraction)
	}
}
