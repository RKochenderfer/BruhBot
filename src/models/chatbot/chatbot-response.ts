export interface ChatbotMessage {
	receipient_id: string,
	text: string
}

export type ChatbotResponse = Array<ChatbotMessage>