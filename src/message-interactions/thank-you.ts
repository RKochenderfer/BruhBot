import { Message } from 'discord.js'

export class ThankYou {
	public static async sendMessage(msg: Message) {
		await msg.reply({ content: 'You\'re welcome' })
	}
}
