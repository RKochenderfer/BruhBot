import { Interaction } from 'discord.js'
import { Action } from './Action'

export class BruhbotAction extends Action {
	constructor() {
		super('Issues a command directly to bruhbot')
	}

	async execute(interaction: Interaction) {
		throw new Error('Method not implemented.')
	}
}
