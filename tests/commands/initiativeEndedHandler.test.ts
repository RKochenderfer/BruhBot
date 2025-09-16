import { InitiativeCache } from '../../src/caches/initiativeCache'
import { DiceRolledInfo } from '../../src/models/diceRolledInfo'
import { RollInformation } from '../../src/models/rollInformation'
import { ChatInputCommandInteractionWrapper } from '../../src/extensions/chatInputCommandInteractionWrapper'
import { InitiativeEndedHandler } from '../../src/eventHandlers/initiativeEndedHandler'
import { Logger } from 'pino'
import { AsciiTable } from '../../src/ascii-table'
import { InitiativeEnded } from '../../src/events/initiativeEnded'
import { Notification } from '../../src/events'
import { TextChannel } from 'discord.js'

/* eslint-disable @typescript-eslint/no-explicit-any */

const mockLogger: jest.Mocked<Logger> = {
  // mock only the methods you actually use
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  fatal: jest.fn(),
  trace: jest.fn(),
  child: jest.fn().mockReturnThis(),
  // You can add other Logger methods if needed
} as any;

const mockTextChannel: jest.Mocked<TextChannel> = {
	send: jest.fn(),
} as any

const mockChatInputCommandInteractionWrapper: jest.Mocked<ChatInputCommandInteractionWrapper> = {
	reply: jest.fn(),
	textChannel: mockTextChannel,
} as any

describe('InteractionEndedHandler tests', () => {
	test('handle renders all the rolls for the initiative', async () => {
		// arrange
		// arrange mocks
		const callToEndInteraction: ChatInputCommandInteractionWrapper = mockChatInputCommandInteractionWrapper


		// arrange rolls
		const guildId = crypto.randomUUID()
		const channelId = crypto.randomUUID()
		const cache = InitiativeCache.getInstance()
		cache.startInitiative(guildId, channelId)

		// arrange roll
		const differentChannel = {
			diceCount: 1,
			dieType: 20,
			modifier: '+1',
			values: [8],
			total: 9,
		} as RollInformation
		const differentUserId = crypto.randomUUID()
		const differentUserName = 'player A'
		const differentRolledAt = new Date()
		const differentChannelRolledInfo = DiceRolledInfo.from(
			differentChannel,
			differentUserId,
			differentUserName,
			guildId,
			channelId,
			differentRolledAt,
		)

		cache.addDiceRoll(differentChannelRolledInfo)

		const newRolledInformation = {
			diceCount: 1,
			dieType: 20,
			modifier: '-1',
			values: [12],
			total: 11,
		} as RollInformation
		const userId = crypto.randomUUID()
		const userName = 'player B'
		const rolledAt = new Date()
		const newRollInfo = DiceRolledInfo.from(newRolledInformation, userId, userName, guildId, channelId, rolledAt)
		cache.addDiceRoll(newRollInfo)

		// arrange handler
		const asciiTable = new AsciiTable()
		const initiativeEnded = InitiativeEnded.from(guildId, channelId, callToEndInteraction)
		const notification = Notification.from('initiativeEnded', initiativeEnded)
		const initiativeEndedHandler = new InitiativeEndedHandler(InitiativeCache.getInstance(), asciiTable)

		// act
		await initiativeEndedHandler.handle(mockLogger, notification)

		// assert
		expect(mockTextChannel.send).toHaveBeenCalled()
		const expected = `\`| Name      || Modifiers  || Total  |
| player B  || -1         || 11     |
| player A  || +1         || 9      |\``

		expect(mockTextChannel.send).toHaveBeenCalledWith(expected)
	})
})

/* eslint-disable @typescript-eslint/no-explicit-any */
