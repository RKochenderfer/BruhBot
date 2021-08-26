import { CommandInteraction } from 'discord.js'
import { Command } from './Command'

export class KillCommand extends Command {
	constructor() {
		super('kill', 'Kills the user who sent the message or kills a mentioned user')
	}
	async execute(interaction: CommandInteraction) {
		interaction.reply({content: 'This has not been implemented it'})
	}
}
