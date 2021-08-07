import { CommandInteraction, Message } from 'discord.js'
import { Action } from './Action'

export class RoundTrackerAction extends Action {
	constructor() {
		super('Tracks the rounds a player is on')
	}

	async execute(interaction: CommandInteraction) {
		interaction.reply({content: 'This has not been implemented it'})
	}
}
