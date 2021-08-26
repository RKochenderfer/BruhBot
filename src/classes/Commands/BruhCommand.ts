import { CommandInteraction, Interaction } from 'discord.js'
import { Command } from './Action'

export class BruhCommand extends Command {
	private static threaten = 10
	private static threatenReply =
		"I'M GOING TO KILL YOU LATER TONIGHT. WATCH YOUR BACK HUMAN."

	constructor() {
		super('Replies to sender with bruh')
	}

	async execute(interaction: CommandInteraction) {
		const val = Math.random() * 100
		if (val > BruhCommand.threaten) {
			await interaction.reply('bruh')
		} else {
			await interaction.reply(BruhCommand.threatenReply)
		}
	}
}
