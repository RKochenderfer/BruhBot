import { AttachmentBuilder, Guild, Message, MessageType } from 'discord.js'
import fs from 'fs'
import crypto from 'crypto'
import { ENV } from '.'
import { logger } from './utils/logger'

let rl = Number.parseInt(process.env.RENDER_LIMIT ?? '20')

const RENDER_LIMIT = rl > 100 ? 100 : rl // The max render limit is 100

class MessageInfo {
	constructor(public readonly user_name: string, public readonly text_content: string) {}
}

class RenderRequest {
	constructor(
		public readonly requestId: string,
		public readonly message: Message,
		public readonly num: number,
		public fileName = `${requestId}.mp4`,
	) {}

	async render() {
		this.fileName = `${this.requestId}.mp4`

		try {
			const body = await this.buildRequestBody()
			logger.info(
				this.requestId,
				`Rendering ${this.num} messages for ${this.message.author.username}`,
			)
			const res = await fetch('http://objection-engine:5000/', {
				method: 'POST',
				body: body,
			})

			if (res.ok) {
				await this.sendRenderedFile()
			} else {
				throw new Error(`Request failed: ${res}`)
			}
		} catch (error) {
			logger.error(error)
		}
	}

	private buildRequestBody = async () => {
		// Get the message that the caller replied to
		const repliedTo = await this.message.channel.messages.fetch(
			this.message.reference?.messageId!,
		)
		// gather a number of messages that the sender requested
		let messagesBefore = await this.message.channel.messages.fetch({
			before: repliedTo.id,
			limit: this.num - 1, // The -1 is so that the message they replied to is included and the total rendered matches the request
		})

		const messages: Array<MessageInfo> = [
			new MessageInfo(repliedTo.author.username, repliedTo.content),
		]
		messagesBefore.forEach((value, _key) => {
			messages.push(new MessageInfo(value.author.username, value.content))
		})

		return JSON.stringify({
			file_name: this.fileName,
			messages: messages.reverse(),
		})
	}

	private sendRenderedFile = async () => {
		const stats = fs.statSync(`output/${this.fileName}`)

		if (stats.size / (1024 * 1024) >= 25) {
			await this.message.reply('The size of the file was too large to send over Discord.')
			return
		}

		const stream = fs.createReadStream(`output/${this.fileName}`) // Read the file from the shared output directory with the objection-engine
		stream.on('error', err => {
			console.error(err)
		})
		const file = new AttachmentBuilder(stream)
		await this.message.reply({
			content: 'your video has been rendered',
			files: [file],
		})
		logger.info(
			this.requestId,
			`Finished rendering video from user: ${this.message.author.username}.`,
		)
	}
}

export class RenderQueue {
	private static queue: Array<RenderRequest> = []
	public static timer: NodeJS.Timer
	private static isRendering: boolean = false

	static render() {
		if (RenderQueue.queue.length === 0 || this.isRendering) return

		this.isRendering = true
		if (ENV === 'Dev') console.log('Rendering')
		const request = RenderQueue.queue.pop()!
		RenderQueue.performRender(request)
	}

	private static performRender(request: RenderRequest) {
		request
			.render()
			.then(() => RenderQueue.cleanup(request))
			.catch(err => console.error(err))
	}

	private static cleanup(request: RenderRequest) {
		fs.unlinkSync(`output/${request.fileName}`)
		this.isRendering = false
	}

	static addRequest(request: RenderRequest) {
		RenderQueue.queue.push(request)
	}

	static deleteRequest(request: RenderRequest) {
		RenderQueue.queue = RenderQueue.queue.filter(item => item.requestId !== request.requestId)
	}
}

export let render = async (message: Message) => {
	if (RENDER_LIMIT <= 0) {
		message.reply('This functionality is disabled in the config.')
		return
	}
	
	const num = validate(message)
	if (num === null) return

	const requestId = crypto.randomUUID()
	RenderQueue.addRequest(new RenderRequest(requestId, message, num))
	console.log(`Number ${RenderQueue.length} in queue.`)
}

let validate = (message: Message): number | null => {
	if (message.type !== MessageType.Reply) {
		message.reply('To use this command you must reply to a message')
		return null
	}

	const num = message.content.trim().replace(/\D/g, '') // Removes everything except the the number

	const parsed = Number.parseInt(num)
	if (parsed > RENDER_LIMIT) {
		message.reply(`The max number of messages that can be rendered in a request is ${RENDER_LIMIT} messages`)
		return null
	}

	return parsed
}
