import { LFUCache } from '../../src/caches/LFUCache'

describe('LFU Cache tests', () => {
	test('add should add the entry to the cache map', () => {
		// Arrange
		const key = '1'
		const entry = 1
		const lfuCache = new LFUCache<number>(1)

		// Act
		lfuCache.addCacheEntry(key, entry)

		// Assert
		const result = lfuCache.getCacheEntry(key)

		expect(result).toBeDefined()
		expect(result).toBe(entry)
	})

	test('add to a full cache should remove the least frequently used one and add the new entry', () => {
		// Arrange
		const key1 = '1'
		const entry1 = 1
		const key2 = '2'
		const entry2 = 2
		const key3 = '3'
		const entry3 = 3

		const lfuCache = new LFUCache<number>(2)

		lfuCache.addCacheEntry(key1, entry1)
		lfuCache.addCacheEntry(key2, entry2)

		lfuCache.getCacheEntry(key1) // Increments the frequency of key1

		// Act
		lfuCache.addCacheEntry(key3, entry3)

		// Assert
		const result = lfuCache.getCacheEntry(key3)
		expect(result).toBeDefined()
		expect(result).toBe(entry3)

		const shouldBePresent = lfuCache.getCacheEntry(key1)
		expect(shouldBePresent).toBeDefined()
		expect(shouldBePresent).toBe(entry1)

		const shouldBeRemoved = lfuCache.getCacheEntry(key2)
		expect(shouldBeRemoved).toBeUndefined()
	})

	test('getLFUKey should return undefined if the cache is empty', () => {
		// Arrange
		const lfuCache = new LFUCache<number>(2)

		// Act
		const result = lfuCache.getLFUKey()

		// Assert
		expect(result).toBeUndefined()
	})

	test('getLFUKey should return key of entry if entry is only one in cache', () => {
		// Arrange
		const key = '1'
		const entry = 1

		const lfuCache = new LFUCache<number>(1)

		lfuCache.addCacheEntry(key, entry)

		// Act
		const result = lfuCache.getLFUKey()

		// Assert
		expect(result).toBeDefined()
		expect(result).toBe(key)
	})

	test('getLFUKey should return key of entry that is least frequently used', () => {
		// Arrange
		const key1 = '1'
		const entry1 = 1
		const key2 = '1'
		const entry2 = 1

		const lfuCache = new LFUCache<number>(2)

		lfuCache.addCacheEntry(key1, entry1)
		lfuCache.addCacheEntry(key2, entry2)

		lfuCache.getCacheEntry(key1)

		// Act
		const result = lfuCache.getLFUKey()

		// Assert
		expect(result).toBeDefined()
		expect(result).toBe(key2)
	})

	test('getCacheEntry should return the entry with a the same key as the one provided', () => {
		// Arrange
		const key = '1'
		const entry = 1
		const lfuCache = new LFUCache<number>(1)
		lfuCache.addCacheEntry(key, entry)

		// Act
		const result = lfuCache.getCacheEntry(key)

		// Assert
		expect(result).toBeDefined()
		expect(result).toBe(entry)
	})

	test('getCacheEntry should return the entry with a the same key as the one provided with multiple entries in cache', () => {
		// Arrange
		const key1 = '1'
		const entry1 = 1
		const key2 = '1'
		const entry2 = 1

		const lfuCache = new LFUCache<number>(2)

		lfuCache.addCacheEntry(key1, entry1)
		lfuCache.addCacheEntry(key2, entry2)

		// Act
		const result = lfuCache.getCacheEntry(key1)

		// Assert
		expect(result).toBeDefined()
		expect(result).toBe(entry1)
	})

	test('getCacheEntry should return undefined if the cache is empty', () => {
		// Arrange
		const lfuCache = new LFUCache<number>(1)

		// Act
		const result = lfuCache.getCacheEntry('key')

		// Assert
		expect(result).toBeUndefined()
	})

	test('getCacheEntry should return undefined if the key is not found in the cache', () => {
		// Arrange
		const key = '1'
		const entry = 1
		const lfuCache = new LFUCache<number>(1)
		lfuCache.addCacheEntry(key, entry)

		// Act
		const result = lfuCache.getCacheEntry('2')

		// Assert
		expect(result).toBeUndefined()
	})

	test('isFull should return true if the cache is full', () => {
		// Arrange
		const key = '1'
		const entry = 1
		const lfuCache = new LFUCache<number>(1)
		lfuCache.addCacheEntry(key, entry)

		// Act
		const result = lfuCache.isFull()

		// Assert
		expect(result).toBe(true)
	})

	test('isFull should return false if the cache is not full', () => {
		// Arrange
		const key = '1'
		const entry = 1
		const lfuCache = new LFUCache<number>(2)
		lfuCache.addCacheEntry(key, entry)

		// Act
		const result = lfuCache.isFull()

		// Assert
		expect(result).toBe(false)
	})

	test('isFull should return false if the cache is empty', () => {
		// Arrange
		const lfuCache = new LFUCache<number>(2)

		// Act
		const result = lfuCache.isFull()

		// Assert
		expect(result).toBe(false)
	})

	test('updateCacheEntry should update the data with a given key to contain the new data in the cache', () => {
		// Arrange
		const key = '1'
		const entry = 1
		const updatedEntry = 2
		const lfuCache = new LFUCache<number>(1)
		lfuCache.addCacheEntry(key, entry)

		// Act
		lfuCache.updateCacheEntry(key, updatedEntry)
		
		// Assert
		const result = lfuCache.getCacheEntry(key)

		expect(result).toBeDefined()
		expect(result).not.toBe(entry)
		expect(result).toBe(updatedEntry)
	})

	test('updateCacheEntry should update the data with a given key to contain the new data in the cache given there are multiple entries in the cache', () => {
		// Arrange
		const key1 = '1'
		const entry1 = 1
		const key2 = '2'
		const entry2 = 2
		const updatedEntry = 3
		const lfuCache = new LFUCache<number>(2)
		lfuCache.addCacheEntry(key1, entry1)
		lfuCache.addCacheEntry(key2, entry2)

		// Act
		lfuCache.updateCacheEntry(key1, updatedEntry)

		// Assert
		const result = lfuCache.getCacheEntry(key1)

		// Assert key1 us updated to the new data
		expect(result).toBeDefined()
		expect(result).not.toBe(entry1)
		expect(result).toBe(updatedEntry)

		// Assert the other entry is not modified
		const nonUpdatedResult = lfuCache.getCacheEntry(key2)
		expect(nonUpdatedResult).toBe(entry2)
	})

	test('updateCacheEntry should update its cache entry frequency', () => {
		// Arrange
		const key1 = '1'
		const entry1 = 1
		const key2 = '2'
		const entry2 = 2
		const updatedEntry = 3
		const lfuCache = new LFUCache<number>(2)
		lfuCache.addCacheEntry(key1, entry1)
		lfuCache.addCacheEntry(key2, entry2)

		// Act
		lfuCache.updateCacheEntry(key1, updatedEntry)

		// Assert
		const result = lfuCache.getLFUKey()
		expect(result).toBe(key2)
	})

	test('updateCacheEntry should throw error if an attempt was made to update an entry that does not exist in the cache', () => {
		// Arrange
		const key = '1'
		const entry = 1
		const updatedEntry = 2
		const lfuCache = new LFUCache<number>(1)
		lfuCache.addCacheEntry(key, entry)

		// Act
		const error = () => {
			lfuCache.updateCacheEntry('2', updatedEntry)
		}

		// Assert
		expect(error).toThrow(Error)
	})
})
