import { CommandInteraction, Message } from 'discord.js'
import { Command } from './Action'

export class PlayCommand extends Command {
	constructor() {
		super('Plays a youtube video from the given link')
	}
	async execute(interaction: CommandInteraction) {
		interaction.reply({content: 'This has not been implemented it'})
	}
}
