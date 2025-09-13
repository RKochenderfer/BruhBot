import { RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord.js';
import Command from './command';

/**
 * The registry for all interaction commands available to users on the guild servers
 */
export default class CommandRegistry {
	private static _instance: CommandRegistry
	private readonly _commands: Map<string, () => Command> = new Map()

	public static get Instance(): CommandRegistry {
		return this._instance || (this._instance = new this())
	}

	/**
	 * Registers a command to the command registry
	 * @param name the name of the command to register
	 * @param create
	 */
	register(name: string, create: () => Command) {
		this._commands.set(name, create)
	}

	/**
	 * Generate the JSON data for all registered commands to be used in the registration
	 * request to Discord
	 */
	*generateCommandDataJSON(): IterableIterator<RESTPostAPIChatInputApplicationCommandsJSONBody> {
		for (const [_name, construct] of this._commands) {
			const command = construct()
			yield command.toJSON()
		}
	}

	/**
	 * Generate the
	 */
	*generateCommandDetails(): IterableIterator<Command> {
		for (const [_name, construct] of this._commands) {
			yield construct()
		}
	}
}