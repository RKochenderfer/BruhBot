import { CommandInteraction, Message } from 'discord.js'
import { Command } from './Action'

export class DiceRollerCommand extends Command {
	constructor() {
		super('')
	}

	async execute(interaction: CommandInteraction) {
		interaction.reply({content: 'This has not been implemented it'})
	}
}
