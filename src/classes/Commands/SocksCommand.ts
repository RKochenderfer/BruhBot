import { CommandInteraction } from 'discord.js'
import { Command } from './Action'

export class SocksCommand extends Command {
	constructor() {
		super('Allows a user to interact with their server socks')
	}

	async execute(interaction: CommandInteraction) {
		interaction.reply({content: 'This has not been implemented it'})
	}
}
