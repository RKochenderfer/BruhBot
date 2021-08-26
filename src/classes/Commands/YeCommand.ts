import { CommandInteraction, Message } from 'discord.js'
import { Command } from './Action'

export class YeCommand extends Command {
	constructor() {
		super('Gets a random Kanye West quote')
	}
	async execute(interaction: CommandInteraction) {
		interaction.reply({content: 'This has not been implemented it'})
	}
}
