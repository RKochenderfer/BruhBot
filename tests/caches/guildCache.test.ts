import { ServerCollection } from '../../src/extensions/server-collection'
import Guild from '../../src/models/server'
import GuildCache from '../../src/caches/guildCache'
import * as crypto from 'crypto'

jest.mock('../../src/extensions/server-collection')
jest.mock('mongodb')

describe('testing Guild Caching', () => {
	test('add should add the guild into the cache', async () => {
		// Arrange
		const mockedServerCollection: jest.Mocked<ServerCollection> = jest.mocked(
			ServerCollection,
		) as any
		mockedServerCollection.findServer = jest.fn().mockResolvedValue(null)
		mockedServerCollection.insertServer = jest.fn().mockResolvedValue(undefined)

		const guildCache = GuildCache.getInstance(mockedServerCollection)
		const serverToAdd = {
			name: 'test',
			guildId: crypto.randomUUID(),
		} as Guild

		// Act
		await guildCache.add(serverToAdd)

		// Assert
		expect(guildCache.has(serverToAdd.guildId)).resolves.toBe(true)
		expect(mockedServerCollection.insertServer).toHaveBeenCalledTimes(1)
	})

	test('add should throw an error if guildId is already in the cache', async () => {
		// Arrange
		const mockedServerCollection: jest.Mocked<ServerCollection> = jest.mocked(
			ServerCollection,
		) as any
		mockedServerCollection.findServer = jest.fn().mockResolvedValue(null)
		mockedServerCollection.insertServer = jest.fn().mockResolvedValue(undefined)

		const guildCache = GuildCache.getInstance(mockedServerCollection)
		const serverToAdd = {
			name: 'test',
			guildId: crypto.randomUUID(),
		} as Guild
		await guildCache.add(serverToAdd)

		// Act
		try {
			await guildCache.add(serverToAdd)
		} catch (error) {
			// Assert
			expect(error.message).toBe('Guild already in cache')
		}
	})

	test('has should return true for guild in cache', async () => {
		// Arrange
		const mockedServerCollection: jest.Mocked<ServerCollection> = jest.mocked(
			ServerCollection,
		) as any
		mockedServerCollection.findServer = jest.fn().mockResolvedValue(null)
		mockedServerCollection.insertServer = jest.fn().mockResolvedValue(undefined)
		const guildCache = GuildCache.getInstance(mockedServerCollection)
		const serverToAdd = {
			name: 'test',
			guildId: crypto.randomUUID(),
		} as Guild
		await guildCache.add(serverToAdd)

		// Act
		const hasGuild = await guildCache.has(serverToAdd.guildId)

		// Assert
		expect(hasGuild).toBe(true)
	})

	test('has should return false for empty cache and cache not in server', async () => {
		// Arrange
		const mockedServerCollection: jest.Mocked<ServerCollection> = jest.mocked(
			ServerCollection,
		) as any
		mockedServerCollection.findServer = jest.fn().mockResolvedValue(null)
		mockedServerCollection.insertServer = jest.fn().mockResolvedValue(undefined)
		const guildCache = GuildCache.getInstance(mockedServerCollection)

		// Act
		const hasGuild = await guildCache.has(crypto.randomUUID())

		// Assert
		expect(hasGuild).toBe(false)
		expect(mockedServerCollection.findServer).toHaveBeenCalledTimes(1)
	})

	test('has should return true for empty cache and but cache in server', async () => {
		// Arrange
		const serverInDb = {
			name: 'test',
			guildId: crypto.randomUUID(),
		} as Guild
		const mockedServerCollection: jest.Mocked<ServerCollection> = jest.mocked(
			ServerCollection,
		) as any
		mockedServerCollection.findServer = jest.fn().mockResolvedValue(serverInDb)
		mockedServerCollection.insertServer = jest.fn().mockResolvedValue(undefined)
		const guildCache = GuildCache.getInstance(mockedServerCollection)

		// Act
		const hasGuild = await guildCache.has(crypto.randomUUID())

		// Assert
		expect(hasGuild).toBe(true)
		expect(mockedServerCollection.findServer).toHaveBeenCalledTimes(1)
	})

	test('get returns entry in cache if only entry', async () => {
		// Arrange
		const mockedServerCollection: jest.Mocked<ServerCollection> = jest.mocked(
			ServerCollection,
		) as any
		mockedServerCollection.findServer = jest.fn().mockResolvedValue(null)

		const guildCache = GuildCache.getInstance(mockedServerCollection)
		const serverToAdd = {
			name: 'test',
			guildId: crypto.randomUUID(),
		} as Guild
		await guildCache.add(serverToAdd)

		// Act
		const getEntry = await guildCache.get(serverToAdd.guildId)

		// Assert
		expect(getEntry).toBeDefined()
		expect(getEntry!.name).toBe(serverToAdd.name)
		expect(getEntry!.guildId).toBe(serverToAdd.guildId)
	})

	test('get returns entry in cache if multiple entries in cache', async () => {
		// Arrange
		const mockedServerCollection: jest.Mocked<ServerCollection> = jest.mocked(
			ServerCollection,
		) as any
		mockedServerCollection.findServer = jest.fn().mockResolvedValue(null)

		const guildCache = GuildCache.getInstance(mockedServerCollection)
		const serverToAdd1 = {
			name: 'test 1',
			guildId: crypto.randomUUID(),
		} as Guild
		const serverToAdd2 = {
			name: 'test 2',
			guildId: crypto.randomUUID(),
		} as Guild
		await guildCache.add(serverToAdd1)
		await guildCache.add(serverToAdd2)

		// Act
		const getEntry = await guildCache.get(serverToAdd1.guildId)

		// Assert
		expect(getEntry).toBeDefined()
		expect(getEntry!.name).toBe(serverToAdd1.name)
		expect(getEntry!.guildId).toBe(serverToAdd1.guildId)
	})

	test('get returns entry undefined if cache is empty and not found in database', async () => {
		// Arrange
		const mockedServerCollection: jest.Mocked<ServerCollection> = jest.mocked(
			ServerCollection,
		) as any

		const guildCache = GuildCache.getInstance(mockedServerCollection)

		// Act
		const getEntry = await guildCache.get(crypto.randomUUID())

		// Assert
		expect(getEntry).toBeUndefined()
	})

	test('get returns undefined if entry is not in cache and not in database', async () => {
		// Arrange
		const mockedServerCollection: jest.Mocked<ServerCollection> = jest.mocked(
			ServerCollection,
		) as any
		mockedServerCollection.findServer = jest.fn().mockResolvedValue(null)
		mockedServerCollection.insertServer = jest.fn().mockResolvedValue(undefined)

		const guildCache = GuildCache.getInstance(mockedServerCollection)
		const serverToAdd1 = {
			name: 'test 1',
			guildId: crypto.randomUUID(),
		} as Guild
		const serverToAdd2 = {
			name: 'test 2',
			guildId: crypto.randomUUID(),
		} as Guild
		await guildCache.add(serverToAdd1)
		await guildCache.add(serverToAdd2)

		// Act
		const getEntry = await guildCache.get(crypto.randomUUID())

		// Assert
		expect(getEntry).toBeUndefined()
	})

	test('get returns entry if entry is not in cache but is in database', async () => {
		// Arrange
		const mockedServerCollection: jest.Mocked<ServerCollection> = jest.mocked(
			ServerCollection,
		) as any
		const guildInDb = {
			name: 'test 1',
			guildId: crypto.randomUUID(),
		} as Guild
		mockedServerCollection.findServer = jest.fn().mockResolvedValue(guildInDb)

		const guildCache = GuildCache.getInstance(mockedServerCollection)

		// Act
		const result = await guildCache.get(guildInDb.guildId)

		// Assert
		expect(result).toBeDefined()
		expect(result!.name).toBe(guildInDb.name)
		expect(result!.guildId).toBe(guildInDb.guildId)
	})

	test('update should update the entry in cache with the new provided data', async () => {
		// Arrange
		const mockedServerCollection: jest.Mocked<ServerCollection> = jest.mocked(
			ServerCollection,
		) as any
		// const spy = jest.spyOn(mockedServerCollection, 'findServer').mockImplementation(() => Promise)
		mockedServerCollection.findServer = jest.fn().mockResolvedValue(null)
		mockedServerCollection.insertServer = jest.fn().mockResolvedValue(undefined)
		mockedServerCollection.updateOne = jest.fn().mockResolvedValue(undefined)
		const guildCache = GuildCache.getInstance(mockedServerCollection)

		const serverToAdd = {
			name: 'test',
			guildId: crypto.randomUUID(),
		} as Guild
		await guildCache.add(serverToAdd)

		const updatedServerData = {
			name: 'new name',
			guildId: serverToAdd.guildId,
		} as Guild

		// Act
		await guildCache.update(updatedServerData.guildId, updatedServerData)

		// Assert
		const entry = await guildCache.get(serverToAdd.guildId)

		expect(entry).toBeDefined()
		expect(entry!.name).toBe(updatedServerData.name)
		expect(entry!.guildId).toBe(updatedServerData.guildId)
		expect(mockedServerCollection.updateOne).toHaveBeenCalledTimes(1)
	})
})
