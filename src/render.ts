import { AttachmentBuilder, Message, MessageType } from 'discord.js'
import fs from 'fs'
import { logger } from '.'

class MessageInfo {
	constructor(
		public readonly user_name: string,
		public readonly text_content: string,
	) {}
}
// TODO: Setup queue
export let render = async (message: Message) => {
	const num = validate(message)
	if (num === null) return
	const fileName = getFileName()

	try {
		const body = await buildRequestBody(message, num, fileName)
		logger.logInfo(
			`Rendering ${num} messages for ${message.author.username}`,
		)
		const res = await fetch('http://objection-engine:5000/', {
			method: 'POST',
			body: body,
		})

		if (res.ok) {
			await sendRenderedFile(fileName, message)
		} else {
			throw new Error(`Request failed: ${res}`)
		}
	} catch (error) {
		logger.logException(error)
		console.error(error)
	}
}

let validate = (message: Message): number | null => {
	if (message.type !== MessageType.Reply) {
		message.reply('To use this command you must reply to a message')
		return null
	}

	const num = message.content.trim().replace(/\D/g, '') // Removes everything except the the number

	const parsed = Number.parseInt(num)
	if (parsed > 20) {
		message.reply('The number must be less than 20')
		return null
	}

	return parsed
}

let getFileName = () => {
	const date = new Date()
	const year = date.getUTCFullYear()
	const month = date.getUTCMonth() + 1
	const day = date.getUTCDate()
	const hour = date.getUTCHours()
	const minute = date.getUTCMinutes()
	const second = date.getUTCSeconds()
	return `${year}-${month}-${day}T${hour}-${minute}-${second}.mp4`
}

let buildRequestBody = async (
	message: Message,
	num: number,
	fileName: string,
) => {
	// Get the message that the caller replied to
	const repliedTo = await message.channel.messages.fetch(
		message.reference?.messageId!,
	)
	// gather a number of messages that the sender requested
	let messagesBefore = await message.channel.messages.fetch({
		before: repliedTo.id,
		limit: num - 1, // The -1 is so that the message they replied to is included and the total rendered matches the request
	})

	const messages: Array<MessageInfo> = [
		new MessageInfo(repliedTo.author.username, repliedTo.content),
	]
	messagesBefore.forEach((value, _key) => {
		messages.push(new MessageInfo(value.author.username, value.content))
	})

	return JSON.stringify({ file_name: fileName, messages: messages.reverse() })
}

let sendRenderedFile = async (fileName: string, message: Message<boolean>) => {
	const stream = fs.createReadStream(`output/${fileName}`) // Read the file from the shared output directory with the objection-engine
	stream.on('error', err => {
		console.error(err)
	})
	const file = new AttachmentBuilder(stream)
	await message.reply({
		content: 'your video has been rendered',
		files: [file],
	})
	logger.logInfo(
		`Rendered video from user: ${message.author.username} complete.`,
	)
}
