import { DiceRolledInfo } from '../models/diceRolledInfo'

type CacheKey = string

/**
 * The cache for tracking initiative in a channel
 */
export class InitiativeCache {
	private static instance?: InitiativeCache
	private static readonly _initiativeCache: Map<CacheKey, DiceRolledInfo[]> = new Map()
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

		InitiativeCache._initiativeCache.set(key, [])
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

		const rolls = InitiativeCache._initiativeCache.get(key) ?? []
		InitiativeCache._initiativeCache.delete(key)

		return rolls
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

		let cachedRolls = InitiativeCache._initiativeCache.get(key)!
		// if the user has already rolled, replace the roll with the latest one
		if (this.hasUserAlreadyRolled(key, roll.userId)) {
			const newCacheEntry = cachedRolls.filter(x => x.userId !== roll.userId)
			cachedRolls = [...newCacheEntry, roll]
		} else {
			cachedRolls = [...cachedRolls, roll]
		}

		InitiativeCache._initiativeCache.set(key, cachedRolls)
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

	hasInitiativeTrackingNotStartedFor(guildId: string, channelId: string): boolean {
		return !this.hasInitiativeTrackingStartedFor(guildId, channelId)
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

		return InitiativeCache._initiativeCache.get(key) ?? []
	}

	/**
	 * Checks to see if a user's roll is already present in the cache entry
	 * @param cacheKey the cache entry key
	 * @param userId the user who performed the roll
	 * @returns
	 */
	private hasUserAlreadyRolled(cacheKey: CacheKey, userId: string): boolean {
		const cachedRolls = InitiativeCache._initiativeCache.get(cacheKey)
		if (cachedRolls == undefined) {
			throw new Error('Cache entry should not be undefined')
		}

		if (!cachedRolls.find(x => x.userId === userId)) {
			return false
		}
		return true
	}

	private buildCacheKey(guildId: string, channelId: string): CacheKey {
		return `${guildId}|${channelId}`
	}
}
