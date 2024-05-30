import { RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord.js';
import Command from './command';
import { Logger } from 'pino';
import { logger as baseLogger } from './log/logger'


export default class CommandRegister {
	private static _instance: CommandRegister
	private readonly _commands: Map<string, (logger: Logger) => Command> = new Map()

	private constructor() { }

	public static get Instance(): CommandRegister {
		return this._instance || (this._instance = new this())
	}

	register = (name: string, create: (logger: Logger) => Command) => {
		this._commands.set(name, create)
	}

	*generateCommandDataJSON(): IterableIterator<RESTPostAPIChatInputApplicationCommandsJSONBody> {
		for (const [name, construct] of this._commands) {
			const command = construct(baseLogger)
			yield command.toJSON()
		}
	}

	*generateCommandDetails(): IterableIterator<Command> {
		for (const [name, construct] of this._commands) {
			yield construct(baseLogger)
		}
	}
}