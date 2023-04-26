import { AttachmentBuilder, Message } from 'discord.js'

export class HowAreYou {
	static weGoodPath = './assets/gifs/we-good.gif'
	static goodbyeMyLover = './assets/mp4/goodbye-my-lover.mp4'
	static sad = './assets/gifs/sad.gif'

	public static async sendMessage(msg: Message) {
		const val = Math.floor(Math.random() * 100)
		let file: AttachmentBuilder | null = null

		if (val < Number.parseInt(process.env.SAD_RATE ? process.env.SAD_RATE : '10')) {
			if (val % 2 === 1) {
				file = new AttachmentBuilder(this.goodbyeMyLover)
			} else {
				file = new AttachmentBuilder(this.sad)
			}
		} else {
			file = new AttachmentBuilder(this.weGoodPath)
		}
		msg.reply({ files: [file] })
	}
}
