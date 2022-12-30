import { insertLog } from './db'

// eslint-disable-next-line no-shadow
export enum LogLevel {
	INFO = 'INFO',
	WARN = 'WARN',
	ERROR = 'ERROR',
	DEBUG = 'DEBUG',
}

export interface UserInfo {
	id: string
	bot: boolean
	username: string
	discriminator: string
}

export interface DiscordInfo {
	channelId: string
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
	message?: string
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
	logInfo(message: string) {
		insertLog({
			level: LogLevel.INFO,
			timestamp: getCurrentTimestamp(),
			message: message,
		})
	}

	logWarn(message: string) {
		insertLog({
			level: LogLevel.WARN,
			timestamp: getCurrentTimestamp(),
			message: message,
		})
	}

	logError(log: InteractionLog) {
		insertLog({
			level: LogLevel.ERROR,
			timestamp: getCurrentTimestamp(),
			interactionLog: log,
		})
	}

	logDebug(message: string) {
		insertLog({
			level: LogLevel.DEBUG,
			timestamp: getCurrentTimestamp(),
			message: message,
		})
	}

	logInteraction(log: InteractionLog) {
		insertLog({
			level: LogLevel.INFO,
			timestamp: getCurrentTimestamp(),
			interactionLog: log,
		})
	}
}
