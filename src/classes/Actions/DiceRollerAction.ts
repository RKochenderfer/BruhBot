import { CommandInteraction, Message } from 'discord.js'
import { Action } from './Action'

export class DiceRollerAction extends Action {
	constructor() {
		super('')
	}

	async execute(interaction: CommandInteraction) {
		throw new Error('Method not implemented.')
	}
}
