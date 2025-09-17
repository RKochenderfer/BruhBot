import { TextChannel } from 'discord.js'
import { ChatInputCommandInteractionWrapper } from '../../src/extensions/chatInputCommandInteractionWrapper'
import { InitiativeStarted } from '../../src/events/initiativeStarted'
import { InitiativeCache } from '../../src/caches/initiativeCache'
import { InitiativeService } from '../../src/services/initiativeService'
import { DiceRolledInfo } from '../../src/models/diceRolledInfo'
import { InitiativeError } from '../../src/errors/initiativeError'
import { InitiativeEnded } from '../../src/events/initiativeEnded'
import { RollInformation } from '../../src/models/rollInformation'

/* eslint-disable @typescript-eslint/no-explicit-any */
const mockTextChannel: jest.Mocked<TextChannel> = {
	send: jest.fn(),
} as any

const mockChatInputCommandInteractionWrapper: jest.Mocked<ChatInputCommandInteractionWrapper> = {
	reply: jest.fn(),
	textChannel: mockTextChannel,
} as any

describe('initiativeService tests', () => {
	test('startInitiative starts the channels initiative', () => {
		// arrange
		const guildId = crypto.randomUUID()
		const channelId = crypto.randomUUID()
		const interaction = mockChatInputCommandInteractionWrapper
		const initiativeCache = InitiativeCache.getInstance()

		const initiativeStarted = InitiativeStarted.from(guildId, channelId, interaction)
		const initiativeService = new InitiativeService(initiativeCache)

		// act
		initiativeService.startInitiative(initiativeStarted)

		// assert
		const isActive = initiativeService.hasInitiativeStarted({
			guildId: guildId,
			channelId: channelId,
		} as DiceRolledInfo)
		expect(isActive).toBe(true)
	})

	test('startInitiative throws an InitiativeError if the channel already has an active initiative', () => {
		// arrange
		const guildId = crypto.randomUUID()
		const channelId = crypto.randomUUID()
		const interaction = mockChatInputCommandInteractionWrapper
		const initiativeCache = InitiativeCache.getInstance()

		const initiativeStarted = InitiativeStarted.from(guildId, channelId, interaction)
		const initiativeService = new InitiativeService(initiativeCache)
		initiativeService.startInitiative(initiativeStarted)

		// act
		const act = () => initiativeService.startInitiative(initiativeStarted)

		// assert
		expect(act).toThrow(InitiativeError)
		const isActive = initiativeService.hasInitiativeStarted({
			guildId: guildId,
			channelId: channelId,
		} as DiceRolledInfo)
		expect(isActive).toBe(true)
	})

	test('endInitiative ends the initiative gathering process', () => {
		// arrange
		const guildId = crypto.randomUUID()
		const channelId = crypto.randomUUID()
		const interaction = mockChatInputCommandInteractionWrapper
		const initiativeCache = InitiativeCache.getInstance()

		const initiativeStarted = InitiativeStarted.from(guildId, channelId, interaction)
		const initiativeService = new InitiativeService(initiativeCache)
		initiativeService.startInitiative(initiativeStarted)

		const initiativeEnded = InitiativeEnded.from(guildId, channelId, mockChatInputCommandInteractionWrapper)
		// act
		initiativeService.endInitiative(initiativeEnded)

		// assert
		const isStillCollecting = initiativeService.isInitiativeStillBeingCollected({
			guildId: guildId,
			channelId: channelId,
		} as DiceRolledInfo)
		expect(isStillCollecting).toBe(false)
	})

	test('endInitiative should not allow new entries', () => {
		// arrange
		const guildId = crypto.randomUUID()
		const channelId = crypto.randomUUID()
		const cache = InitiativeCache.getInstance()
		const initiativeStarted = InitiativeStarted.from(guildId, channelId, mockChatInputCommandInteractionWrapper)
		const initiativeService = new InitiativeService(cache)
		initiativeService.startInitiative(initiativeStarted)

		const initiativeEnded = InitiativeEnded.from(guildId, channelId, mockChatInputCommandInteractionWrapper)

		// act
		initiativeService.endInitiative(initiativeEnded)

		// assert
		const isInitiativeActive = initiativeService.isInitiativeStillBeingCollected({ guildId: guildId, channelId: channelId } as DiceRolledInfo)
		expect(isInitiativeActive).toBe(false)

		const rollInformation = {
			diceCount: 2,
			dieType: 20,
			modifierString: '+1',
			values: [3, 4],
		} as RollInformation
		const userId = crypto.randomUUID()
		const userName = 'test'
		const rolledAt = new Date()
		const diceRolledInfo = DiceRolledInfo.from(rollInformation, userId, userName, guildId, channelId, rolledAt)

		const add = () => {
			initiativeService.addDiceRoll(diceRolledInfo)
		}

		expect(add).toThrow(InitiativeError)
	})

	test('endInitiative should return only the rolls for the channel that was ended', () => {
		// arrange
		const guildId = crypto.randomUUID()
		const channelId = crypto.randomUUID()
		const cache = InitiativeCache.getInstance()
		const initiativeStarted = InitiativeStarted.from(guildId, channelId, mockChatInputCommandInteractionWrapper)
		const initiativeService = new InitiativeService(cache)
		initiativeService.startInitiative(initiativeStarted)


		const rollInformation = {
			diceCount: 2,
			dieType: 20,
			modifierString: '+1',
			values: [3, 4],
		} as RollInformation
		const userId = crypto.randomUUID()
		const userName = 'test'
		const rolledAt = new Date()
		const diceRolledInfo = DiceRolledInfo.from(rollInformation, userId, userName, guildId, channelId, rolledAt)
		initiativeService.addDiceRoll(diceRolledInfo)

		const rollInformation2 = {
			diceCount: 2,
			dieType: 20,
			modifierString: '+1',
			values: [3, 4],
		} as RollInformation
		const userId2 = crypto.randomUUID()
		const userName2 = 'test2'
		const rolledAt2 = new Date()
		const diceRolledInfo2 = DiceRolledInfo.from(rollInformation2, userId2, userName2, guildId, channelId, rolledAt2)
		initiativeService.addDiceRoll(diceRolledInfo2)

		const otherChannel = crypto.randomUUID()
		const startInitiative = InitiativeStarted.from(guildId, otherChannel, mockChatInputCommandInteractionWrapper)
		initiativeService.startInitiative(startInitiative)
		const rollInformation3 = {
			diceCount: 2,
			dieType: 20,
			modifierString: '+1',
			values: [3, 4],
		} as RollInformation
		const userId3 = crypto.randomUUID()
		const userName3 = 'test3'
		const rolledAt3 = new Date()
		const diceRolledInfo3 = DiceRolledInfo.from(rollInformation3, userId3, userName3, guildId, otherChannel, rolledAt3)
		initiativeService.addDiceRoll(diceRolledInfo3)

		const initiativeEnded = InitiativeEnded.from(guildId, otherChannel, mockChatInputCommandInteractionWrapper)
		// act
		const rolls = initiativeService.endInitiative(initiativeEnded)

		// assert
		expect(rolls.length).toBe(1)
		const roll = rolls[0]

		expect(roll.roll.diceCount).toBe(rollInformation3.diceCount)
		expect(roll.roll.dieType).toBe(rollInformation3.dieType)
		expect(roll.roll.modifierString).toBe(rollInformation3.modifierString)

		expect(roll.roll.values.length).toBe(rollInformation3.values.length)
		for (let i = 0; i < roll.roll.values.length; i++) {
			expect(roll.roll.values[i]).toBe(rollInformation3.values[i])
		}

		expect(roll.userId).toBe(userId3)
		expect(roll.name).toBe(userName3)
		expect(roll.guildId).toBe(guildId)
		expect(roll.channelId).toBe(otherChannel)
		expect(roll.rolledAt).toBe(rolledAt3)

		const firstChannelRolls = initiativeService.getOrderedRollsDesc(guildId, channelId)
		expect(firstChannelRolls.length).toBe(2)
	})

	test('addDiceRoll when initiative is started, adds the roll to the initiative', () => {
		// arrange
		const guildId = crypto.randomUUID()
		const channelId = crypto.randomUUID()
		const interaction = mockChatInputCommandInteractionWrapper
		const initiativeCache = InitiativeCache.getInstance()

		const initiativeStarted = InitiativeStarted.from(guildId, channelId, interaction)
		const initiativeService = new InitiativeService(initiativeCache)
		initiativeService.startInitiative(initiativeStarted)

		const rollInformation = {
			diceCount: 2,
			dieType: 20,
			modifierString: '+1',
			values: [3, 4],
		} as RollInformation
		const userId = crypto.randomUUID()
		const userName = 'test'
		const rolledAt = new Date()
		const diceRolledInfo = DiceRolledInfo.from(rollInformation, userId, userName, guildId, channelId, rolledAt)

		// act
		initiativeService.addDiceRoll(diceRolledInfo)

		// assert
		const rolls = initiativeService.getOrderedRollsDesc(guildId, channelId)

		expect(rolls.length).toBe(1)
		const roll = rolls[0]

		expect(roll.roll.diceCount).toBe(rollInformation.diceCount)
		expect(roll.roll.dieType).toBe(rollInformation.dieType)
		expect(roll.roll.modifierString).toBe(rollInformation.modifierString)

		expect(roll.roll.values.length).toBe(rollInformation.values.length)
		for (let i = 0; i < roll.roll.values.length; i++) {
			expect(roll.roll.values[i]).toBe(rollInformation.values[i])
		}

		expect(roll.userId).toBe(userId)
		expect(roll.name).toBe(userName)
		expect(roll.guildId).toBe(guildId)
		expect(roll.channelId).toBe(channelId)
		expect(roll.rolledAt).toBe(rolledAt)
	})

	test('addRoll should throw InitiativeError if initiative collection has not started', () => {
		// arrange
		const guildId = crypto.randomUUID()
		const channelId = crypto.randomUUID()
		const cache = InitiativeCache.getInstance()
		const initiativeService = new InitiativeService(cache)
		const rollInformation = {
			diceCount: 2,
			dieType: 20,
			modifierString: '+1',
			values: [3, 4],
		} as RollInformation
		const userId = crypto.randomUUID()
		const userName = 'test'
		const rolledAt = new Date()
		const diceRolledInfo = DiceRolledInfo.from(rollInformation, userId, userName, guildId, channelId, rolledAt)

		// act
		const act = () => {
			initiativeService.addDiceRoll(diceRolledInfo)
		}


		// assert
		const isInitiativeActive = initiativeService.isInitiativeStillBeingCollected({ guildId: guildId, channelId: channelId } as DiceRolledInfo)
		expect(isInitiativeActive).toBe(false)
		expect(act).toThrow(InitiativeError)
	})

	test('getOrderedRollsDesc should return only the rolls for the channel that was provided', () => {
		// arrange
		const guildId = crypto.randomUUID()
		const channelId = crypto.randomUUID()
		const cache = InitiativeCache.getInstance()
		const initiativeStarted = InitiativeStarted.from(guildId, channelId, mockChatInputCommandInteractionWrapper)
		const initiativeService = new InitiativeService(cache)
		initiativeService.startInitiative(initiativeStarted)

		const rollInformation = {
			diceCount: 2,
			dieType: 20,
			modifierString: '+1',
			values: [3, 4],
		} as RollInformation
		const userId = crypto.randomUUID()
		const userName = 'test'
		const rolledAt = new Date()
		const diceRolledInfo = DiceRolledInfo.from(rollInformation, userId, userName, guildId, channelId, rolledAt)
		initiativeService.addDiceRoll(diceRolledInfo)

		const rollInformation2 = {
			diceCount: 2,
			dieType: 20,
			modifierString: '+1',
			values: [3, 4],
		} as RollInformation
		const userId2 = crypto.randomUUID()
		const userName2 = 'test2'
		const rolledAt2 = new Date()
		const diceRolledInfo2 = DiceRolledInfo.from(rollInformation2, userId2, userName2, guildId, channelId, rolledAt2)
		initiativeService.addDiceRoll(diceRolledInfo2)

		const otherChannel = crypto.randomUUID()
		const startInitiative = InitiativeStarted.from(guildId, otherChannel, mockChatInputCommandInteractionWrapper)
		initiativeService.startInitiative(startInitiative)
		const rollInformation3 = {
			diceCount: 2,
			dieType: 20,
			modifierString: '+1',
			values: [3, 4],
		} as RollInformation
		const userId3 = crypto.randomUUID()
		const userName3 = 'test3'
		const rolledAt3 = new Date()
		const diceRolledInfo3 = DiceRolledInfo.from(rollInformation3, userId3, userName3, guildId, otherChannel, rolledAt3)
		initiativeService.addDiceRoll(diceRolledInfo3)

		// act
		const rolls = initiativeService.getOrderedRollsDesc(guildId, otherChannel)

		// assert
		expect(rolls.length).toBe(1)
		const roll = rolls[0]

		expect(roll.roll.diceCount).toBe(rollInformation3.diceCount)
		expect(roll.roll.dieType).toBe(rollInformation3.dieType)
		expect(roll.roll.modifierString).toBe(rollInformation3.modifierString)

		expect(roll.roll.values.length).toBe(rollInformation3.values.length)
		for (let i = 0; i < roll.roll.values.length; i++) {
			expect(roll.roll.values[i]).toBe(rollInformation3.values[i])
		}

		expect(roll.userId).toBe(userId3)
		expect(roll.name).toBe(userName3)
		expect(roll.guildId).toBe(guildId)
		expect(roll.channelId).toBe(otherChannel)
		expect(roll.rolledAt).toBe(rolledAt3)
	})

	test('getOrderedRollsDesc should return the rolls in descending total order', () => {
		// arrange
		const guildId = crypto.randomUUID()
		const channelId = crypto.randomUUID()
		const cache = InitiativeCache.getInstance()
		const initiativeStarted = InitiativeStarted.from(guildId, channelId, mockChatInputCommandInteractionWrapper)
		const initiativeService = new InitiativeService(cache)
		initiativeService.startInitiative(initiativeStarted)

		const rollInformation = {
			diceCount: 1,
			dieType: 20,
			modifierString: '+1',
			values: [3],
			total: 4,
		} as RollInformation
		const userId = crypto.randomUUID()
		const userName = 'test'
		const rolledAt = new Date()
		const diceRolledInfo = DiceRolledInfo.from(rollInformation, userId, userName, guildId, channelId, rolledAt)
		initiativeService.addDiceRoll(diceRolledInfo)

		const rollInformation2 = {
			diceCount: 1,
			dieType: 20,
			modifierString: '-1',
			values: [17],
			total: 16,
		} as RollInformation
		const userId2 = crypto.randomUUID()
		const userName2 = 'test2'
		const rolledAt2 = new Date()
		const diceRolledInfo2 = DiceRolledInfo.from(rollInformation2, userId2, userName2, guildId, channelId, rolledAt2)
		initiativeService.addDiceRoll(diceRolledInfo2)

		// act
		const rolls = initiativeService.getOrderedRollsDesc(guildId, channelId)

		// assert
		expect(rolls.length).toBe(2)
		const firstEntry = rolls[0]

		expect(firstEntry.roll.total).toBe(rollInformation2.total)

		const secondEntry = rolls[1]
		expect(secondEntry.roll.total).toBe(rollInformation.total)
	})

	test('getOrderedRollsDesc should return the rolls with the same total uses modifier as tie breaker', () => {
		// arrange
		const guildId = crypto.randomUUID()
		const channelId = crypto.randomUUID()
		const cache = InitiativeCache.getInstance()
		const initiativeStarted = InitiativeStarted.from(guildId, channelId, mockChatInputCommandInteractionWrapper)
		const initiativeService = new InitiativeService(cache)
		initiativeService.startInitiative(initiativeStarted)

		const rollInformation = {
			diceCount: 1,
			dieType: 20,
			modifierString: '+1',
			evaluatedModifierString: 1,
			values: [3],
			total: 4,
		} as RollInformation
		const userId = crypto.randomUUID()
		const userName = 'test'
		const rolledAt = new Date()
		const diceRolledInfo = DiceRolledInfo.from(rollInformation, userId, userName, guildId, channelId, rolledAt)
		initiativeService.addDiceRoll(diceRolledInfo)

		const rollInformation2 = {
			diceCount: 1,
			dieType: 20,
			modifierString: '-1',
			evaluatedModifierString: -1,
			values: [17],
			total: 16,
		} as RollInformation
		const userId2 = crypto.randomUUID()
		const userName2 = 'test2'
		const rolledAt2 = new Date()
		const diceRolledInfo2 = DiceRolledInfo.from(rollInformation2, userId2, userName2, guildId, channelId, rolledAt2)
		initiativeService.addDiceRoll(diceRolledInfo2)

		const rollInformation3 = {
			diceCount: 1,
			dieType: 20,
			modifierString: '+1',
			evaluatedModifierString: 1,
			values: [15],
			total: 16,
		} as RollInformation
		const userId3 = crypto.randomUUID()
		const userName3 = 'test3'
		const rolledAt3 = new Date()
		const diceRolledInfo3 = DiceRolledInfo.from(rollInformation3, userId3, userName3, guildId, channelId, rolledAt3)
		initiativeService.addDiceRoll(diceRolledInfo3)

		// act
		const rolls = initiativeService.getOrderedRollsDesc(guildId, channelId)

		// assert
		expect(rolls.length).toBe(3)
		expect(rolls[0].name).toBe(userName3)
		expect(rolls[1].name).toBe(userName2)
		expect(rolls[2].name).toBe(userName)
	})
})
