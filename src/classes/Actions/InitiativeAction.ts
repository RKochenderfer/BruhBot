import { CommandInteraction } from 'discord.js'
import { Action } from './Action'

export class InitiativeAction extends Action {
	constructor() {
		super('Handles initiative for a roll playing game')
	}
	async execute(interaction: CommandInteraction) {
		interaction.reply({content: 'This has not been implemented it'})
	}
}
