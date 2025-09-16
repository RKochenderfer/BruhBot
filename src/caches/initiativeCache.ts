import { DiceRolledInfo } from '../models/diceRolledInfo'

type CacheKey = string

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
		if (this.hasUserRolled(roll.userName)) {
			// replace existing entries
			const updatedRolls = [...this._diceRolledInfo].filter(x => x.userName !== roll.userName)
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
	 * Ends the initiative gathering process and no longer allow
	 * new rolls
	 */
	public endInitiative() {
		this._allowNewEntries = false
		this._timeUpdated = new Date()
	}

	public removeRollByName(name: string): DiceRolledInfo | undefined {
		const entry = this._diceRolledInfo.find(d => d.userName === name)
		if (entry) {
			this._diceRolledInfo = [...this.diceRolls].filter(d => d.userName === name)
			this._timeUpdated = new Date()
		}

		return entry
	}

	static new(): InitiativeCacheEntry {
		return new InitiativeCacheEntry([], true, new Date(), new Date())
	}

	private hasUserRolled(name: string): boolean {
		const entry = this._diceRolledInfo.find(d => d.userName === name)

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
	startInitiative(guildId: string, channelId: string) {
		const key = this.buildCacheKey(guildId, channelId)

		if (this.hasInitiativeTrackingStartedFor(guildId, channelId)) {
			throw new Error('Initiative has already been started on this channel')
		}

		const newCacheEntry = InitiativeCacheEntry.new()
		InitiativeCache._initiativeCache.set(key, newCacheEntry)

		this.cleanCache()
	}

	/**
	 * Ends rolling initiative for the channel in a guild, removes them from the cache and sends the callers the final rolls.
	 * @param guildId the guild the channel rolling initiative is in
	 * @param channelId the channel where initiatives were being gathered
	 * @returns the unordered dice rolls gathered while the channel was in initiative rolling mode
	 */
	endInitiative(guildId: string, channelId: string): DiceRolledInfo[] {
		const key = this.buildCacheKey(guildId, channelId)
		if (this.hasInitiativeTrackingNotStartedFor(guildId, channelId)) {
			throw new Error('Initiative rolling for the channel has not been started')
		}

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
	addDiceRoll(roll: DiceRolledInfo) {
		const key = this.buildCacheKey(roll.guildId, roll.channelId)
		if (this.hasInitiativeTrackingNotStartedFor(roll.guildId, roll.channelId)) {
			throw new Error('Initiative tracking has not started in this channel')
		}

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
	hasInitiativeTrackingStartedFor(guildId: string, channelId: string): boolean {
		const key = this.buildCacheKey(guildId, channelId)
		return InitiativeCache._initiativeCache.has(key)
	}

	/**
	 * Checks if the guild and channel have not started initiative tracking
	 * @param guildId
	 * @param channelId
	 * @returns
	 */
	hasInitiativeTrackingNotStartedFor(guildId: string, channelId: string): boolean {
		return !this.hasInitiativeTrackingStartedFor(guildId, channelId)
	}

	isInitiativeActive(guildId: string, channelId: string): boolean {
		const key = this.buildCacheKey(guildId, channelId)
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
	getRolls(guildId: string, channelId: string): DiceRolledInfo[] {
		const key = this.buildCacheKey(guildId, channelId)
		if (this.hasInitiativeTrackingNotStartedFor(guildId, channelId)) {
			throw new Error('Channel has not started to roll initiative')
		}

		this.cleanCache()
		const cacheEntry = InitiativeCache._initiativeCache.get(key)!

		return cacheEntry.diceRolls
	}

	private buildCacheKey(guildId: string, channelId: string): CacheKey {
		return `${guildId}|${channelId}`
	}

	/**
	 * Removes expired cache entries
	 */
	private cleanCache() {
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
}
