enum LogLevel {
	INFO = 'INFO',
	WARN = 'WARN',
	ERROR = 'ERROR',
	DEBUG = 'DEBUG'
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

	logError(message: string) {
		console.log(`${LogLevel.ERROR} - ${message}`)
	}

	logDebug(message: string) {
		console.log(`${LogLevel.DEBUG} - ${message}`)
	}
}
