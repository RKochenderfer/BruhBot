import { CommandInteraction, Message } from 'discord.js'
import { Action } from './Action'

export class YeAction extends Action {
	constructor() {
		super('Gets a random Kanye West quote')
	}
	async execute(interaction: CommandInteraction) {
		throw new Error('Method not implemented.')
	}
}
