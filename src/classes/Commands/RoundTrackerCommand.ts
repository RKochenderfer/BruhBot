import { CommandInteraction, Message } from 'discord.js'
import { Command } from './Action'

export class RoundTrackerCommand extends Command {
	constructor() {
		super('Tracks the rounds a player is on')
	}

	async execute(interaction: CommandInteraction) {
		interaction.reply({content: 'This has not been implemented it'})
	}
}
