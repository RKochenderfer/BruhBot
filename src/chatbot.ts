import { Logger } from './index'
import ChatbotRequest from './models/chatbot/chatbot-request'
import { ChatbotResponse } from './models/chatbot/chatbot-response'

export default class Chatbot {
	url = 'http://chatbot:5005/webhooks/rest/webhook'

	public getResponse = async (message: string, guildid: string) => {
		const body = JSON.stringify(new ChatbotRequest(guildid, message))
		try {
			const response = await fetch(this.url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(new ChatbotRequest(guildid, message)),
			})

			if (!response.ok)
				throw Error(
					`Request to Chatbot failed. Request: ${JSON.stringify(
						response,
					)}`,
				)

			return (await response.json()) as ChatbotResponse
		} catch (error) {
			// if there is an error log it and do nothing
			await Logger.logError(error)
		}
	}
}
