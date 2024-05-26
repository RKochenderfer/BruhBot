import { Logger } from 'pino';
import { logger } from '../log/logger'
import LogSession from '../log/logSession';
import Handler from '../handlers/handler';
import { HandlerType } from '../models/handlerType';
import MessageHandler from '../handlers/messageHandler';
import { Message } from 'discord.js';

export default class Middleware<T> {
	private _logger: Logger
	private _handlerType: HandlerType
	private _data: any

	private constructor(logSession: LogSession, handlerType: HandlerType, data: T) {
		this._logger = logger.child(logSession)
		this._handlerType = handlerType
	}

	public static new<T>(logSession: LogSession, handlerType: HandlerType, data: T): Middleware<T> { 
		return new Middleware<T>(logSession, handlerType, data) 
	}

	public execute = async (): Promise<void> => {
		this._logger.debug(this._data, `Started to handle request of type ${this._handlerType}`)
		const handler = this.getHandler()
		handler.execute()
		this._logger.debug('Completed executing handler')
	}

	private getHandler = (): Handler => {
		switch(this._handlerType) {
			case HandlerType.Message: return this.prepareMessageHandler()
			case HandlerType.Interaction: return this.prepareInteractionHandler()
			default: throw new Error('HandlerType not found')
		}
	}

	private prepareMessageHandler = (): MessageHandler => {
		const message: Message<boolean> = this._data as Message<boolean>

		return new MessageHandler(this._logger, message)
	}

	private prepareInteractionHandler = (): Handler => {
		throw new Error('Method not implemented.');
	}
}