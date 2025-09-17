import { CacheKey, InitiativeCache } from '../caches/initiativeCache'
import { InitiativeError } from '../errors/initiativeError'
import { InitiativeEnded } from '../events/initiativeEnded'
import { InitiativeStarted } from '../events/initiativeStarted'
import { DiceRolledInfo } from '../models/diceRolledInfo'

class ChannelKey {
	private constructor(private readonly _guildId: string, private readonly _channelId: string) {}

	static from(guildId: string, channelId: string): ChannelKey {
		if (!guildId) {
			throw new Error('Guild Id cannot be empty')
		}
		if (!channelId) {
			throw new Error('Channel Id cannot be empty')
		}

		return new ChannelKey(guildId, channelId)
	}

	static fromInitiativeStarted(initiativeStarted: InitiativeStarted): ChannelKey {
		return this.from(initiativeStarted.guildId, initiativeStarted.channelId)
	}

	static fromInitiativeEnded(initiativeEnded: InitiativeEnded): ChannelKey {
		return this.from(initiativeEnded.guildId, initiativeEnded.channelId)
	}

	static fromDiceRolledInfo(diceRolledInfo: DiceRolledInfo): ChannelKey {
		return this.from(diceRolledInfo.guildId, diceRolledInfo.channelId)
	}

	get key(): CacheKey {
		return `${this._guildId}|${this._channelId}`
	}
}

export class InitiativeService {
	constructor(private readonly _initiativeCache: InitiativeCache) {}

	/**
	 * Ends the channels initiative and returns the final collected results
	 * @param initiativeEnded the initiative ended event
	 * @returns
	 */
	endInitiative(initiativeEnded: InitiativeEnded): DiceRolledInfo[] {
		const channelKey = ChannelKey.fromInitiativeEnded(initiativeEnded)
		this.guardAgainstInitiativeNotStarted(channelKey)

		this._initiativeCache.endInitiative(channelKey.key)

		return this.getOrderedRollsDesc(initiativeEnded.guildId, initiativeEnded.channelId)
	}

	/**
	 * Starts the channels initiative
	 * @param initiativeStarted the initiative started event
	 */
	startInitiative(initiativeStarted: InitiativeStarted) {
		const channelKey = ChannelKey.fromInitiativeStarted(initiativeStarted)
		this.guardAgainstInitiativeAlreadyStarted(channelKey)

		this._initiativeCache.startInitiative(channelKey.key)
	}

	/**
	 * Checks if the roll is part of a channel building an initiative order
	 * @param diceRolled
	 * @returns true if a call has already been done to start taking initiative, false otherwise
	 */
	hasInitiativeStarted(diceRolled: DiceRolledInfo): boolean {
		const channelKey = ChannelKey.fromDiceRolledInfo(diceRolled)
		return this._initiativeCache.hasInitiativeTrackingStartedFor(channelKey.key)
	}

	/**
	 * Checks to see if initiative rolls are still being collected on the channel
	 * @param diceRolled the dice rolled
	 * @returns true if rolls are still being collected false otherwise
	 */
	isInitiativeStillBeingCollected(diceRolled: DiceRolledInfo): boolean {
		const channelKey = ChannelKey.fromDiceRolledInfo(diceRolled)

		if (!this.hasInitiativeStarted(diceRolled)) {
			return false
		}

		return this._initiativeCache.isInitiativeActive(channelKey.key)
	}

	/**
	 * Tracks a new dice roll. If there is no active initiative on the channel
	 * a InitiativeError is thrown
	 * @param diceRolledInfo
	 */
	addDiceRoll(diceRolledInfo: DiceRolledInfo) {
		const channelKey = ChannelKey.fromDiceRolledInfo(diceRolledInfo)
		this.guardAgainstInitiativeNotStarted(channelKey)
		this.guardAgainstInitiativeNotBeingCollectedAnyMore(channelKey)

		this._initiativeCache.addDiceRoll(channelKey.key, diceRolledInfo)
	}

	/**
	 * Removes the roll from the initiative with the provided name
	 * @param guildId the guild the roll occurred in
	 * @param channelId the channel the roll occurred in
	 * @param nameToRemove the name of the entry that is to be removed
	 * @returns `true` if a field was removed, `false` otherwise
	 */
	removeFromInitiative(guildId: string, channelId: string, nameToRemove: string): boolean {
		const channelKey = ChannelKey.from(guildId, channelId)
		this.guardAgainstInitiativeNotStarted(channelKey)

		return this._initiativeCache.removeFor(channelKey.key, nameToRemove)
	}

	/**
	 * Gets the initiative rolls ordered descending with highest at the top
	 * @param guildId the guild the initiative was rolled in
	 * @param channelId the channel the initiative was rolled in
	 */
	getOrderedRollsDesc(guildId: string, channelId: string): DiceRolledInfo[] {
		const channelKey = ChannelKey.from(guildId, channelId)
		this.guardAgainstInitiativeNotStarted(channelKey)

		const rolls = this._initiativeCache.getRolls(channelKey.key)
		return this.sortRollsDescending(rolls)
	}

	/**
	 * Sorts the rolls in descending order
	 * @param rolls
	 */
	private sortRollsDescending(rolls: DiceRolledInfo[]): DiceRolledInfo[] {
		// TODO: Modify algorithm to handle ties where higher modifier wins
		return [...rolls].sort((a, b) => this.sortRolls(b, a))
	}

	private sortRolls(b: DiceRolledInfo, a: DiceRolledInfo): number {
		if (b.roll.total === a.roll.total) {
			return b.roll.evaluatedModifierString - a.roll.evaluatedModifierString
		}
		return b.roll.total - a.roll.total
	}

	private guardAgainstInitiativeNotBeingCollectedAnyMore(channelKey: ChannelKey) {
		if (!this._initiativeCache.isInitiativeActive(channelKey.key)) {
			throw new InitiativeError('Initiative is no longer being gathered for this channel')
		}
	}

	private guardAgainstInitiativeNotStarted(channelKey: ChannelKey) {
		if (this._initiativeCache.hasInitiativeTrackingNotStartedFor(channelKey.key)) {
			throw new InitiativeError('Initiative has not started for this channel')
		}
	}

	private guardAgainstInitiativeAlreadyStarted(channelKey: ChannelKey) {
		if (this._initiativeCache.hasInitiativeTrackingStartedFor(channelKey.key)) {
			throw new InitiativeError('Initiative has not started for this channel')
		}
	}
}
