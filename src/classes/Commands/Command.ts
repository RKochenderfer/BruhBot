import { ApplicationCommandOptionData, CommandInteraction } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'

export abstract class Command {
	_name: string
	_description: string
	_options?: ApplicationCommandOptionData[]

	constructor(name: string, description: string) {
		this._name = name
		this._description = description
	}

	buildCommand(): SlashCommandBuilder {
		return new SlashCommandBuilder()
			.setName(this._name)
			.setDescription(this._description)
	}

	abstract execute(interaction: CommandInteraction): Promise<void>
}
