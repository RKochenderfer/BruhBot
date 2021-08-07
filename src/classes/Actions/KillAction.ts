import { CommandInteraction } from 'discord.js'
import { Action } from './Action'

export class KillAction extends Action {
	constructor() {
		super('Kills the user who sent the message or kills a mentioned user')
	}
	async execute(interaction: CommandInteraction) {
		interaction.reply({content: 'This has not been implemented it'})
	}
}
