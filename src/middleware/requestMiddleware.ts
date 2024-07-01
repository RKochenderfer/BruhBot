import LogSession from '../log/logSession'
import Guild from '../models/guild'
import GuildService from '../services/guildService'
import Handler from '../handlers/handler'
import { Logger } from 'pino'

export class RequestMiddleware {
	constructor(
		private _logger: Logger,
		private _guildService: GuildService,
		private _handler: Handler,
		private _guild: Guild,
	) {}

	execute = async () => {
		this.prepareRequest()
		this._handler.execute()
	}

	private prepareRequest = async () => {
		this._logger.debug('Started to handle request')
		try {
			await this.addGuildToDatabaseIfNotPresent()
		} catch (error) {
			// handle uncaught errors
			this._logger.error(error, 'Unhandled error while processing request')
		} finally {
			this._logger?.debug('Completed handling request')
		}
	}

	generateLogSessionInfo(): LogSession {
		throw new Error('Method not implemented.')
	}

	private addGuildToDatabaseIfNotPresent = async (): Promise<void> => {
		if (!(await this._guildService.isNewGuild(this._guild.guildId))) {
			await this._guildService.add(this._guild)
		}
	}
}
