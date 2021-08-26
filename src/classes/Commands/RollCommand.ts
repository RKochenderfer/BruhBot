import { CommandInteraction } from 'discord.js'
import { Command } from './Command'

export class RollCommand extends Command {
	constructor() {
		super('roll', 'Rolls `count` dice of type `type` (ex: `!roll 2 d20`)')
	}
	async execute(interaction: CommandInteraction) {
		interaction.reply({content: 'This has not been implemented it'})
	}
}
