import { BaseGuildTextChannel } from 'discord.js';
import { Middleware } from './middleware';
import GuildCache from '../caches/guildCache';
import LogSession from '../log/logSession';
import PinHandler from '../handlers/pinHandler';

export default class PinMiddleware extends Middleware {
	constructor(private _channel: BaseGuildTextChannel, private _guildCache: GuildCache) {
		super()
	}

	async execute(): Promise<void> {
		if (!this._logger) throw new Error('Logger cannot be undefined')

		this._logger.debug('Started to handle pin update')
		const pinHandler = new PinHandler(this._logger, this._channel, this._guildCache)

		try {
			await pinHandler.execute()
		} catch (error) {
			this._logger.error(error, 'Error updating pins')
		}

		this._logger.debug('Completed handling pin update')
	}

	generateLogSessionInfo(): LogSession {
		return LogSession.fromBaseGuildTextChannel(this._channel)
	}
}