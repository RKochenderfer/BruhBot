import { CommandInteraction } from 'discord.js'
import { Action } from './Action'

export class RollAction extends Action {
	constructor() {
		super('Rolls `count` dice of type `type` (ex: `!roll 2 d20`)')
	}
	async execute(interaction: CommandInteraction) {
		interaction.reply({content: 'This has not been implemented it'})
	}
}
