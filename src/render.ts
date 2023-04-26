import { Message, MessageType } from 'discord.js'

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

	const messages: Array<string> = [repliedTo.content]
	messagesBefore.forEach((value, key) => {
		messages.push(value.content)
	})

	// message.reply(messages.reverse().join(', '))
	try {
		const body = JSON.stringify({ messages: messages.reverse() })

		const res = await fetch('http://objection-engine:5000/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: body,
		})

		if (res.ok) {
			console.log(await res.json()) // TODO: Will need to be changed once the renderer is working
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
