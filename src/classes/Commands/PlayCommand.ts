import { CommandInteraction } from 'discord.js'
import { Command } from './Command'

export class PlayCommand extends Command {
	constructor() {
		super('play_audio', 'Plays a youtube video from the given link')
	}
	async execute(interaction: CommandInteraction) {
		interaction.reply({ content: 'This has not been implemented it' })
	}
}
