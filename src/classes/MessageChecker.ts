<<<<<<< HEAD
import { Message } from 'discord.js'
import { CumCounter } from './CumCounter'
import { Gonk } from './Gonk'

export class MessageChecker {
	private static flagged_expressions = [
		{
			regex: /c\s*u\s*m/im,
			func: async (msg: Message) => await CumCounter.Counter(msg),
		},
		{
			regex: /g\s*o\s*n\s*k/im,
			func: async (msg: Message) => await Gonk.sendMessage(msg)
		}
	]

	static async CheckMessage(msg: Message) {
		for (let i = 0; i < MessageChecker.flagged_expressions.length; i++) {
			const tar = MessageChecker.flagged_expressions[i]
			const regex = tar.regex

			try {
				if (regex.test(msg.content)) await tar.func(msg)
			} catch {}
		}
	}
}
=======
import { Message } from 'discord.js'
import { CumCounter } from './CumCounter'
import { Gonk } from './Gonk'

export class MessageChecker {
	private static flagged_expressions = [
		{
			regex: /cum/im,
			func: async (msg: Message) => await CumCounter.Counter(msg),
		},
		{
			regex: /gonk/im,
			func: async (msg: Message) => await Gonk.sendMessage(msg)
		}
	]

	static async CheckMessage(msg: Message) {
		for (let i = 0; i < MessageChecker.flagged_expressions.length; i++) {
			const tar = MessageChecker.flagged_expressions[i]
			const regex = tar.regex

			try {
				if (regex.test(msg.content)) await tar.func(msg)
			} catch {}
		}
	}
}
>>>>>>> law-and-order
