import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction } from 'discord.js'
import { Command } from './Command'

const fetch = require('node-fetch')

export class InsultCommand extends Command {
	private static optionName = 'target'
	private static niceComment = 10

	constructor() {
		super('insult', 'Insults a mentioned user')
	}

	buildCommand(): SlashCommandBuilder {
		let builder = super.buildCommand()

		builder.addMentionableOption(option =>
			option
				.setName(InsultCommand.optionName)
				.setDescription('The user to insult')
				.setRequired(true),
		)

		return builder
	}

	private noTarget(interaction: CommandInteraction) {
		interaction.reply({
			content:
				'Something went wrong. There was no user to insult so, FUCK YOU!',
		})
	}

	private selfTarget(interaction: CommandInteraction) {
		interaction.reply({ content: 'Bro, are you ok?' })
	}

	private async insultTarget(
		interaction: CommandInteraction,
		target: string,
	) {
		try {
			const val = Math.random() * 100
			if (val > InsultCommand.niceComment) {
				const res = await fetch('https://insult.mattbas.org/api/insult')
				interaction.reply({
					content: `${target} ${await res.text()}`,
				})
			} else {
				interaction.reply({
					content: `No, ${target} is too nice and I don't want to.`,
				})
			}
		} catch (error) {
			interaction.reply('Something went wrong.')
			console.error(error)
		}
	}

	async execute(interaction: CommandInteraction) {
		const target = interaction.options.getMentionable(
			InsultCommand.optionName,
		)

		if (!target) {
			this.noTarget(interaction)
		} else if (target.valueOf() === interaction.user.valueOf()) {
			this.selfTarget(interaction)
		} else if (
			(
				await interaction.guild?.members.fetch(
					target?.valueOf() as string,
				)
			)?.user.bot
		) {
			interaction.reply({ content: 'No.' })
		} else {
			await this.insultTarget(interaction, target.valueOf() as string)
		}
	}
}
