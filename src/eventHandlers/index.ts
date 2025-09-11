export { UserMessageReceivedHandler } from './messageReceivedHandler'
export { BotMessageReceivedHandler } from './botMessageReceivedHandler'

/**
 * Handles an event
 */
export interface Handler {
	/**
	 * Perform an intended action based on the received event
	 * @param data - The data associated with the event
	 */
	handle: (...data: any[]) => Promise<void>
}
