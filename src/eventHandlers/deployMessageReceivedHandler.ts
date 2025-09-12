import { Message } from 'discord.js'
import { Handler } from '.'
import { Logger } from 'pino'
import { Notification } from '../events'
import { CommandUpdaterService } from '../services/commandUpdaterService'

/**
 * Handles a message event to deploy commands
 */
export class DeployMessageReceivedHandler implements Handler {
	constructor(private commandUpdaterService: CommandUpdaterService) {}

	handle = async (logger: Logger, data: Notification<Message>): Promise<void> => {
		logger.debug('Started to handle deploy message')
		await data.data.react('👍'), await this.commandUpdaterService.updateCommands(data.data)
		await data.data.reply('Commands updated')
		logger.debug('Completed handling deploy message')
	}
}
