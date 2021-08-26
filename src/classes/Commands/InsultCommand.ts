import { CommandInteraction, Message } from 'discord.js'
import { Command } from './Action'

export class InsultCommand extends Command {
	constructor() {
		super('Insults a mentioned user')
	}
	async execute(interaction: CommandInteraction) {
		interaction.reply({ content: 'This has not been implemented it' })
	}
}
