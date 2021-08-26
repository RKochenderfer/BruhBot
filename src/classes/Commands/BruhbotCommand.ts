import {
	ApplicationCommandOptionData,
	CommandInteraction,
	GuildMember,
	VoiceChannel,
} from 'discord.js'
import { getVoiceConnection } from '@discordjs/voice'
import { Command } from './Command'
import { BruhbotActionError } from '../../errors/BrubotActionError'
import { SlashCommandBuilder } from '@discordjs/builders'

export class BruhbotCommand extends Command {
	constructor() {
		const name = 'bruhbot'
		const description = 'Issues a command directly to bruhbot'

		super(name, description)
	}

	buildCommand(): SlashCommandBuilder {
		let builder = super.buildCommand()

		builder.addSubcommand(option =>
			option
				.setName('stfu')
				.setDescription(
					'Forcibly disconnects bruhbot from the voice channel.',
				),
		)

		return builder
	}

	stfuAction(interaction: CommandInteraction) {
		const channel = (interaction.member as GuildMember).voice.channel
		if (!channel) {
			throw new BruhbotActionError('No channel ID found')
		}
		const connection = getVoiceConnection((channel as VoiceChannel).id)

		if (!connection) {
			// throw new BruhbotActionError('Connection not found')
			return
		}
		connection?.disconnect()
		connection?.destroy()
	}

	performAction(subCommand: string, interaction: CommandInteraction) {
		switch (subCommand) {
			case 'stfu':
				this.stfuAction(interaction)
				break
			default:
				interaction.reply('Unknown command')
		}
	}

	async execute(interaction: CommandInteraction) {
		const subCommand = interaction.options.getSubcommand()

		try {
			this.performAction(subCommand, interaction)
		} catch (e) {
			console.error(e)
			interaction.reply('There was an error')
		}
	}
}
