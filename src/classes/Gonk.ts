import { Message } from 'discord.js'

export class Gonk {
	static punctuation = ['', '.', '!', '?', '!?']

	public static async sendMessage(msg: Message) {
		await msg.channel.send(
			`gonk${this.punctuation[Math.floor(Math.random() * this.punctuation.length)]}`,
		)
	}
}
