import { RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord.js';
import Command from './command';


export default class CommandRegister {
	private static _instance: CommandRegister
	private readonly _commands: Set<Command> = new Set()

	private constructor() { }

	public static get Instance(): CommandRegister {
		return this._instance || (this._instance = new this())
	}

	register = (command: Command) => {
		this._commands.add(command)
	}

	*generateCommandDataJSON(): IterableIterator<RESTPostAPIChatInputApplicationCommandsJSONBody> {
		for (const command of this._commands) {
			yield command.toJSON()
		}
	}

	*generateCommandDetails(): IterableIterator<Command> {
		for (const command of this._commands) {
			yield command
		}
	}
}