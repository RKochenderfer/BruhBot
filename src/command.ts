import {
	ChatInputCommandInteraction,
	RESTPostAPIChatInputApplicationCommandsJSONBody,
	SlashCommandOptionsOnlyBuilder,
} from 'discord.js'
import { ChatInputCommandInteractionWrapper } from './extensions/chat-input-command-interaction-wrapper'
import GuildCache from './caches/guildCache'

export default abstract class Command {
	protected constructor(
		private _name: string,
		private _data: SlashCommandOptionsOnlyBuilder,
		private _guildCache: GuildCache,
	) {}

	abstract execute: (
		interaction: ChatInputCommandInteraction | ChatInputCommandInteractionWrapper
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
