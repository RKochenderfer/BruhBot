import { DiceRolledInfo } from '../models/diceRolledInfo'

export type CacheKey = string

class InitiativeCacheEntry {
	private constructor(
		private _diceRolledInfo: DiceRolledInfo[],
		private _allowNewEntries: boolean,
		private _timeCreated: Date,
		private _timeUpdated: Date,
	) {}

	get diceRolls(): DiceRolledInfo[] {
		return this._diceRolledInfo
	}

	get allowNewEntries(): boolean {
		return this._allowNewEntries
	}

	get timeCreated(): Date {
		return this._timeCreated
	}

	get timeUpdated(): Date {
		return this._timeUpdated
	}

	/**
	 * Adds a dice roll to the tracking. If a user with the same name has already
	 * rolled for this initiative tracking period, replace the entry.
	 * @param roll
	 */
	public addRoll(roll: DiceRolledInfo) {
		if (!this._allowNewEntries) {
			throw new Error('Initiative has been closed')
		}
		if (this.hasUserRolled(roll.name)) {
			// replace existing entries
			const updatedRolls = [...this._diceRolledInfo].filter(x => x.name !== roll.name)
			updatedRolls.push(roll)
			this._diceRolledInfo = updatedRolls
		} else {
			const updatedArray = [...this._diceRolledInfo]
			updatedArray.push(roll)
			this._diceRolledInfo = updatedArray
		}
		this._timeUpdated = new Date()
	}

	/**
	 * Removes a roll saved with the provided name from the dice rolls
	 * @param name the name of the entity whose roll is to be removed
	 * @returns true if a roll was removed, false otherwise
	 */
	public removeRollByName(name: string): boolean {
		if (!this.hasUserRolled(name)) {
			return false
		}

		this._diceRolledInfo = [...this._diceRolledInfo].filter(d => d.name !== name)
		this._timeUpdated = new Date()

		return true
	}

	/**
	 * Ends the initiative gathering process and no longer allow
	 * new rolls
	 */
	public endInitiative() {
		this._allowNewEntries = false
		this._timeUpdated = new Date()
	}

	static new(): InitiativeCacheEntry {
		return new InitiativeCacheEntry([], true, new Date(), new Date())
	}

	private hasUserRolled(name: string): boolean {
		const entry = this._diceRolledInfo.find(d => d.name === name)

		return entry ? true : false
	}
}

/**
 * The cache for tracking initiative in a channel
 */
export class InitiativeCache {
	private static instance?: InitiativeCache
	private static readonly _initiativeCache: Map<CacheKey, InitiativeCacheEntry> = new Map()
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	private constructor() {}

	/**
	 * Retrieve an active initiative cache entry
	 * @returns the cache instance
	 */
	static getInstance(): InitiativeCache {
		if (!this.instance) {
			return new InitiativeCache()
		}
		return this.instance!
	}

	/**
	 * Starts tracking dice rolls for a guild and server
	 * @param guildId the guild the channel being tracking is a part of
	 * @param channelId the channel where initiative is being tracked
	 */
	startInitiative(key: CacheKey) {
		if (this.hasInitiativeTrackingStartedFor(key)) {
			throw new Error('Initiative has already been started on this channel')
		}

		const newCacheEntry = InitiativeCacheEntry.new()
		InitiativeCache._initiativeCache.set(key, newCacheEntry)

		this.cleanCache()
	}

	/**
	 * Ends rolling initiative for the channel in a guild.
	 * @param guildId the guild the channel rolling initiative is in
	 * @param channelId the channel where initiatives were being gathered
	 * @returns the unordered dice rolls gathered while the channel was in initiative rolling mode
	 */
	endInitiative(key: CacheKey): DiceRolledInfo[] {
		this.guardAgainstInitiativeNotStarted(key)

		const cacheEntry = InitiativeCache._initiativeCache.get(key)!
		cacheEntry.endInitiative()
		InitiativeCache._initiativeCache.set(key, cacheEntry)

		this.cleanCache()

		return cacheEntry.diceRolls
	}

	/**
	 * Adds a roll to the initiative cache
	 * @param guildId guild the roll occurred in
	 * @param channelId channel the initiative is being tracked in
	 * @param roll the users roll
	 */
	addDiceRoll(key: CacheKey, roll: DiceRolledInfo) {
		this.guardAgainstInitiativeNotStarted(key)

		const cacheEntry = InitiativeCache._initiativeCache.get(key)!
		cacheEntry.addRoll(roll)
		InitiativeCache._initiativeCache.set(key, cacheEntry)

		this.cleanCache()
	}

	/**
	 * Checks if the guild and channel have an active initiative tracking ongoing
	 * @param guildId
	 * @param channelId
	 * @returns
	 */
	hasInitiativeTrackingStartedFor(key: CacheKey): boolean {
		return InitiativeCache._initiativeCache.has(key)
	}

	/**
	 * Checks if the guild and channel have not started initiative tracking
	 * @param guildId
	 * @param channelId
	 * @returns
	 */
	hasInitiativeTrackingNotStartedFor(key: CacheKey): boolean {
		return !this.hasInitiativeTrackingStartedFor(key)
	}

	/**
	 * Check to see if initiatives are still being gathered for a channel
	 * @param guildId
	 * @param channelId
	 * @returns
	 */
	isInitiativeActive(key: CacheKey): boolean {
		this.guardAgainstInitiativeNotStarted(key)

		const cacheEntry = InitiativeCache._initiativeCache.get(key)

		if (!cacheEntry) {
			return false
		}

		return cacheEntry.allowNewEntries
	}

	/**
	 * Retrieves the dice roll information. If you are intending to end the initiative process
	 * use endInitiative instead
	 * @param guildId the guild the rolls are taking place in
	 * @param channelId the channel where the initiatives are being rolled
	 * @returns the current dice results of the dice that have been rolled
	 */
	getRolls(key: CacheKey): DiceRolledInfo[] {
		this.guardAgainstInitiativeNotStarted(key)

		const cacheEntry = InitiativeCache._initiativeCache.get(key)!
		this.cleanCache()

		return cacheEntry.diceRolls
	}

	/**
	 * Removes the entry with the passed in
	 * @param guildId
	 * @param channelId
	 * @param name
	 */
	removeFor(key: CacheKey, name: string): boolean {
		this.guardAgainstInitiativeNotStarted(key)

		const entry = InitiativeCache._initiativeCache.get(key)!
		const wasRemoved = entry.removeRollByName(name)
		InitiativeCache._initiativeCache.set(key, entry)

		this.cleanCache()

		return wasRemoved
	}

	/**
	 * Removes expired cache entries
	 */
	private cleanCache() {
		// TODO: Figure out how to offload this to a worker or something so it doesn't bog everything down
		const keysToRemove = []
		for (const [key, entry] of InitiativeCache._initiativeCache.entries()) {
			if (this.isEntryExpired(entry)) {
				keysToRemove.push(key)
			}
		}

		for (const key of keysToRemove) {
			InitiativeCache._initiativeCache.delete(key)
		}
	}

	/**
	 * Checks if an entry has not been updated in 3 hours
	 * @param entry
	 */
	private isEntryExpired(entry: InitiativeCacheEntry): boolean {
		const now = new Date()
		const threeHoursInMs = 3 * 60 * 60 * 1000

		return now.getTime() - entry.timeUpdated.getTime() >= threeHoursInMs
	}

	/**
	 * Guards against the initiative not being started for the
	 * @param guildId
	 * @param channelId
	 */
	private guardAgainstInitiativeNotStarted(key: CacheKey) {
		if (this.hasInitiativeTrackingNotStartedFor(key)) {
			throw new Error('Initiative was never started for this channel')
		}
	}
}
