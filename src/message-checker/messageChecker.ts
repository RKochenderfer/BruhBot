import FlaggedPattern from './flagged-pattern';

export default class MessageChecker {
	constructor(private _flaggedPatterns: FlaggedPattern[]) { }

	isTextFlagged = (text: string): boolean => {
		for (const flaggedPattern of this._flaggedPatterns) {
			const regex = flaggedPattern.flags ? 
				new RegExp(flaggedPattern.expression, flaggedPattern.flags) :
				new RegExp(flaggedPattern.expression)
			
			if (regex.test(text)) {
				return true
			}
		}
		return false
	}
}