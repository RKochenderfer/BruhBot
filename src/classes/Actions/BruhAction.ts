import { CommandInteraction, Interaction } from 'discord.js'
import { Action } from './Action'

export class BruhAction extends Action {
	private static threaten = 10
	private static threatenReply =
		"I'M GOING TO KILL YOU LATER TONIGHT. WATCH YOUR BACK HUMAN."

	constructor() {
		super('Replies to sender with bruh')
	}

	async execute(interaction: CommandInteraction) {
		const val = Math.random() * 100
		if (val > BruhAction.threaten) {
			await interaction.reply('bruh')
		} else {
			await interaction.reply(BruhAction.threatenReply)
		}
	}
}
