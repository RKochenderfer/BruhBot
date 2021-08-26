import { ApplicationCommandOptionData, CommandInteraction, Interaction } from 'discord.js'

export abstract class Command {
	_description: string
	_options?: ApplicationCommandOptionData[]

	constructor(description: string, options?: ApplicationCommandOptionData[]) {
		this._description = description
		this._options = options
	}

	get description(): string {
		return this._description
	}

	get options(): ApplicationCommandOptionData[] | undefined {
		return this._options
	}

	abstract execute(interaction: CommandInteraction): Promise<void>
}
