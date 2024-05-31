import { Message } from 'discord.js'
import FlaggedPattern from './flaggedPattern'
import FlaggedMessage from '../models/flagged-message'

export default class FlaggedPatternHelper {
	private _matchedPattern: FlaggedPattern | undefined

	constructor(private _flaggedPatterns: FlaggedPattern[]) {}

	public get matchedFlag(): FlaggedPattern | undefined {
		return this._matchedPattern
	}

	isTextFlagged = (text: string): boolean => {
		for (const flaggedPattern of this._flaggedPatterns) {
			const regex = flaggedPattern.flags
				? new RegExp(flaggedPattern.expression, flaggedPattern.flags)
				: new RegExp(flaggedPattern.expression)

			if (regex.test(text)) {
				this._matchedPattern = flaggedPattern
				return true
			}
		}
		return false
	}

	buildMatchedResponse = (): string => {
		if (!this._matchedPattern) {
			throw new Error('Matched flag is not set')
		}

		const lastFound = this._matchedPattern.messageHistory.dateTimePreviouslyFound
		const date = this._matchedPattern!.messageHistory.lastFound
		const timespan = (date as unknown as number) - (lastFound as unknown as number)

		let response = this._matchedPattern.response
			.replace('$k', this._matchedPattern.key)
			.replace('$c', `${this._matchedPattern.messageHistory.count}`)
			.replace(
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

		return response
	}

	updateHistory = (message: Message<boolean>) => {
		const previousHistory = this._matchedPattern!.messageHistory

		this._matchedPattern!.messageHistory = new FlaggedMessage(
			message.author.id,
			message.author.displayName,
			previousHistory.count + 1,
			new Date(),
			previousHistory.lastFound,
		)
	}
}
