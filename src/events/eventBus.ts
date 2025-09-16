import { AsyncLocalStorage } from 'async_hooks'
import { DiscordEvent, Notification } from '.'
import { Logger } from 'pino'

const isPublishingStorage = new AsyncLocalStorage<{ isPublishing: boolean }>()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EventHandler = (logger: Logger, notification: Notification<any>) => Promise<void>

/**
 * A simple event bus implementation for subscribing to and publishing events.
 */
export class EventBus {
	private static instance?: EventBus
	private events: Map<string, EventHandler[]> = new Map()

	/**
	 * Retrieve the singleton instance of the EventBus
	 * @returns an instance of EventBus
	 */
	static getinstance(): EventBus {
		if (!EventBus.instance) {
			EventBus.instance = new EventBus()
		}
		return EventBus.instance
	}

	/**
	 * Add a new handler to a provided event type
	 * @param eventType
	 * @param handler
	 */
	subscribe(eventType: DiscordEvent, handler: EventHandler) {
		if (!this.events.has(eventType)) {
			this.events.set(eventType, [])
		}
		this.events.get(eventType)!.push(handler)
	}

	/**
	 * Publish an event and its data to all subscribers of that event
	 * @param eventType
	 * @param data
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async publish(eventType: DiscordEvent, data: Notification<any>, logger: Logger) {
		logger.debug(`Publishing event: ${eventType}`)
		const handlers = this.events.get(eventType) || []
		for (const handler of handlers) {
			try {
				// This is purposefully not await as the publishing should not block
				handler(logger, data)
			} catch (error) {
				throw new Error(`Error in event handler for event type "${eventType}":`, error)
			}
		}
	}

	/**
	 * Checks if the current thread is currently publishing
	 */
	private get isPublishing(): boolean {
		return isPublishingStorage.getStore()?.isPublishing ?? false
	}
}
