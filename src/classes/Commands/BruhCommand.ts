import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction } from 'discord.js'
import { Command } from './Command'

export class BruhCommand extends Command {
	private static threaten = 10
	private static threatenReply =
		"I'M GOING TO KILL YOU LATER TONIGHT. WATCH YOUR BACK HUMAN."

	constructor() {
		super('bruh', 'Replies to sender with bruh')
	}

	buildCommand(): SlashCommandBuilder {
		return new SlashCommandBuilder()
			.setName(this._name)
			.setDescription(this._description)
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
