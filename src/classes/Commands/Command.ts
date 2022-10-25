import { ApplicationCommandOptionData, CommandInteraction, CommandInteractionOptionResolver } from 'discord.js'
import { SlashCommandBuilder } from 'discord.js'

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

	abstract execute(interaction: CommandInteraction | CommandInteractionOptionResolver): Promise<void>
}
