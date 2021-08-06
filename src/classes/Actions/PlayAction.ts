import { CommandInteraction, Message } from 'discord.js'
import { Action } from './Action'

export class PlayAction extends Action {
	constructor() {
		super('Plays a youtube video from the given link')
	}
	async execute(interaction: CommandInteraction) {
		throw new Error('Method not implemented.')
	}
}
