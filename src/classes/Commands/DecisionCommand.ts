import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction, CacheType } from 'discord.js'
import { Command } from './Command'

export class DecisionCommand extends Command {
	private static decisionName = 'decision'

	constructor() {
		super('decision', 'randomly chooses an option from a list of options')
	}

	buildCommand(): SlashCommandBuilder {
		let builder = super.buildCommand()

		builder.addStringOption(option =>
			option
				.setName(DecisionCommand.decisionName)
				.setDescription(
					'The options to choose from. Format: "option1, option2, option3"',
				)
				.setRequired(true),
		)

		return builder
	}

	async execute(interaction: CommandInteraction) {
		const options = interaction.options.getString(
			DecisionCommand.decisionName,
		)

		const split = options!.split(',').map(s => s.trim())

		interaction.reply({
			content: `I choose: ${
				split[Math.floor(Math.random() * split.length)]
			}`,
		})
	}
}
