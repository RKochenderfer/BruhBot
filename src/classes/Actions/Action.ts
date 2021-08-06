import { CommandInteraction, Interaction } from 'discord.js'

export abstract class Action {
	_description: string

	constructor(description: string) {
		this._description = description
	}

	get description(): string {
		return this._description
	}

	abstract execute(interaction: CommandInteraction): Promise<void>
}
