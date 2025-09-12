export { EventBuss } from './eventBus'

const discordMessageEvents = [
	'messageReceived',
	'userMessageReceived',
	'botMessageReceived',
	'deployMessageReceived',
	'aceRenderRequestMessageReceived',
] as const
const discordEvents = [...discordMessageEvents, 'interactionCreated', 'channelPinsUpdated'] as const
export type DiscordEvent = typeof discordEvents[number]
export type DiscordMessageEvent = typeof discordMessageEvents[number]

/**
 * Checks if a discord event is a message event
 * @param discordEvent the event to check
 * @returns true if the event is a message event, false otherwise
 */
export const isMessageEvent = (discordEvent: DiscordEvent): boolean => {
	return discordMessageEvents.includes(discordEvent as DiscordMessageEvent) // todo: this seems weird to me
}

/**
 * An event to be published to the event bus
 */
export class Notification<T> {
	readonly event: DiscordEvent
	readonly timeCreated: Date
	readonly data: T

	private constructor(event: DiscordEvent, timeCreated: Date, data: T) {
		this.event = event
		this.timeCreated = timeCreated
		this.data = data
	}

	/**
	 * Create a new Notification from the provided event and data
	 * @param event The event that occurred
	 * @param data The data to be passed along with the event
	 * @returns
	 */
	static from<T>(event: DiscordEvent, data: T): Notification<T> {
		return new Notification(event, new Date(), data)
	}
}
