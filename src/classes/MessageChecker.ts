import { Message } from 'discord.js'
import { CumCounter } from './CumCounter'

export class MessageChecker {
    private static flagged_expressions = [
		{
			regex: /cum/im,
			func: async (msg: Message) => await CumCounter.Counter(msg),
		},
	]

	static async CheckMessage(msg: Message) {
        for (let i = 0; i < MessageChecker.flagged_expressions.length; i++) {
            const tar = MessageChecker.flagged_expressions[i]
            const regex = tar.regex

            if (regex.test(msg.content))
                await tar.func(msg)
        }
    }
}
