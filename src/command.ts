import {
	ChatInputCommandInteraction,
	RESTPostAPIChatInputApplicationCommandsJSONBody,
	SlashCommandBuilder,
} from 'discord.js'
import { ChatInputCommandInteractionWrapper } from './extensions/chat-input-command-interaction-wrapper'
import { Logger } from 'pino'

export default abstract class Command {
	private _logger?: Logger
	protected abstract readonly data: Omit<
		SlashCommandBuilder,
		'addSubcommand' | 'addSubcommandGroup'
	>

	protected constructor(private _name: string) {}

	abstract execute: (
		interaction: ChatInputCommandInteractionWrapper,
		logger: Logger,
	) => Promise<void>

	toJSON(): RESTPostAPIChatInputApplicationCommandsJSONBody {
		return this.data.toJSON()
	}

	set logger(logger: Logger | undefined) {
		this._logger = logger
	}

	get logger(): Logger | undefined {
		return this._logger
	}

	get name(): string {
		return this._name
	}
}
