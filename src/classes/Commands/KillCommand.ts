import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction } from 'discord.js'
import { Command } from './Command'
import { join } from 'path'
import * as fs from 'fs'
import { FileHandler } from '../FileHandler'
import { HugCommand } from './HugCommand'

export class KillCommand extends Command {
	private static optionName = 'target'
	private static killMessagesPath = join(
		__dirname,
		'../../../killMessages.json',
	)

	constructor() {
		super(
			'kill',
			'Kills the user who sent the message or kills a mentioned user',
		)
	}

	buildCommand(): SlashCommandBuilder {
		let builder = super.buildCommand()

		builder.addMentionableOption(option =>
			option
				.setName(KillCommand.optionName)
				.setDescription('The mentioned user to kill')
				.setRequired(true),
		)

		return builder
	}

	async execute(interaction: CommandInteraction) {

		const fh = new FileHandler(KillCommand.killMessagesPath)
		try {
			const json: any = await fh.readFile()
			const target = interaction.options.getMentionable(
				KillCommand.optionName,
			)

			if (target && target.valueOf() !== interaction.user.id) {
				const index = Math.floor(
					Math.random() * json['killed-by'].length,
				)
				let death = json['killed-by'][index] as string
				death = death.replace(/\?/g, interaction.user.toString())
				death = death.replace(/\#/g, target.toString())
				interaction.reply(`${death}`)
			} else {
				const index = Math.floor(
					Math.random() * json['kill-self'].length,
				)
				interaction.reply({
					content: `${interaction.user} ${json['kill-self'][index]}`,
				})
			}
		} catch (error) {
			console.error(error)
			interaction.reply('There was an error')
		}
	}
}
