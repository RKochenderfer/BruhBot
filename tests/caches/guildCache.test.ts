import { ServerCollection } from '../../src/extensions/server-collection'
import Server from '../../src/models/server'
import GuildCache from '../../src/caches/guildCache'

jest.mock('../../src/extensions/server-collection')
jest.mock('mongodb')


describe('testing Guild Caching', () => {
	test('add should add the guild into the cache', async () => {
		// Arrange
		const mockedServerCollection: jest.Mocked<ServerCollection> = jest.mocked(ServerCollection) as any
		mockedServerCollection.findServer = jest.fn()
			.mockResolvedValue(null)
		mockedServerCollection.insertServer = jest.fn()
			.mockResolvedValue(undefined)
		
		const guildCache = GuildCache.getInstance(mockedServerCollection)
		const serverToAdd = {
			name: 'test',
			guildId: crypto.randomUUID(),
		} as Server

		// Act
		await guildCache.add(serverToAdd)

		// Assert
		expect(guildCache.has(serverToAdd.guildId)).resolves.toBe(true)
	})

	test('hasGuild should return true for guild in cache', async () => {
		// Arrange
		const mockedServerCollection: jest.Mocked<ServerCollection> = jest.mocked(ServerCollection) as any
		mockedServerCollection.findServer = jest.fn()
			.mockResolvedValue(null)
		mockedServerCollection.insertServer = jest.fn()
			.mockResolvedValue(undefined)
		const guildCache = GuildCache.getInstance(mockedServerCollection)
		const serverToAdd = {
			name: 'test',
			guildId: crypto.randomUUID(),
		} as Server
		await guildCache.add(serverToAdd)

		// Act
		const hasGuild = await guildCache.has(serverToAdd.guildId)

		// Assert
		expect(hasGuild).toBe(true)
	})

	test('hasGuild should return false for empty cache and cache not in server', async () => {
		// Arrange
		const mockedServerCollection: jest.Mocked<ServerCollection> = jest.mocked(ServerCollection) as any
		mockedServerCollection.findServer = jest.fn()
			.mockResolvedValue(null)
		mockedServerCollection.insertServer = jest.fn()
			.mockResolvedValue(undefined)
		const guildCache = GuildCache.getInstance(mockedServerCollection)

		// Act
		const hasGuild = await guildCache.has(crypto.randomUUID())

		// Assert
		expect(hasGuild).toBe(false)
	})

	test('hasGuild should return true for empty cache and but cache in server', async () => {
		// Arrange
		const serverInDb = {
			name: 'test',
			guildId: crypto.randomUUID(),
		} as Server
		const mockedServerCollection: jest.Mocked<ServerCollection> = jest.mocked(ServerCollection) as any
		mockedServerCollection.findServer = jest.fn()
			.mockResolvedValue(serverInDb)
		mockedServerCollection.insertServer = jest.fn()
			.mockResolvedValue(undefined)
		const guildCache = GuildCache.getInstance(mockedServerCollection)

		// Act
		const hasGuild = await guildCache.has(crypto.randomUUID())

		// Assert
		expect(hasGuild).toBe(true)
	})

	test('get returns entry in cache if only entry', async () => {
		// Arrange
		const mockedServerCollection: jest.Mocked<ServerCollection> = jest.mocked(ServerCollection) as any
		mockedServerCollection.findServer = jest.fn()
			.mockResolvedValue(null)
		mockedServerCollection.insertServer = jest.fn()
			.mockResolvedValue(undefined)

		const guildCache = GuildCache.getInstance(mockedServerCollection)
		const serverToAdd = {
			name: 'test',
			guildId: crypto.randomUUID(),
		} as Server
		await guildCache.add(serverToAdd)

		// Act
		const getEntry = guildCache.get(serverToAdd.guildId)

		// Assert
		expect(getEntry).toBeDefined()
		expect(getEntry!.name).toBe(serverToAdd.name)
		expect(getEntry!.guildId).toBe(serverToAdd.guildId)
	})

	test('get returns entry in cache if multiple entries in cache', async () => {
		// Arrange
		const mockedServerCollection: jest.Mocked<ServerCollection> = jest.mocked(ServerCollection) as any
		mockedServerCollection.findServer = jest.fn()
			.mockResolvedValue(null)
		mockedServerCollection.insertServer = jest.fn()
			.mockResolvedValue(undefined)

		const guildCache = GuildCache.getInstance(mockedServerCollection)
		const serverToAdd1 = {
			name: 'test 1',
			guildId: crypto.randomUUID(),
		} as Server
		const serverToAdd2 = {
			name: 'test 2',
			guildId: crypto.randomUUID(),
		} as Server
		await guildCache.add(serverToAdd1)
		await guildCache.add(serverToAdd2)

		// Act
		const getEntry = guildCache.get(serverToAdd1.guildId)

		// Assert
		expect(getEntry).toBeDefined()
		expect(getEntry!.name).toBe(serverToAdd1.name)
		expect(getEntry!.guildId).toBe(serverToAdd1.guildId)
	})

	test('get returns entry undefined if cache is empty', async () => {
		// Arrange
		const mockedServerCollection: jest.Mocked<ServerCollection> = jest.mocked(ServerCollection) as any

		const guildCache = GuildCache.getInstance(mockedServerCollection)

		// Act
		const getEntry = guildCache.get(crypto.randomUUID())

		// Assert
		expect(getEntry).toBeUndefined()
	})

	test('get returns entry undefined if entry is not in cache', async () => {
		// Arrange
		const mockedServerCollection: jest.Mocked<ServerCollection> = jest.mocked(ServerCollection) as any
		mockedServerCollection.findServer = jest.fn()
			.mockResolvedValue(null)
		mockedServerCollection.insertServer = jest.fn()
			.mockResolvedValue(undefined)

		const guildCache = GuildCache.getInstance(mockedServerCollection)
		const serverToAdd1 = {
			name: 'test 1',
			guildId: crypto.randomUUID(),
		} as Server
		const serverToAdd2 = {
			name: 'test 2',
			guildId: crypto.randomUUID(),
		} as Server
		await guildCache.add(serverToAdd1)
		await guildCache.add(serverToAdd2)

		// Act
		const getEntry = guildCache.get(crypto.randomUUID())

		// Assert
		expect(getEntry).toBeUndefined()
	})

	test('update should update the entry in cache with the new provided data', async () => {
		// Arrange
		const mockedServerCollection: jest.Mocked<ServerCollection> = jest.mocked(ServerCollection) as any
		// const spy = jest.spyOn(mockedServerCollection, 'findServer').mockImplementation(() => Promise)
		mockedServerCollection.findServer = jest.fn()
			.mockResolvedValue(null)
		mockedServerCollection.insertServer = jest.fn()
			.mockResolvedValue(undefined)
		mockedServerCollection.updateOne = jest.fn()
			.mockResolvedValue(undefined)
		const guildCache = GuildCache.getInstance(mockedServerCollection)

		const serverToAdd = {
			name: 'test',
			guildId: crypto.randomUUID(),
		} as Server
		await guildCache.add(serverToAdd)

		const updatedServerData = {
			name: 'new name',
			guildId: serverToAdd.guildId
		} as Server

		// Act
		await guildCache.update(updatedServerData.guildId, updatedServerData)

		// Assert
		const entry = guildCache.get(serverToAdd.guildId)
		
		expect(entry).toBeDefined()
		expect(entry!.name).toBe(updatedServerData.name)
		expect(entry!.guildId).toBe(updatedServerData.guildId)
	})
})