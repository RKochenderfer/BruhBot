import { CommandInteraction } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import { Command } from './Command'

export class HugCommand extends Command {
	private static refuseHug = 10
	private static optionName = 'hug'

	constructor() {
		const description = 'Sends a hug to a mentioned user'

		super(HugCommand.optionName, description)
	}

	buildCommand(): SlashCommandBuilder {
		let builder = super.buildCommand()

		builder.addMentionableOption(option =>
			option
				.setName(HugCommand.optionName)
				.setDescription('The mentioned user to hug')
				.setRequired(true),
		)

		return builder
	}

	async execute(interaction: CommandInteraction) {
		const val = Math.floor(Math.random() * 100)
		if (val > HugCommand.refuseHug) {
			const words = [
				'super ',
				'big ',
				'little ',
				'bro ',
				'side ',
				'hand ',
				'',
			]
			let randWord = words[Math.floor(Math.random() * words.length)]
			const mentioned = interaction.options.getMentionable(
				HugCommand.optionName,
			)
			if (!mentioned) {
				interaction.reply({
					content: 'Something went wrong when giving the hug :(.',
				})
			} else {
				interaction.reply({
					content: `${mentioned} gets a ${randWord}hug`,
				}) // reply is always required
			}
		} else {
			// msg.channel.send('No')
			interaction.reply({ content: "No, I don't think I will." })
		}
	}
}
