import { CacheType, CommandInteractionOptionResolver } from 'discord.js'
import FlaggedMessage from '../models/flagged-message'

export default class FlaggedPattern {
	/**
	 * This regex pattern performs a negative lookahead asserting that the Regex inside the square
	 * brackets are the only characters found in the string.
	 */
	private readonly flagCheckRegex = /^(?!.*[^gmixsuUAJD]).*$/

	public get messageHistory(): FlaggedMessage {
		return this._messageHistory
	}
	public get hasFlags() {
		return this._hasFlags
	}
	public get flags(): string | null {
		return this._flags
	}
	public get response(): string {
		return this._response
	}
	public get expression(): string {
		return this._expression
	}
	public get key(): string {
		return this._key
	}

	constructor(
		private _key: string,
		private _expression: string,
		private _response: string,
		private _flags: string | null,
		private _hasFlags = _flags !== null && _flags.length > 0,
		private _messageHistory: FlaggedMessage = new FlaggedMessage(),
	) {}

	/**
	 * Validates that flags are valid
	 * @param inputFlags - The flags the user has provided for the string
	 * @returns
	 */
	areFlagsValid = (): boolean => {
		if (!this.hasFlags) return true
		return this.flagCheckRegex.test(this.flags!)
	}

	static from = (
		options: Omit<CommandInteractionOptionResolver<CacheType>, 'getMessage' | 'getFocused'>,
	): FlaggedPattern => {
		return new FlaggedPattern(
			options.getString('key', true),
			options.getString('regex_expression', true),
			options.getString('response', true),
			options.getString('regex_flags'),
		)
	}
}
