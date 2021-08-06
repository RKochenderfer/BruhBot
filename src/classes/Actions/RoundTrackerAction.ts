import { CommandInteraction, Message } from 'discord.js'
import { Action } from './Action'

export class RoundTrackerAction extends Action {
	constructor() {
		super('Tracks the rounds a player is on')
	}

	async execute(interactoin: CommandInteraction) {
		throw new Error('Method not implemented.')
	}
}
