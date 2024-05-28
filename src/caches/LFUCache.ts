export class CacheEntry<T> {
	private _frequency: number = 0

	constructor(private _data: T) {}

	public get data(): T {
		return this._data
	}

	public set data(newData: T) {
		this._data = newData
	}

	public get frequency() {
		return this._frequency
	}

	public set frequency(frequency: number) {
		this._frequency = frequency
	}
}

/**
 * A Least Frequently Used Cache
 * @template T The entry data type
 */
export class LFUCache<T> {
	private _initialCapacity: number
	private _cacheMap: Map<string, CacheEntry<T>> = new Map()

	protected constructor(initialCapacity: number) {
		this._initialCapacity = initialCapacity
	}

	/**
	 * Adds data to the cache
	 * @param key
	 * @param data
	 */
	protected addCacheEntry(key: string, data: T) {
		if (!this.isFull()) {
			this._cacheMap.set(key, new CacheEntry(data))
		} else {
			const keyToRemove = this.getLFUKey()!
			this._cacheMap.delete(keyToRemove)
			this._cacheMap.set(key, new CacheEntry(data))
		}
	}

	/**
	 * get the least frequently used key
	 * @returns the key of the least frequently used entry
	 */
	protected getLFUKey(): string | undefined {
		let minValue = Number.MAX_SAFE_INTEGER
		let keyToReturn = ''

		for (let [key, entry] of this._cacheMap) {
			if (minValue > entry.frequency) {
				minValue = entry.frequency
				keyToReturn = key
			}
		}

		return keyToReturn
	}

	/**
	 * get the entry in the cache with the given key
	 * @param {T} key - the key of the entry to be returned
	 * @returns
	 */
	protected getCacheEntry(key: string): T | undefined {
		if (!this._cacheMap.has(key)) return undefined

		const entry = this._cacheMap.get(key)!
		entry.frequency = entry.frequency++
		this._cacheMap.set(key, entry)

		return entry.data
	}

	/**
	 * Checks if the cache is full
	 * @returns true if the map is full, false otherwise
	 */
	protected isFull(): boolean {
		return this._cacheMap.size === this._initialCapacity
	}

	/**
	 * For a given key, replaces the entry with the provided entry data
	 * @param {T} keyToUpdate - Key for the entry
	 * @param {V} data - the data to replace the current one
	 */
	protected updateCacheEntry(keyToUpdate: string, data: T) {
		if (!this._cacheMap.has(keyToUpdate)) throw new Error(`Provided key ${keyToUpdate} was not found in cache`)

		const oldEntry = this._cacheMap.get(keyToUpdate)!
		const newEntry = new CacheEntry(data)
		newEntry.frequency = oldEntry.frequency++

		this._cacheMap.set(keyToUpdate, newEntry)
	}
}
