import { ENV } from '.'
import { insertLog } from './db'

// eslint-disable-next-line no-shadow
export enum LogLevel {
	INFO = 'INFO',
	WARN = 'WARN',
	ERROR = 'ERROR',
	DEBUG = 'DEBUG',
}

export enum Type {
	INTERACTION = 'INTERACTION',
	MESSAGE = 'MESSAGE',
	BOT_MESSAGE = 'BOT_MESSAGE',
}

export interface UserInfo {
	id: string
	bot: boolean
	username: string
	discriminator: string
}

export interface DiscordInfo {
	channelId: string
	channelName: string
	guildId: string
	content?: string
	command?: string
	commandType?: string
	regex?: string
	author?: UserInfo
}

export interface InteractionLog {
	logLevel: LogLevel
	discordInfo: DiscordInfo
	executionTime: number
	type: Type
	message?: string
	botMessage?: string
	timestamp: string
	isError: boolean
	error?: Error
}

/**
 * Returns the current UTC timestamp
 * @returns
 */
const getCurrentTimestamp = () => {
	const date = new Date()

	return `${date.getUTCFullYear()}-${
		date.getUTCMonth() + 1
	}-${date.getUTCDate()}T${date.getUTCHours()}:${date.getUTCMinutes()}+${date.getUTCSeconds()}Z`
}

/**
 * Handles the logging for the application
 */
export class Logger {
	async logInfo(message: string) {
		if (ENV === 'Dev') {
			console.log({
				level: LogLevel.INFO,
				timestamp: getCurrentTimestamp(),
				message: message,
			})
			return
		}
		await insertLog({
			level: LogLevel.INFO,
			timestamp: getCurrentTimestamp(),
			message: message,
		})
	}

	async logWarn(message: string) {
		await insertLog({
			level: LogLevel.WARN,
			timestamp: getCurrentTimestamp(),
			message: message,
		})
	}

	async logError(log: InteractionLog) {
		await insertLog({
			level: LogLevel.ERROR,
			timestamp: getCurrentTimestamp(),
			interactionLog: log,
		})
	}

	async logException(err: Error) {
		await insertLog({
			level: LogLevel.ERROR,
			timestamp: getCurrentTimestamp(),
			message: JSON.stringify(err)
		})
	}

	logDebug(message: string) {
		if (ENV !== 'Dev') return
		console.log({
			level: LogLevel.DEBUG,
			timestamp: getCurrentTimestamp(),
			message: message,
		})
	}

	async logInteraction(log: InteractionLog, type: Type) {
		if (ENV === 'Dev') {
			console.log({
				level: LogLevel.INFO,
				timestamp: getCurrentTimestamp(),
				type: type,
				interactionLog: log,
			})
			return
		}
		await insertLog({
			level: LogLevel.INFO,
			timestamp: getCurrentTimestamp(),
			type: type,
			interactionLog: log,
		})
	}
}
