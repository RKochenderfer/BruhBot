import { CacheType, CommandInteractionOptionResolver } from 'discord.js'
import FlaggedMessage from '../models/flagged-message'

/**
 * This regex pattern performs a negative lookahead asserting that the Regex inside the square
 * brackets are the only characters found in the string.
 *
 * This is outside of the class so when mongodb makes an object from this, it is not added to database
 */
const flagCheckRegex = /^(?!.*[^gmixsuUAJD]).*$/

export default class FlaggedPattern {
	// All properties saved in database have to be public or else they queries will return objects with a _ prefix and break the models
	public hasFlags: boolean

	constructor(
		public key: string,
		public expression: string,
		public response: string,
		public flags: string | null,
		public messageHistory: FlaggedMessage = new FlaggedMessage(),
	) {
		this.hasFlags = flags != undefined && flags.length > 0
	}

	/**
	 * Validates that flags are valid
	 * @param inputFlags - The flags the user has provided for the string
	 * @returns
	 */
	areFlagsValid = (): boolean => {
		if (!this.hasFlags) return true
		return flagCheckRegex.test(this.flags!)
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
