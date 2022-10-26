import {
	BaseInteraction,
	ChatInputCommandInteraction,
	Message,
} from 'discord.js'

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

export interface Log {
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
		console.log(`${LogLevel.INFO} - ${message}`)
	}

	logWarn(message: string) {
		console.log(`${LogLevel.WARN} - ${message}`)
	}

	logError(log: Log) {
		console.log(log)
	}

	logDebug(message: string) {
		console.log(`${LogLevel.DEBUG} - ${message}`)
	}

	logInteraction(log: Log) {
		console.log(log)
	}
}
