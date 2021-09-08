import { CommandInteraction } from 'discord.js'
import { Command } from './Command'

export class InitiativeCommand extends Command {
	constructor() {
		super('initiative', 'Handles initiative for a roll playing game')
	}
	async execute(interaction: CommandInteraction) {
		interaction.reply({ content: 'This has not been implemented it' })
	}
}
