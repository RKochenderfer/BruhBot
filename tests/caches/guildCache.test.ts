import { ServerCollection } from '../../src/extensions/server-collection'
import { Collection } from "mongodb"
import Server from '../../src/models/server'
import GuildCache from '../../src/caches/guildCache'
import { Nullable } from 'typescript-nullable'

jest.mock('../../src/extensions/server-collection')
jest.mock('mongodb')


describe('testing Guild Caching', () => {
	test('add should add the guild into the cache', async () => {
		// Arrange
		const mockedServerCollection: jest.Mocked<ServerCollection> = jest.mocked(ServerCollection) as any
		// const spy = jest.spyOn(mockedServerCollection, 'findServer').mockImplementation(() => Promise)
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
		// const spy = jest.spyOn(mockedServerCollection, 'findServer').mockImplementation(() => Promise)
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
		// const spy = jest.spyOn(mockedServerCollection, 'findServer').mockImplementation(() => Promise)
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
		// const spy = jest.spyOn(mockedServerCollection, 'findServer').mockImplementation(() => Promise)
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
})