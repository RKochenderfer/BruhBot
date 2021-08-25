import {
	ApplicationCommandOptionData,
	CommandInteraction,
	GuildMember,
	VoiceChannel,
} from 'discord.js'
import { getVoiceConnection } from '@discordjs/voice'
import { Action } from './Action'
import { BruhbotActionError } from '../../errors/BrubotActionError'

export class BruhbotAction extends Action {
	constructor() {
		const description = 'Issues a command directly to bruhbot'
		const options: ApplicationCommandOptionData[] = [
			{
				name: 'method',
				type: 'SUB_COMMAND_GROUP',
				description: 'Use a BruhBot method',
				required: true,
				options: [
					{
						name: 'stfu',
						type: 'SUB_COMMAND',
						description:
							'Forcibly disconnects bruhbot from the voice channel.',
					},
				],
			},
		]
		super(description, options)
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
