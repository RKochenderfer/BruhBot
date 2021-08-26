import { CommandInteraction, Message } from 'discord.js'
import { Command } from './Command'

export class YeCommand extends Command {
	constructor() {
		super('ye', 'Gets a random Kanye West quote')
	}
	async execute(interaction: CommandInteraction) {
		interaction.reply({content: 'This has not been implemented it'})
	}
}
