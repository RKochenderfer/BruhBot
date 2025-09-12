import { ChatInputCommandInteraction, Message } from 'discord.js'
import { Notification, DiscordEvent, DiscordMessageEvent, isMessageEvent, isInteractionEvent } from '../events'

/**
 * Builder class to create Notifications for different event types
 */
export class NotificationBuilder {
	/**
	 * Build a new notification based on the event type and associated data
	 * @param botEvent
	 * @param data
	 * @returns
	 */
	static buildNotification<T>(botEvent: DiscordEvent, data: T): Notification<T> | undefined {
		// all message events can all be handled very simlarly
		if (isMessageEvent(botEvent)) {
			return this.fromDiscordMessageEvent(botEvent as DiscordMessageEvent, data)
		}
		if (isInteractionEvent(botEvent)) {
			return this.fromDiscordInteractionEvent(botEvent, data)
		}
		switch (botEvent) {
			default:
				throw new Error(`No builder implemented for event type: ${botEvent}`)
		}
	}

	/**
	 * Builds a notification for interaction events
	 * @param botEvent
	 * @param data
	 * @returns
	 */
	static fromDiscordInteractionEvent<T>(botEvent: DiscordEvent, data: T): Notification<T> {
		if (data == undefined) {
			throw new Error('interactionCreated events must have data')
		}
		if (!(data instanceof ChatInputCommandInteraction)) {
			throw new Error('Incmoming data is not of type Object')
		}

		return Notification.from(botEvent, data)
	}

	/**
	 * Builds a notification for message events
	 * @param botEvent
	 * @param data
	 * @returns
	 */
	private static fromDiscordMessageEvent<T>(botEvent: DiscordMessageEvent, data: T): Notification<T> {
		if (data == undefined) {
			throw new Error('messageReceived events must have data')
		}
		if (!(data instanceof Message)) {
			throw new Error('Incmoming data is not of type Message')
		}

		return Notification.from(botEvent, data)
	}
}
