import { NotificationBuilder } from '../../src/extensions/notificationBuilder'
import { DiscordEvent, DiscordMessageEvent, isMessageEvent } from '../../src/events'
import { Message } from 'discord.js'

jest.mock('../../src/events', () => {
	return {
		...jest.requireActual('../../src/events'),
		isMessageEvent: jest.fn(),
		Notification: {
			from: jest.fn((event, data) => ({ event, data })),
		},
	}
})

function createMockMessage(): Message {
	return Object.create(Message.prototype)
}

describe('NotificationBuilder.buildNotification', () => {
	const mockMessage = {} as unknown as Message

	afterEach(() => {
		jest.clearAllMocks()
	})

	it('should build a notification for a user message event with valid Message data', () => {
		(isMessageEvent as jest.Mock).mockReturnValue(true)
		const botEvent: DiscordMessageEvent = 'userMessageReceived'
		const result = NotificationBuilder.buildNotification(botEvent, createMockMessage())
		expect(result).toEqual({ event: botEvent, data: mockMessage })
		expect(isMessageEvent).toHaveBeenCalledWith(botEvent)
	})

	it('should build a notification for a bot message event with valid Message data', () => {
		(isMessageEvent as jest.Mock).mockReturnValue(true)
		const botEvent: DiscordMessageEvent = 'botMessageReceived'
		const result = NotificationBuilder.buildNotification(botEvent, createMockMessage())
		expect(result).toEqual({ event: botEvent, data: mockMessage })
		expect(isMessageEvent).toHaveBeenCalledWith(botEvent)
	})

	it('should throw if message event data is undefined', () => {
		(isMessageEvent as jest.Mock).mockReturnValue(true)
		const botEvent: DiscordMessageEvent = 'messageReceived' as DiscordMessageEvent
		expect(() => NotificationBuilder.buildNotification(botEvent, undefined)).toThrow(
			'messageReceived events must have data',
		)
	})

	it('should throw if message event data is not a Message instance', () => {
		(isMessageEvent as jest.Mock).mockReturnValue(true)
		const botEvent: DiscordMessageEvent = 'messageReceived' as DiscordMessageEvent
		expect(() => NotificationBuilder.buildNotification(botEvent, {})).toThrow(
			'Incmoming data is not of type Message',
		)
	})

	it('should throw for unsupported event types', () => {
		(isMessageEvent as jest.Mock).mockReturnValue(false)
		const botEvent: DiscordEvent = 'unsupportedEvent' as DiscordMessageEvent
		expect(() => NotificationBuilder.buildNotification(botEvent, {})).toThrow(
			'No builder implemented for event type: unsupportedEvent',
		)
	})
})