import { CommandInteraction, Message } from 'discord.js'
import { Command } from './Action'

export class TeamBuilderCommand extends Command {
	constructor() {
		super('Builds teams')
	}

	async execute(interaction: CommandInteraction) {
		interaction.reply({content: 'This has not been implemented it'})
	}
}
