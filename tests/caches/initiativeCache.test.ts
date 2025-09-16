import { InitiativeCache } from '../../src/caches/initiativeCache'
import { DiceRolledInfo } from '../../src/models/diceRolledInfo'
import { RollInformation } from '../../src/models/rollInformation'

describe('initiativeCache tests', () => {
	test('startInitiative should create a cache entry', () => {
		// arrange
		const guildId = crypto.randomUUID()
		const channelId = crypto.randomUUID()
		const cache = InitiativeCache.getInstance()

		// act
		cache.startInitiative(guildId, channelId)

		// assert
		const hasInitiativeStarted = cache.hasInitiativeTrackingStartedFor(guildId, channelId)
		expect(hasInitiativeStarted).toBe(true)
	})

	test('endInitiative should not allow new entries', () => {
		// arrange
		const guildId = crypto.randomUUID()
		const channelId = crypto.randomUUID()
		const cache = InitiativeCache.getInstance()
		cache.startInitiative(guildId, channelId)

		// act
		cache.endInitiative(guildId, channelId)

		// assert
		const isInitiativeActive = cache.isInitiativeActive(guildId, channelId)
		expect(isInitiativeActive).toBe(false)

		const rollInformation = {
			diceCount: 2,
			dieType: 20,
			modifier: '+1',
			values: [3, 4],
		} as RollInformation
		const userId = crypto.randomUUID()
		const userName = 'test'
		const rolledAt = new Date()
		const diceRolledInfo = DiceRolledInfo.from(rollInformation, userId, userName, guildId, channelId, rolledAt)

		const add = () => {
			cache.addDiceRoll(diceRolledInfo)
		}

		expect(add).toThrow(Error)
	})

	test('endInitiative when it has not been started should throw an error', () => {
		// arrange
		const guildId = crypto.randomUUID()
		const channelId = crypto.randomUUID()
		const cache = InitiativeCache.getInstance()

		// act
		const act = () => {
			cache.endInitiative(guildId, channelId)
		}

		// assert
		expect(act).toThrow(Error)
	})

	test('hasInitiativeStartedFor should return false if initiative not been started', () => {
		// arrange
		const guildId = crypto.randomUUID()
		const channelId = crypto.randomUUID()
		const cache = InitiativeCache.getInstance()

		// act
		const hasStarted = cache.hasInitiativeTrackingStartedFor(guildId, channelId)

		// assert
		expect(hasStarted).toBe(false)
	})

	test('addDiceRoll when initiative is started should add the roll to the cache', () => {
		// arrange
		// arrange initiative
		const guildId = crypto.randomUUID()
		const channelId = crypto.randomUUID()
		const cache = InitiativeCache.getInstance()
		cache.startInitiative(guildId, channelId)

		// arrange roll
		const rollInformation = {
			diceCount: 2,
			dieType: 20,
			modifier: '+1',
			values: [3, 4],
		} as RollInformation
		const userId = crypto.randomUUID()
		const userName = 'test'
		const rolledAt = new Date()
		const diceRolledInfo = DiceRolledInfo.from(rollInformation, userId, userName, guildId, channelId, rolledAt)

		// act
		cache.addDiceRoll(diceRolledInfo)

		// assert
		const entries = cache.getRolls(guildId, channelId)

		expect(entries.length).toBe(1)
		const entry = entries[0]

		expect(entry.roll.diceCount).toBe(rollInformation.diceCount)
		expect(entry.roll.dieType).toBe(rollInformation.dieType)
		expect(entry.roll.modifier).toBe(rollInformation.modifier)

		expect(entry.roll.values.length).toBe(rollInformation.values.length)
		for (let i = 0; i < entry.roll.values.length; i++) {
			expect(entry.roll.values[i]).toBe(rollInformation.values[i])
		}

		expect(entry.userId).toBe(userId)
		expect(entry.userName).toBe(userName)
		expect(entry.guildId).toBe(guildId)
		expect(entry.channelId).toBe(channelId)
		expect(entry.rolledAt).toBe(rolledAt)
	})

	test('addDiceRoll should throw error if initiative has ended', () => {
		// arrange
		// arrange initiative
		const guildId = crypto.randomUUID()
		const channelId = crypto.randomUUID()
		const cache = InitiativeCache.getInstance()
		cache.startInitiative(guildId, channelId)

		// arrange first roll
		const rollInformation = {
			diceCount: 2,
			dieType: 20,
			modifier: '+1',
			values: [3, 4],
		} as RollInformation
		const userId = crypto.randomUUID()
		const userName = 'test'
		const rolledAt = new Date()
		const diceRolledInfo = DiceRolledInfo.from(rollInformation, userId, userName, guildId, channelId, rolledAt)
		cache.addDiceRoll(diceRolledInfo)

		// arrange roll that will fail
		const newRollInformation = {
			diceCount: 2,
			dieType: 20,
			modifier: '+1',
			values: [3, 4],
		} as RollInformation
		const newUserId = crypto.randomUUID()
		const newUserName = 'test'
		const newRolledAt = new Date()
		const newDiceRolledInfo = DiceRolledInfo.from(newRollInformation, newUserId, newUserName, guildId, channelId, newRolledAt)

		cache.endInitiative(guildId, channelId)

		// act
		const act = () => {
			cache.addDiceRoll(newDiceRolledInfo)
		}

		// assert
		expect(act).toThrow(Error)
	})

	test('addDiceRoll should throw an error if a channel that is not tracking initiative tries to add a roll', () => {
		// arrange

		// arrange roll
		const rollInformation = {
			diceCount: 2,
			dieType: 20,
			modifier: '+1',
			values: [3, 4],
		} as RollInformation
		const guildId = crypto.randomUUID()
		const channelId = crypto.randomUUID()
		const userId = crypto.randomUUID()
		const userName = 'test'
		const rolledAt = new Date()
		const diceRolledInfo = DiceRolledInfo.from(rollInformation, userId, userName, guildId, channelId, rolledAt)

		const cache = InitiativeCache.getInstance()
		// act
		const act = () => {
			cache.addDiceRoll(diceRolledInfo)
		}

		// assert
		expect(act).toThrow(Error)
	})

	test('addDiceRoll should replace the dice roll entry if the same user rolls twice', () => {
		// arrange
		// arrange initiative
		const guildId = crypto.randomUUID()
		const channelId = crypto.randomUUID()
		const cache = InitiativeCache.getInstance()
		cache.startInitiative(guildId, channelId)

		// arrange roll
		const rollInformation = {
			diceCount: 2,
			dieType: 20,
			modifier: '+1',
			values: [3, 4],
		} as RollInformation
		const userId = crypto.randomUUID()
		const userName = 'test'
		const rolledAt = new Date()
		const diceRolledInfo = DiceRolledInfo.from(rollInformation, userId, userName, guildId, channelId, rolledAt)

		cache.addDiceRoll(diceRolledInfo)

		const newRolledInformation = {
			diceCount: 1,
			dieType: 6,
			modifier: '-1',
			values: [2, 1],
		} as RollInformation
		const newRolledAt = new Date()
		const newRollInfo = DiceRolledInfo.from(newRolledInformation, userId, userName, guildId, channelId, newRolledAt)

		// act
		cache.addDiceRoll(newRollInfo)

		// assert
		const entries = cache.getRolls(guildId, channelId)

		expect(entries.length).toBe(1)
		const entry = entries[0]

		expect(entry.roll.diceCount).toBe(newRolledInformation.diceCount)
		expect(entry.roll.dieType).toBe(newRolledInformation.dieType)
		expect(entry.roll.modifier).toBe(newRolledInformation.modifier)

		expect(entry.roll.values.length).toBe(newRolledInformation.values.length)
		for (let i = 0; i < entry.roll.values.length; i++) {
			expect(entry.roll.values[i]).toBe(newRolledInformation.values[i])
		}

		expect(entry.userId).toBe(userId)
		expect(entry.userName).toBe(userName)
		expect(entry.guildId).toBe(guildId)
		expect(entry.channelId).toBe(channelId)
		expect(entry.rolledAt).toBe(newRolledAt)
	})

	test('endInitiative should return the roll results for only that channel', () => {
		// arrange
		// arrange
		// arrange initiative
		const differentChannelGuildId = crypto.randomUUID()
		const differentChannelId = crypto.randomUUID()
		const cache = InitiativeCache.getInstance()
		cache.startInitiative(differentChannelGuildId, differentChannelId)

		// arrange roll
		const differentChannel = {
			diceCount: 2,
			dieType: 20,
			modifier: '+1',
			values: [3, 4],
		} as RollInformation
		const differentUserId = crypto.randomUUID()
		const differentUserName = 'different'
		const differentRolledAt = new Date()
		const differentChannelRolledInfo = DiceRolledInfo.from(
			differentChannel,
			differentUserId,
			differentUserName,
			differentChannelGuildId,
			differentChannelId,
			differentRolledAt,
		)

		cache.addDiceRoll(differentChannelRolledInfo)

		const newRolledInformation = {
			diceCount: 1,
			dieType: 6,
			modifier: '-1',
			values: [2, 1],
		} as RollInformation
		const guildId = crypto.randomUUID()
		const channelId = crypto.randomUUID()
		const userId = crypto.randomUUID()
		const userName = 'test'
		const rolledAt = new Date()
		const newRollInfo = DiceRolledInfo.from(newRolledInformation, userId, userName, guildId, channelId, rolledAt)
		cache.startInitiative(guildId, channelId)
		cache.addDiceRoll(newRollInfo)

		// act
		const rolls = cache.endInitiative(guildId, channelId)

		// assert
		// assert returned rolls is only from the passed in guild
		expect(rolls.length).toBe(1)
		const entry = rolls[0]

		expect(entry.roll.diceCount).toBe(newRolledInformation.diceCount)
		expect(entry.roll.dieType).toBe(newRolledInformation.dieType)
		expect(entry.roll.modifier).toBe(newRolledInformation.modifier)

		expect(entry.roll.values.length).toBe(newRolledInformation.values.length)
		for (let i = 0; i < entry.roll.values.length; i++) {
			expect(entry.roll.values[i]).toBe(newRolledInformation.values[i])
		}

		expect(entry.userId).toBe(userId)
		expect(entry.userName).toBe(userName)
		expect(entry.guildId).toBe(guildId)
		expect(entry.channelId).toBe(channelId)
		expect(entry.rolledAt).toBe(rolledAt)

		// assert other initiative is still active and unchanged
		const otherChannelHasInitiativeTrackingStarted = cache.hasInitiativeTrackingStartedFor(
			differentChannelGuildId,
			differentChannelId,
		)
		expect(otherChannelHasInitiativeTrackingStarted).toBe(true)

		const entries = cache.getRolls(differentChannelGuildId, differentChannelId)

		expect(entries.length).toBe(1)
		const otherEntry = entries[0]

		expect(otherEntry.roll.diceCount).toBe(differentChannel.diceCount)
		expect(otherEntry.roll.dieType).toBe(differentChannel.dieType)
		expect(otherEntry.roll.modifier).toBe(differentChannel.modifier)

		expect(otherEntry.roll.values.length).toBe(differentChannel.values.length)
		for (let i = 0; i < otherEntry.roll.values.length; i++) {
			expect(otherEntry.roll.values[i]).toBe(differentChannel.values[i])
		}

		expect(otherEntry.userId).toBe(differentUserId)
		expect(otherEntry.userName).toBe(differentUserName)
		expect(otherEntry.guildId).toBe(differentChannelGuildId)
		expect(otherEntry.channelId).toBe(differentChannelId)
		expect(otherEntry.rolledAt).toBe(differentRolledAt)
	})

	test('getRolls should return the roll results for only that channel even if initiative has ended', () => {
		// arrange
		// arrange
		// arrange initiative
		const differentChannelGuildId = crypto.randomUUID()
		const differentChannelId = crypto.randomUUID()
		const cache = InitiativeCache.getInstance()
		cache.startInitiative(differentChannelGuildId, differentChannelId)

		// arrange roll
		const differentChannel = {
			diceCount: 2,
			dieType: 20,
			modifier: '+1',
			values: [3, 4],
		} as RollInformation
		const differentUserId = crypto.randomUUID()
		const differentUserName = 'different'
		const differentRolledAt = new Date()
		const differentChannelRolledInfo = DiceRolledInfo.from(
			differentChannel,
			differentUserId,
			differentUserName,
			differentChannelGuildId,
			differentChannelId,
			differentRolledAt,
		)

		cache.addDiceRoll(differentChannelRolledInfo)

		const newRolledInformation = {
			diceCount: 1,
			dieType: 6,
			modifier: '-1',
			values: [2, 1],
		} as RollInformation
		const guildId = crypto.randomUUID()
		const channelId = crypto.randomUUID()
		const userId = crypto.randomUUID()
		const userName = 'test'
		const rolledAt = new Date()
		const newRollInfo = DiceRolledInfo.from(newRolledInformation, userId, userName, guildId, channelId, rolledAt)
		cache.startInitiative(guildId, channelId)
		cache.addDiceRoll(newRollInfo)
		cache.endInitiative(guildId, channelId)

		// act
		const rolls = cache.getRolls(guildId, channelId)

		// assert
		// assert returned rolls is only from the passed in guild
		expect(rolls.length).toBe(1)
		const entry = rolls[0]

		expect(entry.roll.diceCount).toBe(newRolledInformation.diceCount)
		expect(entry.roll.dieType).toBe(newRolledInformation.dieType)
		expect(entry.roll.modifier).toBe(newRolledInformation.modifier)

		expect(entry.roll.values.length).toBe(newRolledInformation.values.length)
		for (let i = 0; i < entry.roll.values.length; i++) {
			expect(entry.roll.values[i]).toBe(newRolledInformation.values[i])
		}

		expect(entry.userId).toBe(userId)
		expect(entry.userName).toBe(userName)
		expect(entry.guildId).toBe(guildId)
		expect(entry.channelId).toBe(channelId)
		expect(entry.rolledAt).toBe(rolledAt)

		// assert other initiative is still active and unchanged
		const otherChannelHasInitiativeTrackingStarted = cache.hasInitiativeTrackingStartedFor(
			differentChannelGuildId,
			differentChannelId,
		)
		expect(otherChannelHasInitiativeTrackingStarted).toBe(true)

		const entries = cache.getRolls(differentChannelGuildId, differentChannelId)

		expect(entries.length).toBe(1)
		const otherEntry = entries[0]

		expect(otherEntry.roll.diceCount).toBe(differentChannel.diceCount)
		expect(otherEntry.roll.dieType).toBe(differentChannel.dieType)
		expect(otherEntry.roll.modifier).toBe(differentChannel.modifier)

		expect(otherEntry.roll.values.length).toBe(differentChannel.values.length)
		for (let i = 0; i < otherEntry.roll.values.length; i++) {
			expect(otherEntry.roll.values[i]).toBe(differentChannel.values[i])
		}

		expect(otherEntry.userId).toBe(differentUserId)
		expect(otherEntry.userName).toBe(differentUserName)
		expect(otherEntry.guildId).toBe(differentChannelGuildId)
		expect(otherEntry.channelId).toBe(differentChannelId)
		expect(otherEntry.rolledAt).toBe(differentRolledAt)
	})
})
