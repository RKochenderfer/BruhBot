import * as fs from 'fs'
import { Message } from 'discord.js'
import { CumCounterError } from '../errors/CumCounterError'
import { FileHandler } from './FileHandler'
import { join } from 'path'

export class CumCounter {
	private static cumCounterFilePath = join(__dirname, '../../cum-counter.json')

	private static async pathExists(path: string) {
		try {
			await fs.accessSync(path)
			return true
		} catch {
			return false
		}
	}

	private static async createFile(msg: Message, fh: FileHandler) {
		let json = {}
		if (msg.guild?.id) {
			// @ts-ignore
			json[msg.guild?.id] = new Date()
            await fh.writeFile(json)

			await this.writeMessage(msg, `CUM DETECTED. FIRST INSTANCE LOGGED.`)
		}
	}

	private static checkElapsedTime(timestamp: string, currentTime: number) {
		const timeLastFound = Date.parse(timestamp)

		let timeDiff = currentTime - timeLastFound
		timeDiff /= 1000
		return timeDiff
	}

	private static async writeMessage(msgClient: Message, string: string) {
		try {
			msgClient.channel.send({ content: string })
		} catch (e) {
			throw new CumCounterError(
				`Error sending message to channgel: ${msgClient.channel.id}`,
			)
		}
	}

	private static async adjustTimer(msg: Message, fh: FileHandler) {
		const json = await fh.readFile()
		let elapsedTime = 0
		let currentTime = new Date()
		// @ts-ignore
		if (msg.guild?.id && json[msg.guild?.id]) {
			// @ts-ignore
			elapsedTime = this.checkElapsedTime(json[msg.guild.id], currentTime)
			await this.writeMessage(
				msg,
				`CUM DETECTED. SECONDS SINCE LAST FOUND: ${elapsedTime}`,
			)
		}
		// @ts-ignore
		json[msg.guild.id] = {
			timestamp: currentTime,
		}
		// @ts-ignore
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
