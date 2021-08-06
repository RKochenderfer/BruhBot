import { CommandInteraction } from 'discord.js'
import { Action } from './Action'

export class SocksAction extends Action {
	constructor() {
		super('Allows a user to interact with their server socks')
	}

	async execute(interaction: CommandInteraction) {
		throw new Error('Method not implemented.')
	}
}
