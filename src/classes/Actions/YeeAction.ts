import { CommandInteraction } from 'discord.js'
import { Action } from './Action'

export class YeeAction extends Action {
	constructor() {
		super('Replies to a user with a random length and capitalized "yee"')
	}

	async execute(interaction: CommandInteraction) {
		interaction.reply({content: 'This has not been implemented it'})
	}
}
