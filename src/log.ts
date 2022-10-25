/**
 * Handles the logging for the application
 */
export class Logger {
	/**
     * Log the application to the logging medium
     * @param level The level of the log
     * @param message The message to be logged
     */
	log = (level: string, message: string) => {
		console.log(`${level}: ${message}`)
	}
}