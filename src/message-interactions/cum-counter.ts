import * as fs from 'fs'
import { Message } from 'discord.js'
import { FileHandler } from './file-handler'
import { join } from 'path'

export class CumCounter {
	private static cumCounterFilePath = join(
		__dirname,
		'../../data/cum-counter.json',
	)

	private static async pathExists(path: string) {
		try {
			await fs.accessSync(path)
			return true
		} catch {
			return false
		}
	}

	private static async createFile(msg: Message, fh: FileHandler) {
		const json: any = {}
		if (msg.guild?.id) {
			json[msg.guild?.id] = new Date()
			await fh.writeFile(json)

			await this.writeMessage(msg, 'CUM DETECTED. FIRST INSTANCE LOGGED.')
		}
	}

	private static checkElapsedTime(timestamp: string, currentTime: Date) {
		const timeLastFound = Date.parse(timestamp)

		let timeDiff = currentTime as unknown as number - timeLastFound
		timeDiff /= 1000
		return timeDiff
	}

	private static async writeMessage(msgClient: Message, string: string) {
		try {
			msgClient.channel.send({ content: string })
		} catch (e) {
			throw new Error(
				`Error sending message to channel: ${msgClient.channel.id}`,
			)
		}
	}

	private static async adjustTimer(msg: Message, fh: FileHandler) {
		const json: any = await fh.readFile()
		let elapsedTime = 0
		const currentTime = new Date()
		if (msg.guild?.id && json[msg.guild?.id]) {
			elapsedTime = this.checkElapsedTime(json[msg.guild.id], currentTime)
			await this.writeMessage(
				msg,
				`CUM DETECTED. SECONDS SINCE LAST FOUND: ${elapsedTime}`,
			)
		}

		if (!msg.guild) return

		json[msg.guild.id] = {
			timestamp: currentTime,
		}
		json[msg.guild.id] = currentTime
		await fh.writeFile(json)
	}

	static async Counter(msg: Message) {
		const fh = new FileHandler(CumCounter.cumCounterFilePath)
		if (await fh.pathExists()) {
			// read the file
			await this.adjustTimer(msg, fh)
		} else {
			await this.createFile(msg, fh)
		}
	}
}
