import {
	RESTPostAPIChatInputApplicationCommandsJSONBody,
	SlashCommandOptionsOnlyBuilder,
} from 'discord.js'
import { ChatInputCommandInteractionWrapper } from './extensions/chatInputCommandInteractionWrapper'

export default abstract class Command {
	constructor(
		private _name: string,
		private _data: SlashCommandOptionsOnlyBuilder,
	) {}

	abstract execute: (
		interaction: ChatInputCommandInteractionWrapper
	) => Promise<void>

	toJSON(): RESTPostAPIChatInputApplicationCommandsJSONBody {
		return this.data.toJSON()
	}

	get name(): string {
		return this._name
	}

	get data(): SlashCommandOptionsOnlyBuilder {
		return this._data
	}
}
