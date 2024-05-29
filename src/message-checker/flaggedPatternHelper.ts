import FlaggedPattern from './flagged-pattern'

export default class FlaggedPatternHelper {
	private _matchedFlag: FlaggedPattern | undefined

	constructor(private _flaggedPatterns: FlaggedPattern[]) {}

	public get matchedFlag(): FlaggedPattern | undefined {
		return this._matchedFlag
	}

	isTextFlagged = (text: string): boolean => {
		for (const flaggedPattern of this._flaggedPatterns) {
			const regex = flaggedPattern.flags
				? new RegExp(flaggedPattern.expression, flaggedPattern.flags)
				: new RegExp(flaggedPattern.expression)

			if (regex.test(text)) {
				this._matchedFlag = flaggedPattern
				return true
			}
		}
		return false
	}

	buildMatchedResponse = (): string => {
		if (!this._matchedFlag) {
			throw new Error('Matched flag is not set')
		}
		const lastFound = this._matchedFlag.messageHistory.dateTimePreviouslyFound
		let response = this._matchedFlag.response
		response.replace('$k', this._matchedFlag.key)
		response.replace('$c', `${this._matchedFlag.messageHistory.count}`)

		if (response.includes('$d')) {
			if (lastFound) {
				this.replaceTimeRelatedFlag(lastFound, response)
			} else {
				response.replace('$d', 'FIRST INSTANCE')
			}
		}

		return response
	}

	private replaceTimeRelatedFlag(lastFound: Date, response: string) {
		let temp = response
		const date = this._matchedFlag!.messageHistory.lastFound
		const timespan = (date as unknown as number) - (lastFound as unknown as number)

		temp.replace(
			'$d',
			`${lastFound.getMonth() + 1}/${lastFound.getDate()}/${lastFound.getFullYear()}`,
		)
			.replace('$s', `${timespan / 1000}`)
			.replace('$h', `${timespan / (1000 * 60 * 60)}`)
			.replace(
				'$t',
				`${
					lastFound.getMonth() + 1
				}/${lastFound.getDate()}${lastFound.getFullYear()} ${lastFound.getHours()}:${lastFound.getMinutes()}:${lastFound.getSeconds()}`,
			)
	}
}
