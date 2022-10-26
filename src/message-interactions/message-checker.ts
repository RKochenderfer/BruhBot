import { Message } from 'discord.js'
import { CumCounter } from './cum-counter'
import { Gonk } from './gonk'
import { ThankYou } from './thank-you'
import { HowAreYou } from './how-are-you'

export class MessageChecker {
	private static flagged_expressions = [
		{
			regex: /c\s*u\s*m/im,
			func: async (msg: Message) => await CumCounter.Counter(msg),
		},
		{
			regex: /gonk/im,
			func: async (msg: Message) => await Gonk.sendMessage(msg),
		},
		{
			regex: /thank\s*you\s*bruh\s?bot/im,
			func: async (msg: Message) => await ThankYou.sendMessage(msg),
		},
		{
			regex: /https:\/\/redgifs.com/i,
			func: async (msg: Message) => await msg.delete(),
		},
		{
			regex: /https:\/\/pornhub.com/i,
			func: async (msg: Message) => await msg.delete(),
		},
		{
			regex: /how\sare\syou(\sdoing)?\sbruh\s?bot\??/i,
			func: async (msg: Message) => await HowAreYou.sendMessage(msg),
		},
		{
			regex: /(say\s)?hi\sbruh\s?bot/i,
			func: async (msg: Message) => await msg.channel.send('Hi'),
		},
	]

	static async CheckMessage(msg: Message): Promise<string | undefined> {
		for (let i = 0; i < MessageChecker.flagged_expressions.length; i++) {
			const tar = MessageChecker.flagged_expressions[i]
			const regex = tar.regex

			if (regex.test(msg.content)) {
				await tar.func(msg)
				return regex.toString()
			}
		}
	}
}
