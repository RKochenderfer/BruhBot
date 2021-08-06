import { CommandInteraction, Message } from 'discord.js'
import { Action } from './Action'

export class TeamBuilderAction extends Action {
	constructor() {
		super('Builds teams')
	}

	async execute(interaction: CommandInteraction) {
		throw new Error('Method not implemented.')
	}
}
