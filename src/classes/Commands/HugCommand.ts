import { ApplicationCommandOptionData, CommandInteraction, Message } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import { Command } from './Command'

export class HugCommand extends Command {
	private static refuseHug = 10
	private static optionName = 'mention'

	constructor() {
		const description = 'Sends a hug to a mentioned user'

		super('hug', description)
	}

	buildCommand(): SlashCommandBuilder {
		let builder = super.buildCommand()

		builder.addMentionableOption(option =>
			option.setName('hug')
				.setDescription('The mentioned user to hug')
				.setRequired(true)
			)

		return builder
	}

	async execute(interaction: CommandInteraction) {
		const val = Math.floor(Math.random() * 100)
		if (val > HugCommand.refuseHug) {
			const words = ['super ', 'big ', 'little ', 'bro ', 'side ', 'hand ', '']
			let randWord = words[Math.floor(Math.random() * words.length)]
			const mentioned = interaction.options.getMentionable(HugCommand.optionName)
			
			interaction.reply({content: `${mentioned} gets a ${randWord}hug`}) // reply is always required
		} else {
			// msg.channel.send('No')
			interaction.reply({content: "No, I don't think I will."})
		}
	}
}
