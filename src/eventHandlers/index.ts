import { Logger } from 'pino'

export { UserMessageReceivedHandler } from './userMessageReceivedHandler'
export { BotMessageReceivedHandler } from './botMessageReceivedHandler'
export { MessageReceivedHandler } from './messageReceivedHandler'

/**
 * Handles an event
 */
export interface Handler {
	/**
	 * Perform an intended action based on the received event
	 * @param data - The data associated with the event
	 */
	handle: (logger: Logger, ...data: any[]) => Promise<void>
}
