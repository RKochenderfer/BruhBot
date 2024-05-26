import {
	ChatInputCommandInteraction,
	RESTPostAPIChatInputApplicationCommandsJSONBody,
	SlashCommandBuilder,
	SlashCommandOptionsOnlyBuilder,
} from 'discord.js'
import { ChatInputCommandInteractionWrapper } from './extensions/chat-input-command-interaction-wrapper'
import { ServerCollection } from './extensions/server-collection'

export default abstract class Command {
	protected constructor(
		private _name: string,
		private _data: SlashCommandOptionsOnlyBuilder,
	) {}

	abstract execute: (
		interaction: ChatInputCommandInteraction | ChatInputCommandInteractionWrapper,
		collection?: ServerCollection,
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
