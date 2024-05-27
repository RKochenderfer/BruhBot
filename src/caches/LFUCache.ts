export class CacheEntry<T> {
	private _frequency: number = 0;

	constructor(private _data: T) { }

	public get data(): T {
		return this._data;
	}

	public set data(newData: T) {
		this._data = newData;
	}

	public get frequency() {
		return this._frequency;
	}

	public set frequency(frequency: number) {
		this._frequency = frequency;
	}
}

/**
 * A Least Frequently Used Cache manager
 */
export class LFUCache<T> {
	private _initialCapacity: number;
	private _cacheMap: Map<string, CacheEntry<T>> = new Map();

	protected constructor(initialCapacity: number) {
		this._initialCapacity = initialCapacity;
	}

	/**
	 * Adds data to the cache
	 * @param key - 
	 * @param data 
	 */
	public addCacheEntry(key: string, data: T) {
		if (!this.isFull()) {
			this._cacheMap.set(key, new CacheEntry(data));
		} else {
			const keyToRemove = this.getLFUKey();
			this._cacheMap.delete(keyToRemove);
			this._cacheMap.set(key, new CacheEntry(data));
		}
	}

	public getLFUKey() {
		let minValue = Number.MAX_SAFE_INTEGER;
		let keyToReturn = '';

		for (let [key, entry] of this._cacheMap) {
			if (minValue > entry.frequency) {
				minValue = entry.frequency;
				keyToReturn = key
			}
		}

		return keyToReturn;
	}

	public getCacheEntry(key: string) {
		if (!this._cacheMap.has(key)) return null;

		const entry = this._cacheMap.get(key)!;
		entry.frequency = entry.frequency++;
		this._cacheMap.set(key, entry);

		return entry.data;
	}

	public isFull(): boolean {
		return this._cacheMap.size === this._initialCapacity;
	}
}
