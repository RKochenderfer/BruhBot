import { CommandInteraction } from 'discord.js'
import { Command } from './Command'

export class TeamBuilderCommand extends Command {
	constructor() {
		super('team_builder', 'Builds teams')
	}

	async execute(interaction: CommandInteraction) {
		interaction.reply({ content: 'This has not been implemented it' })
	}
}
