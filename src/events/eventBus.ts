import { AsyncLocalStorage } from 'async_hooks'
import { DiscordEvent, Notification } from '.';

const isPublishingStorage = new AsyncLocalStorage<{ isPublishing: boolean }>()

type EventHandler = (notification: Notification<any>) => Promise<void>

/**
 * A simple event bus implementation for subscribing to and publishing events.
 */
export class EventBuss {
	private static instance?: EventBuss;
	private events: Map<string, EventHandler[]> = new Map()

	private constructor() {}
	
	/**
	 * Retrieve the singleton instance of the EventBus
	 * @returns an instance of EventBus
	 */
	static getinstance(): EventBuss {
		if (!EventBuss.instance) {
			EventBuss.instance = new EventBuss()
		}
		return EventBuss.instance
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
	async publish(eventType: DiscordEvent, data: Notification<any>) {	
		// TODO: Double check that this is correct
		if (this.isPublishing) {
			throw new Error('Cannot publish events while already publishing')
		}
		await isPublishingStorage.run({ isPublishing: true }, async () => {
			const handlers = this.events.get(eventType) || []
			for (const handler of handlers) {
				try {
					await handler(data)
				} catch (error) {
					console.error(`Error in event handler for event type "${eventType}":`, error)
				}
			}
		})
	}

	/**
	 * Checks if the current thread is currently publishing
	 */
	private get isPublishing(): boolean {
		return isPublishingStorage.getStore()?.isPublishing ?? false
	}
}
