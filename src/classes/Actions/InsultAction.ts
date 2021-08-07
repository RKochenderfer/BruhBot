import { CommandInteraction, Message } from 'discord.js'
import { Action } from './Action'

export class InsultAction extends Action {
	constructor() {
		super('Insults a mentioned user')
	}
	async execute(interaction: CommandInteraction) {
		interaction.reply({ content: 'This has not been implemented it' })
	}
}
