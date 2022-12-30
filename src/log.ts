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
 * Handles the logging for the application
 */
export class Logger {
	logInfo(message: string) {
		insertLog({
			level: LogLevel.INFO,
			message: message,
		})
	}

	logWarn(message: string) {
		insertLog({
			level: LogLevel.WARN,
			message: message,
		})
	}

	logError(log: InteractionLog) {
		insertLog({
			level: LogLevel.ERROR,
			interactionLog: log,
		})
	}

	logDebug(message: string) {
		insertLog({
			level: LogLevel.DEBUG,
			message: message,
		})
	}

	logInteraction(log: InteractionLog) {
		insertLog({
			level: LogLevel.INFO,
			interactionLog: log,
		})
	}
}
