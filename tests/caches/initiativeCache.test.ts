import { InitiativeCache } from '../../src/caches/initiativeCache'
import { DiceRolledInfo } from '../../src/models/diceRolledInfo'
import { RollInformation } from '../../src/models/rollInformation'

describe('initiativeCache tests', () => {
	test('startInitiative should create a cache entry', () => {
		// arrange
		const guildId = crypto.randomUUID()
		const channelId = crypto.randomUUID()
		const cache = InitiativeCache.getInstance()
		const key = `${guildId}|${channelId}`

		// act
		cache.startInitiative(key)

		// assert
		const hasInitiativeStarted = cache.hasTrackingEntry(key)
		expect(hasInitiativeStarted).toBe(true)
	})

	test('endInitiative should not allow new entries', () => {
		// arrange
		const guildId = crypto.randomUUID()
		const channelId = crypto.randomUUID()
		const cache = InitiativeCache.getInstance()
		const key = `${guildId}|${channelId}`
		cache.startInitiative(key)

		// act
		cache.endInitiative(key)

		// assert
		const isInitiativeActive = cache.isInitiativeActive(key)
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
			cache.addDiceRoll(key, diceRolledInfo)
		}

		expect(add).toThrow(Error)
	})

	test('endInitiative when it has not been started should throw an error', () => {
		// arrange
		const guildId = crypto.randomUUID()
		const channelId = crypto.randomUUID()
		const cache = InitiativeCache.getInstance()
		const key = `${guildId}|${channelId}`

		// act
		const act = () => {
			cache.endInitiative(
				key,
			)
		}

		// assert
		expect(act).toThrow(Error)
	})

	test('endInitiative should only end on its own entry', () => {
		// arrange
		// arrange initiative
		const guildId = crypto.randomUUID()
		const channelId = crypto.randomUUID()
		const cache = InitiativeCache.getInstance()
		const key = `${guildId}|${channelId}`
		cache.startInitiative(key)

		// arrange roll
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

		// arrange ended initiative
		const otherGuildId = crypto.randomUUID()
		const otherChannelId = crypto.randomUUID()
		const otherRollInformation = {
			diceCount: 2,
			dieType: 20,
			modifierString: '+1',
			values: [3, 4],
		} as RollInformation
		const otherRolledAt = new Date()
		const otherDiceRolledInfo = DiceRolledInfo.from(otherRollInformation, userId, userName, otherGuildId, otherChannelId, otherRolledAt)
		const otherKey = `${otherGuildId}|${otherChannelId}`
		cache.startInitiative(otherKey)
		cache.addDiceRoll(otherKey, otherDiceRolledInfo)

		// act
		cache.endInitiative(otherKey)

		// assert
		cache.addDiceRoll(key, diceRolledInfo)

		const getRolls = cache.getRolls(key)
		expect(getRolls.length).toBe(1)
	})


	test('hasInitiativeStartedFor should return false if initiative not been started', () => {
		// arrange
		const guildId = crypto.randomUUID()
		const channelId = crypto.randomUUID()
		const key = `${guildId}|${channelId}`
		const cache = InitiativeCache.getInstance()

		// act
		const hasStarted = cache.hasTrackingEntry(key)

		// assert
		expect(hasStarted).toBe(false)
	})

	test('addDiceRoll when initiative is started should add the roll to the cache if the name is not already in there', () => {
		// arrange
		// arrange initiative
		const guildId = crypto.randomUUID()
		const channelId = crypto.randomUUID()
		const cache = InitiativeCache.getInstance()
		const key = `${guildId}|${channelId}`
		cache.startInitiative(key)

		// arrange roll
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
		cache.addDiceRoll(key, diceRolledInfo)

		const newRollInformation = {
			diceCount: 2,
			dieType: 20,
			modifierString: '+1',
			values: [3, 4],
		} as RollInformation
		const newUserId = crypto.randomUUID()
		const newUserName = 'new'
		const newRolledAt = new Date()
		const newDiceRolledInfo = DiceRolledInfo.from(
			newRollInformation,
			newUserId,
			newUserName,
			guildId,
			channelId,
			newRolledAt,
		)

		// act
		cache.addDiceRoll(key, newDiceRolledInfo)
		// assert
		const entries = cache.getRolls(key)

		expect(entries.length).toBe(2)
		const firstEntry = entries[0]

		expect(firstEntry.roll.diceCount).toBe(rollInformation.diceCount)
		expect(firstEntry.roll.dieType).toBe(rollInformation.dieType)
		expect(firstEntry.roll.modifierString).toBe(rollInformation.modifierString)

		expect(firstEntry.roll.values.length).toBe(rollInformation.values.length)
		for (let i = 0; i < firstEntry.roll.values.length; i++) {
			expect(firstEntry.roll.values[i]).toBe(rollInformation.values[i])
		}

		expect(firstEntry.userId).toBe(userId)
		expect(firstEntry.name).toBe(userName)
		expect(firstEntry.guildId).toBe(guildId)
		expect(firstEntry.channelId).toBe(channelId)
		expect(firstEntry.rolledAt).toBe(rolledAt)

		const secondEntry = entries[1]

		expect(secondEntry.roll.diceCount).toBe(newRollInformation.diceCount)
		expect(secondEntry.roll.dieType).toBe(newRollInformation.dieType)
		expect(secondEntry.roll.modifierString).toBe(newRollInformation.modifierString)

		expect(secondEntry.roll.values.length).toBe(newRollInformation.values.length)
		for (let i = 0; i < secondEntry.roll.values.length; i++) {
			expect(secondEntry.roll.values[i]).toBe(newRollInformation.values[i])
		}

		expect(secondEntry.userId).toBe(newUserId)
		expect(secondEntry.name).toBe(newUserName)
		expect(secondEntry.guildId).toBe(guildId)
		expect(secondEntry.channelId).toBe(channelId)
		expect(secondEntry.rolledAt).toBe(newRolledAt)
	})

	test('addDiceRoll when initiative is started should add the roll to the cache', () => {
		// arrange
		// arrange initiative
		const guildId = crypto.randomUUID()
		const channelId = crypto.randomUUID()
		const cache = InitiativeCache.getInstance()
		const key = `${guildId}|${channelId}`
		cache.startInitiative(key)

		// arrange roll
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
		cache.addDiceRoll(key, diceRolledInfo)

		// assert
		const entries = cache.getRolls(key)

		expect(entries.length).toBe(1)
		const entry = entries[0]

		expect(entry.roll.diceCount).toBe(rollInformation.diceCount)
		expect(entry.roll.dieType).toBe(rollInformation.dieType)
		expect(entry.roll.modifierString).toBe(rollInformation.modifierString)

		expect(entry.roll.values.length).toBe(rollInformation.values.length)
		for (let i = 0; i < entry.roll.values.length; i++) {
			expect(entry.roll.values[i]).toBe(rollInformation.values[i])
		}

		expect(entry.userId).toBe(userId)
		expect(entry.name).toBe(userName)
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
		const key = `${guildId}|${channelId}`
		cache.startInitiative(key)

		// arrange first roll
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
		cache.addDiceRoll(key, diceRolledInfo)

		// arrange roll that will fail
		const newRollInformation = {
			diceCount: 2,
			dieType: 20,
			modifierString: '+1',
			values: [3, 4],
		} as RollInformation
		const newUserId = crypto.randomUUID()
		const newUserName = 'test'
		const newRolledAt = new Date()
		const newDiceRolledInfo = DiceRolledInfo.from(
			newRollInformation,
			newUserId,
			newUserName,
			guildId,
			channelId,
			newRolledAt,
		)

		cache.endInitiative(key)

		// act
		const act = () => {
			cache.addDiceRoll(key, newDiceRolledInfo)
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
			modifierString: '+1',
			values: [3, 4],
		} as RollInformation
		const guildId = crypto.randomUUID()
		const channelId = crypto.randomUUID()
		const key = `${guildId}|${channelId}`
		const userId = crypto.randomUUID()
		const userName = 'test'
		const rolledAt = new Date()
		const diceRolledInfo = DiceRolledInfo.from(rollInformation, userId, userName, guildId, channelId, rolledAt)

		const cache = InitiativeCache.getInstance()
		// act
		const act = () => {
			cache.addDiceRoll(key, diceRolledInfo)
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
		const key = `${guildId}|${channelId}`
		cache.startInitiative(key)

		// arrange roll
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

		cache.addDiceRoll(key, diceRolledInfo)

		const newRolledInformation = {
			diceCount: 1,
			dieType: 6,
			modifierString: '-1',
			values: [2, 1],
		} as RollInformation
		const newRolledAt = new Date()
		const newRollInfo = DiceRolledInfo.from(newRolledInformation, userId, userName, guildId, channelId, newRolledAt)

		// act
		cache.addDiceRoll(key, newRollInfo)

		// assert
		const entries = cache.getRolls(key)

		expect(entries.length).toBe(1)
		const entry = entries[0]

		expect(entry.roll.diceCount).toBe(newRolledInformation.diceCount)
		expect(entry.roll.dieType).toBe(newRolledInformation.dieType)
		expect(entry.roll.modifierString).toBe(newRolledInformation.modifierString)

		expect(entry.roll.values.length).toBe(newRolledInformation.values.length)
		for (let i = 0; i < entry.roll.values.length; i++) {
			expect(entry.roll.values[i]).toBe(newRolledInformation.values[i])
		}

		expect(entry.userId).toBe(userId)
		expect(entry.name).toBe(userName)
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
		const differentKey = `${differentChannelGuildId}|${differentChannelId}`
		cache.startInitiative(differentKey)

		// arrange roll
		const differentChannel = {
			diceCount: 2,
			dieType: 20,
			modifierString: '+1',
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

		cache.addDiceRoll(differentKey, differentChannelRolledInfo)

		const newRolledInformation = {
			diceCount: 1,
			dieType: 6,
			modifierString: '-1',
			values: [2, 1],
		} as RollInformation
		const guildId = crypto.randomUUID()
		const channelId = crypto.randomUUID()
		const key = `${guildId}|${channelId}`
		const userId = crypto.randomUUID()
		const userName = 'test'
		const rolledAt = new Date()
		const newRollInfo = DiceRolledInfo.from(newRolledInformation, userId, userName, guildId, channelId, rolledAt)
		cache.startInitiative(key)
		cache.addDiceRoll(key, newRollInfo)

		// act
		cache.endInitiative(key)

		// assert
		// assert returned rolls is only from the passed in guild
		const rolls = cache.getRolls(key)
		expect(rolls.length).toBe(1)
		const entry = rolls[0]

		expect(entry.roll.diceCount).toBe(newRolledInformation.diceCount)
		expect(entry.roll.dieType).toBe(newRolledInformation.dieType)
		expect(entry.roll.modifierString).toBe(newRolledInformation.modifierString)

		expect(entry.roll.values.length).toBe(newRolledInformation.values.length)
		for (let i = 0; i < entry.roll.values.length; i++) {
			expect(entry.roll.values[i]).toBe(newRolledInformation.values[i])
		}

		expect(entry.userId).toBe(userId)
		expect(entry.name).toBe(userName)
		expect(entry.guildId).toBe(guildId)
		expect(entry.channelId).toBe(channelId)
		expect(entry.rolledAt).toBe(rolledAt)

		// assert other initiative is still active and unchanged
		const otherChannelHasInitiativeTrackingStarted = cache.hasTrackingEntry(
			differentKey,
		)
		expect(otherChannelHasInitiativeTrackingStarted).toBe(true)

		const entries = cache.getRolls(differentKey)

		expect(entries.length).toBe(1)
		const otherEntry = entries[0]

		expect(otherEntry.roll.diceCount).toBe(differentChannel.diceCount)
		expect(otherEntry.roll.dieType).toBe(differentChannel.dieType)
		expect(otherEntry.roll.modifierString).toBe(differentChannel.modifierString)

		expect(otherEntry.roll.values.length).toBe(differentChannel.values.length)
		for (let i = 0; i < otherEntry.roll.values.length; i++) {
			expect(otherEntry.roll.values[i]).toBe(differentChannel.values[i])
		}

		expect(otherEntry.userId).toBe(differentUserId)
		expect(otherEntry.name).toBe(differentUserName)
		expect(otherEntry.guildId).toBe(differentChannelGuildId)
		expect(otherEntry.channelId).toBe(differentChannelId)
		expect(otherEntry.rolledAt).toBe(differentRolledAt)
	})

	test('getRolls should return the roll results for only that channel even if initiative has ended', () => {
		// arrange
		// arrange initiative
		const differentChannelGuildId = crypto.randomUUID()
		const differentChannelId = crypto.randomUUID()
		const differentKey = `${differentChannelGuildId}|${differentChannelId}`
		const cache = InitiativeCache.getInstance()
		cache.startInitiative(differentKey)

		// arrange roll
		const differentChannel = {
			diceCount: 2,
			dieType: 20,
			modifierString: '+1',
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

		cache.addDiceRoll(differentKey, differentChannelRolledInfo)

		const newRolledInformation = {
			diceCount: 1,
			dieType: 6,
			modifierString: '-1',
			values: [2, 1],
		} as RollInformation
		const guildId = crypto.randomUUID()
		const channelId = crypto.randomUUID()
		const key = `${guildId}|${channelId}`
		const userId = crypto.randomUUID()
		const userName = 'test'
		const rolledAt = new Date()
		const newRollInfo = DiceRolledInfo.from(newRolledInformation, userId, userName, guildId, channelId, rolledAt)
		cache.startInitiative(key)
		cache.addDiceRoll(key, newRollInfo)
		cache.endInitiative(key)

		// act
		const rolls = cache.getRolls(key)

		// assert
		// assert returned rolls is only from the passed in guild
		expect(rolls.length).toBe(1)
		const entry = rolls[0]

		expect(entry.roll.diceCount).toBe(newRolledInformation.diceCount)
		expect(entry.roll.dieType).toBe(newRolledInformation.dieType)
		expect(entry.roll.modifierString).toBe(newRolledInformation.modifierString)

		expect(entry.roll.values.length).toBe(newRolledInformation.values.length)
		for (let i = 0; i < entry.roll.values.length; i++) {
			expect(entry.roll.values[i]).toBe(newRolledInformation.values[i])
		}

		expect(entry.userId).toBe(userId)
		expect(entry.name).toBe(userName)
		expect(entry.guildId).toBe(guildId)
		expect(entry.channelId).toBe(channelId)
		expect(entry.rolledAt).toBe(rolledAt)

		// assert other initiative is still active and unchanged
		const otherChannelHasInitiativeTrackingStarted = cache.hasTrackingEntry(
			differentKey,
		)
		expect(otherChannelHasInitiativeTrackingStarted).toBe(true)

		const entries = cache.getRolls(differentKey)

		expect(entries.length).toBe(1)
		const otherEntry = entries[0]

		expect(otherEntry.roll.diceCount).toBe(differentChannel.diceCount)
		expect(otherEntry.roll.dieType).toBe(differentChannel.dieType)
		expect(otherEntry.roll.modifierString).toBe(differentChannel.modifierString)

		expect(otherEntry.roll.values.length).toBe(differentChannel.values.length)
		for (let i = 0; i < otherEntry.roll.values.length; i++) {
			expect(otherEntry.roll.values[i]).toBe(differentChannel.values[i])
		}

		expect(otherEntry.userId).toBe(differentUserId)
		expect(otherEntry.name).toBe(differentUserName)
		expect(otherEntry.guildId).toBe(differentChannelGuildId)
		expect(otherEntry.channelId).toBe(differentChannelId)
		expect(otherEntry.rolledAt).toBe(differentRolledAt)
	})

	test('removeRoll, with initiative still being collected should remove a the roll for a name from the cache', () => {
		// arrange
		// arrange initiative
		const guildId = crypto.randomUUID()
		const channelId = crypto.randomUUID()
		const key = `${guildId}|${channelId}`
		const cache = InitiativeCache.getInstance()
		cache.startInitiative(key)

		// arrange roll that will be removed
		const differentChannel = {
			diceCount: 2,
			dieType: 20,
			modifierString: '+1',
			values: [3, 4],
		} as RollInformation
		const differentUserId = crypto.randomUUID()
		const differentUserName = 'different'
		const differentRolledAt = new Date()
		const differentChannelRolledInfo = DiceRolledInfo.from(
			differentChannel,
			differentUserId,
			differentUserName,
			guildId,
			channelId,
			differentRolledAt,
		)

		cache.addDiceRoll(key, differentChannelRolledInfo)

		// arrange roll that will not be removed
		const newRolledInformation = {
			diceCount: 1,
			dieType: 6,
			modifierString: '-1',
			values: [2, 1],
		} as RollInformation
		const userId = crypto.randomUUID()
		const userName = 'test'
		const rolledAt = new Date()
		const newRollInfo = DiceRolledInfo.from(newRolledInformation, userId, userName, guildId, channelId, rolledAt)
		cache.addDiceRoll(key, newRollInfo)

		// act
		cache.removeFor(key, differentUserName)

		// assert
		const entries = cache.getRolls(key)
		expect(entries.length).toBe(1)
		const entry = entries[0]

		expect(entry.roll.diceCount).toBe(newRolledInformation.diceCount)
		expect(entry.roll.dieType).toBe(newRolledInformation.dieType)
		expect(entry.roll.modifierString).toBe(newRolledInformation.modifierString)

		expect(entry.roll.values.length).toBe(newRolledInformation.values.length)
		for (let i = 0; i < entry.roll.values.length; i++) {
			expect(entry.roll.values[i]).toBe(newRolledInformation.values[i])
		}

		expect(entry.userId).toBe(userId)
		expect(entry.name).toBe(userName)
		expect(entry.guildId).toBe(guildId)
		expect(entry.channelId).toBe(channelId)
		expect(entry.rolledAt).toBe(rolledAt)
	})

	test('removeRoll, with the same name on different rolls, should only remove the entry from the guild and channel specified', () => {
		// arrange
		// arrange initiative
		const otherGuildId = crypto.randomUUID()
		const otherChannelId = crypto.randomUUID()
		const otherKey = `${otherGuildId}|${otherChannelId}`
		const cache = InitiativeCache.getInstance()
		const name = 'test'
		cache.startInitiative(otherKey)

		// arrange roll that will be removed
		const differentChannel = {
			diceCount: 2,
			dieType: 20,
			modifierString: '+1',
			values: [3, 4],
		} as RollInformation
		const differentUserId = crypto.randomUUID()
		const differentRolledAt = new Date()
		const differentChannelRolledInfo = DiceRolledInfo.from(
			differentChannel,
			differentUserId,
			name,
			otherGuildId,
			otherChannelId,
			differentRolledAt,
		)

		cache.addDiceRoll(otherKey, differentChannelRolledInfo)

		// arrange roll that will not be removed
		const guildId = crypto.randomUUID()
		const channelId = crypto.randomUUID()
		const key = `${guildId}|${channelId}`
		const newRolledInformation = {
			diceCount: 1,
			dieType: 6,
			modifierString: '-1',
			values: [2, 1],
		} as RollInformation
		const userId = crypto.randomUUID()
		const rolledAt = new Date()
		const newRollInfo = DiceRolledInfo.from(newRolledInformation, userId, name, guildId, channelId, rolledAt)
		cache.startInitiative(key)
		cache.addDiceRoll(key, newRollInfo)

		// act
		cache.removeFor(key, name)

		// assert
		const entriesThatHadTheRemoval = cache.getRolls(key)
		expect(entriesThatHadTheRemoval.length).toBe(0)

		const entriesThatShouldNotBeRemoved = cache.getRolls(otherKey)
		expect(entriesThatShouldNotBeRemoved.length).toBe(1)
	})

	test('removeRoll, with initiative still being collected should remove a the roll for a name from the cache', () => {
		// arrange
		// arrange initiative
		const guildId = crypto.randomUUID()
		const channelId = crypto.randomUUID()
		const key = `${guildId}|${channelId}`
		const cache = InitiativeCache.getInstance()
		cache.startInitiative(key)

		// arrange roll that will be removed
		const differentChannel = {
			diceCount: 2,
			dieType: 20,
			modifierString: '+1',
			values: [3, 4],
		} as RollInformation
		const differentUserId = crypto.randomUUID()
		const differentUserName = 'different'
		const differentRolledAt = new Date()
		const differentChannelRolledInfo = DiceRolledInfo.from(
			differentChannel,
			differentUserId,
			differentUserName,
			guildId,
			channelId,
			differentRolledAt,
		)

		cache.addDiceRoll(key, differentChannelRolledInfo)

		// arrange roll that will not be removed
		const newRolledInformation = {
			diceCount: 1,
			dieType: 6,
			modifierString: '-1',
			values: [2, 1],
		} as RollInformation
		const userId = crypto.randomUUID()
		const userName = 'test'
		const rolledAt = new Date()
		const newRollInfo = DiceRolledInfo.from(newRolledInformation, userId, userName, guildId, channelId, rolledAt)
		cache.addDiceRoll(key, newRollInfo)

		// act
		cache.removeFor(key, differentUserName)

		// assert
		const entries = cache.getRolls(key)
		expect(entries.length).toBe(1)
		const entry = entries[0]

		expect(entry.roll.diceCount).toBe(newRolledInformation.diceCount)
		expect(entry.roll.dieType).toBe(newRolledInformation.dieType)
		expect(entry.roll.modifierString).toBe(newRolledInformation.modifierString)

		expect(entry.roll.values.length).toBe(newRolledInformation.values.length)
		for (let i = 0; i < entry.roll.values.length; i++) {
			expect(entry.roll.values[i]).toBe(newRolledInformation.values[i])
		}

		expect(entry.userId).toBe(userId)
		expect(entry.name).toBe(userName)
		expect(entry.guildId).toBe(guildId)
		expect(entry.channelId).toBe(channelId)
		expect(entry.rolledAt).toBe(rolledAt)
	})
})
