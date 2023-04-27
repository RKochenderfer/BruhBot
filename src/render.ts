import { calculateObjectSize } from 'bson'
import { AttachmentBuilder, EmbedBuilder, Message, MessageType } from 'discord.js'
import fs from 'fs'

class MessageInfo {
	constructor(public readonly user_name: string, public readonly text_content: string) { }
}

export let render = async (message: Message) => {
	const num = validate(message)
	if (num === null) return

	const repliedTo = await message.channel.messages.fetch(
		message.reference?.messageId!,
	)

	let messagesBefore = await message.channel.messages.fetch({
		before: repliedTo.id,
		limit: num - 1,
	})

	const messages: Array<MessageInfo> = [new MessageInfo(repliedTo.author.username, repliedTo.content)]
	messagesBefore.forEach((value, key) => {
		messages.push(new MessageInfo(value.author.username, value.content))
	})

	const date = new Date()
	const year = date.getUTCFullYear()
	const month = date.getUTCMonth() + 1
	const day = date.getUTCDate()
	const hour = date.getUTCHours()
	const minute = date.getUTCMinutes()
	const second = date.getUTCSeconds()
	const fileName = `${year}-${month}-${day}T${hour}-${minute}-${second}.mp4`

	try {
		const body = JSON.stringify({ 'file_name': fileName, 'messages': messages.reverse() })
		console.log('Requesting')
		const res = await fetch('http://objection-engine:5000/', {
			method: 'POST',
			body: body,
		})

		if (res.ok) {
			const stream = fs.createReadStream(`output/${fileName}`)
			stream.on('error', (err) => {
				console.error(err)
			})
			const file = new AttachmentBuilder(stream)
			await message.reply({
				content: 'your video has been rendered',
				files: [file],
			})
		} else {
			throw new Error(`Request failed: ${res}`)
		}
	} catch (error) {
		console.error(error)
	}
	
}

let validate = (message: Message): number | null => {
	if (message.type !== MessageType.Reply) {
		message.reply('To use this command you must reply to a message')
		return null
	}

	const num = message.content.trim().replace(/\D/g, '')
	
	const parsed = Number.parseInt(num)
	if (parsed > 20) {
		message.reply('The number must be less than 20')
		console.log(`########## more than 20 ##########`)
		return null
	}

	return parsed
}
