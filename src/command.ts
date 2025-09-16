import {
	RESTPostAPIChatInputApplicationCommandsJSONBody,
	SlashCommandOptionsOnlyBuilder,
	SlashCommandSubcommandsOnlyBuilder,
} from 'discord.js'
import { ChatInputCommandInteractionWrapper } from './extensions/chatInputCommandInteractionWrapper'
import { Logger } from 'pino'

export default abstract class Command {
	constructor(
		private _name: string,
		private _data: SlashCommandOptionsOnlyBuilder | SlashCommandSubcommandsOnlyBuilder,
	) {}

	abstract execute: (
		logger: Logger,
		interaction: ChatInputCommandInteractionWrapper
	) => Promise<void>

	toJSON(): RESTPostAPIChatInputApplicationCommandsJSONBody {
		return this.data.toJSON()
	}

	get name(): string {
		return this._name
	}

	get data(): SlashCommandOptionsOnlyBuilder | SlashCommandSubcommandsOnlyBuilder {
		return this._data
	}
}
