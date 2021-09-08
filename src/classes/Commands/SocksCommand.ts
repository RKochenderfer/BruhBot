import { CommandInteraction } from 'discord.js'
import { Command } from './Command'
import { join } from 'path'
import { SlashCommandBuilder } from '@discordjs/builders'
import { FileHandler } from '../FileHandler'

export class SocksCommand extends Command {
	private static socksFilePath = join(__dirname, '../../../socks.json')
	private static optionName = 'options'

	constructor() {
		super('socks', 'Allows a user to interact with their server socks')
	}

	buildCommand(): SlashCommandBuilder {
		let builder = super.buildCommand()

		builder.addStringOption(option =>
			option
				.setName(SocksCommand.optionName)
				.setDescription('The socks option')
				.setRequired(true)
				.addChoice('status', 'status')
				.addChoice('off', 'off')
				.addChoice('on', 'on'),
		)

		return builder
	}

	private takeSocksOff(interaction: CommandInteraction, json: any) {
		const userId = interaction.user.id

		if (!json['no-socks']) {
			json['no-socks'] = []
		}
		if (json['no-socks'].includes(userId)) {
			interaction.followUp({ content: 'Your socks are already off ;)' })
			return
		}

		json['no-socks'].push(userId)
		interaction.followUp({ content: 'Your socks have been removed ;)' })
	}

	private putSocksOn(interaction: CommandInteraction, json: any) {
		const userId = interaction.user.id

		if (!json['no-socks'] || !json['no-socks'].includes(userId)) {
			interaction.followUp({ content: 'Your socks are still on.' })
			return
		}
		const index = json['no-socks'].indexOf(userId)
		json['no-socks'].splice(index, 1)
		interaction.followUp({ content: 'Your socks are back on.' })
	}

	private getServerStatus(interaction: CommandInteraction, json: any) {
		if (!json['no-socks']) {
			interaction.followUp({content: 'Everyone is wearing socks :(.'})
			return
		}
		const users = json['no-socks'].map((ns: string) => interaction.guild?.members.cache.get(ns))

		let str = ''
		if (users.length > 1) {
			for (let i = 0; i < users.length; i++) {
				if (users[i] !== undefined) {
					if (i === users.length - 1) {
						str += `${users[i].nickname} `
					} else {
						str += `${users[i].nickname}, `
					}
				}
			}
			str += 'are not wearing socks ;).'
		} else if (users.length === 1) {
			str += `${users[0].nickname} is not wearing socks. Quite the brave one ;)`
		} else {
			str = 'Everyone is wearing socks :(.'
		}

		interaction.followUp({content: str})
	}

	private getServer(interaction: CommandInteraction, json: any): any {
		if (!interaction.guildId) {
			throw 'You must type this command in your guild for this to work'
		}
		if (!json[interaction.guildId]) {
			json[interaction.guildId] = {}
		}

		return json[interaction.guildId]
	}

	async execute(interaction: CommandInteraction) {
		interaction.deferReply()
		const option = interaction.options.getString(SocksCommand.optionName)

		if (!option) {
			interaction.followUp({
				content: 'Uh oh. I got a bad request for socks!',
			})
			return
		}

		const fh = new FileHandler(SocksCommand.socksFilePath)
		const json = await fh.readFile()
		const server = this.getServer(interaction, json)
		switch (option) {
			case 'on':
				this.putSocksOn(interaction, server)
				fh.writeFile(json)
				break
			case 'off':
				this.takeSocksOff(interaction, server)
				fh.writeFile(json)
				break
			case 'status':
				this.getServerStatus(interaction, server)
				break
			default:
				interaction.followUp({
					content: 'Uh oh. I got a bad request for socks!',
				})
		}
	}
}
