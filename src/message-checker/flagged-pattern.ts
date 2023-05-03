import FlaggedMessage from '../models/flagged-message'

const flagCheckRegex = /^(?!.*[^gmixsuUAJD]).*$/
export default class FlaggedPattern {
	/**
	 * This regex pattern performs a negative lookahead asserting that the Regex inside the square
	 * brackets are the only characters found in the string.
	 */

	constructor(
		public key: string,
		public expression: string,
		public response: string,
		public flags: string | null,
		public hasFlags = flags !== null && flags.length > 0,
		public messageHistory: FlaggedMessage = new FlaggedMessage(),
	) {}

	/**
	 * Validates that flags are valid
	 * @param inputFlags - The flags the user has provided for the string
	 * @returns
	 */
	checkFlagsValid = (): boolean => {
		if (!this.hasFlags) return true
		return flagCheckRegex.test(this.flags!)
	}
}
