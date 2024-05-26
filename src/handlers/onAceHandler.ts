import { Logger } from 'pino';
import Handler from './handler';
import { Message } from 'discord.js';
import { render } from '../ace'

export default class OnAceHandler extends Handler {
	constructor(private _logger: Logger, private _message: Message<boolean>) { 
		super()
	}

	new = (logger: Logger, data: any) => {
		
	}

	async execute() {
		this._logger.info('Started ace render')
		this._message.reply('Starting render')
		render(this._message)
		this._logger.info('Completed ace render')
	}
}