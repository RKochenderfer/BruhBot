import FlaggedPattern from './flagged-pattern'
import * as db from '../db'
import FlaggedMessage from '../models/flagged-message'
import { GuildInviteManager, Message } from 'discord.js'
import { getTimestamp } from '../utils/utils'
import { logger } from '../utils/logger'
/**
 * Takes flagged messages and creates the RegExp on adding
 */
export class CachedPattern {
	public regex: RegExp
	public flaggedPattern: FlaggedPattern

	constructor(flaggedPattern: FlaggedPattern) {
		this.flaggedPattern = flaggedPattern
		if (flaggedPattern.hasFlags) {
			this.regex = new RegExp(flaggedPattern.expression, flaggedPattern.flags!)
		} else {
			this.regex = new RegExp(flaggedPattern.expression)
		}
	}

	getFlaggedPattern() {}
}

export class CachedServerPatterns {
	constructor(public patterns: CachedPattern[], public updatedLast = new Date()) {}
}

/**
 * The Message Checker system. It is meant to only be initialized once at server startup
 */
export class MessageChecker {
	/**
	 * A map of the guildId to the regular expressions the server has
	 */
	private static cache: Map<string, CachedServerPatterns> = new Map()

	constructor() {}

	/**
	 * Adds a pattern to the cache
	 * @param guildId - The id for the guild that is adding the pattern
	 * @param toAdd  - the pattern to add
	 */
	addPatternToCache = (guildId: string, toAdd: FlaggedPattern) => {
		logger.debug(toAdd, `Adding pattern to guild: ${guildId} to cache`)
		if (MessageChecker.cache.has(guildId)) {
			const current = MessageChecker.cache.get(guildId)!
			current.patterns = [...current.patterns, new CachedPattern(toAdd)]
		} else {
			MessageChecker.cache.set(guildId, new CachedServerPatterns([new CachedPattern(toAdd)]))
		}
	}

	/**
	 *
	 * @param guildId - The guild id for the guild the authors interaction was sent in
	 * @param toRemove - The key of the pattern that is to be removed
	 */
	removePattern = (guildId: string, toRemove: string) => {
		logger.debug(`Removing pattern key: ${toRemove} with guildId: ${guildId}`)
		if (MessageChecker.cache.has(guildId)) {
			const cached = MessageChecker.cache.get(guildId)!
			cached.patterns = cached.patterns.filter(val => val.flaggedPattern.key === toRemove)
		}
	}

	/**
	 * Checks to see if a given message matches a pattern for the guild it was sent in
	 * @param guildId - The guild ID the message was sent in
	 * @param message - The content of the message
	 * @returns true if found, false otherwise
	 */
	getFlagged = async (guildId: string, message: Message) => {
		try {
			if (!MessageChecker.cache.has(guildId)) {
				await this.pullFromDb(guildId) // Refresh cache on miss
				if (!MessageChecker.cache.has(guildId)) return null
			}

			const cached = MessageChecker.cache.get(guildId)!
			for (const pattern of cached.patterns) {
				if (pattern.regex.test(message.content)) {
					pattern.flaggedPattern.messageHistory.count++
					pattern.flaggedPattern.messageHistory.lastAuthorId = message.author.id
					pattern.flaggedPattern.messageHistory.lastAuthorUsername =
						message.author.username
					pattern.flaggedPattern.messageHistory.prevLastFound =
						pattern.flaggedPattern.messageHistory.lastFound
					pattern.flaggedPattern.messageHistory.lastFound = new Date()

					this.updateDb(guildId, pattern.flaggedPattern)
					return pattern
				}
			}
		} catch (error) {
			console.error(error)
		}
		return null
	}

	/**
	 * Replaces the symbols with their replacements as specified in the README
	 * @param pattern - The regex pattern that was found
	 * @returns - A string with the symbols replaced
	 */
	buildResponse = (pattern: CachedPattern) => {
		const date = pattern.flaggedPattern.messageHistory.lastFound
		const lastFound = pattern.flaggedPattern.messageHistory.prevLastFound
		const timespan = (date as unknown as number) - (lastFound as unknown as number)

		return pattern.flaggedPattern.response
			.replace('$k', pattern.flaggedPattern.key)
			.replace('$c', `${pattern.flaggedPattern.messageHistory.count}`)
			.replace(
				'$d',
				`${lastFound.getMonth() + 1}/${lastFound.getDate()}/${lastFound.getFullYear()}`,
			)
			.replace(
				'$t',
				`${
					lastFound.getMonth() + 1
				}/${lastFound.getDate()}${lastFound.getFullYear()} ${lastFound.getHours()}:${lastFound.getMinutes()}:${lastFound.getSeconds()}`,
			)
			.replace('$s', `${timespan / 1000}`)
			.replace('$h', `${timespan / (1000 * 60 * 60)}`)
	}

	private updateDb = async (guildId: string, pattern: FlaggedPattern) => {
		try {
			await db.collections.servers?.updateOne(
				{ guildId: guildId, 'flaggedPatterns.key': pattern.key },
				{ $set: { 'flaggedPatterns.$': pattern } },
			)
			logger.debug(`Updated pattern key: ${pattern.key} for guild: ${guildId}`)
		} catch (error) {
			logger.error(error)
		}
	}

	private pullFromDb = async (guildId: string) => {
		const query = { guildId: guildId }
		const patterns = await db.collections?.servers?.findOne(query)

		if (!patterns?.flaggedPatterns) return

		const toAdd = patterns.flaggedPatterns.map(val => new CachedPattern(val))

		MessageChecker.cache.set(guildId, new CachedServerPatterns(toAdd))
	}
}
