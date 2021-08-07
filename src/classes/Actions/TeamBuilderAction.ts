import { CommandInteraction, Message } from 'discord.js'
import { Action } from './Action'

export class TeamBuilderAction extends Action {
	constructor() {
		super('Builds teams')
	}

	async execute(interaction: CommandInteraction) {
		interaction.reply({content: 'This has not been implemented it'})
	}
}
