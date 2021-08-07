import { CommandInteraction } from 'discord.js'
import { Action } from './Action'

export class BruhbotAction extends Action {
	constructor() {
		super('Issues a command directly to bruhbot')
	}

	async execute(interaction: CommandInteraction) {
		interaction.reply({content: 'This has not been implemented it'})
	}
}
