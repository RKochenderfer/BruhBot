import { CommandInteraction, Message } from 'discord.js'
import { Command } from './Command'

export class DiceRollerCommand extends Command {
	constructor() {
		super('dice_roller', 'rolls the specified die and the number to be rolled')
	}

	async execute(interaction: CommandInteraction) {
		interaction.reply({content: 'This has not been implemented it'})
	}
}
