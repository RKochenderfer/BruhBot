import BotClient from './models/bot-client'
import { logger } from './log/logger'
import CommandRegister from './commandRegister'

/**
 * Reads the files in commands and builds the commands
 * @param client The bot client instance
 */
export const getCommands = (client: BotClient, commandRegister: CommandRegister) => {
	for (const command of commandRegister.generateCommandDetails()) {
		client.commands?.set(command.name, command)
	}
	logger.info(client.commands)
}

