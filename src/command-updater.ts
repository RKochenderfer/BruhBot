import * as fs from 'fs'
import * as path from 'path'
import BotClient from './models/bot-client'
import { Message, REST, Routes } from 'discord.js'
import { logger } from './log/logger'
import CommandRegister from './command-register'

/**
 * Reads the files in commands and builds the commands
 * @param client The bot client instance
 */
export const getCommands = (client: BotClient, commandRegister: CommandRegister) => {
	const commandsPath = path.join(__dirname, 'commands')
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))

	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file)
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const command = require(filePath)

		if ('data' in command && 'execute' in command) {
			client.commands?.set(command.data.name, command)
		} else {
			logger.warn(
				`The command at ${filePath} is missing a required "data" or "execute" property.`,
			)
		}
	}

	for (const command of commandRegister.generateCommandDetails()) {
		client.commands?.set(command.name, command)
	}
	logger.info(client.commands)
}

/**
 * Updates the / commands for a server
 * @param message The sent message
 */
export const updateCommands = async (message: Message, commandRegister: CommandRegister) => {
	logger.info(`Updating commands for guild: ${message.guildId}`)
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const commands: any[] = []
	const rest = new REST({ version: '10' }).setToken(process.env.TOKEN!)

	try {
		const commandsPath = path.join(__dirname, 'commands')
		const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))

		for (const file of commandFiles) {
			// eslint-disable-next-line @typescript-eslint/no-var-requires
			const command = require(`./commands/${file}`)
			if (file.includes('edit')) {
				continue
			}
			commands.push(command.data.toJSON())
			logger.debug(command.data.toJSON())
		}

		for (let commandJSON of commandRegister.generateCommandDataJSON()) {
			commands.push(commandJSON)
			logger.debug(commandJSON)
		}
		logger.info(`Started refreshing ${commands.length} application (/) commands`)

		if (!message.guildId) return

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const data: any = await rest.put(
			Routes.applicationGuildCommands(process.env.CLIENT_ID!, message.guildId),
			{ body: commands },
		)
		logger.info(`Successfully reloaded ${data.length} application (/) commands`)
	} catch (error) {
		message.reply({ content: 'Failed to update commands' })
		logger.error(error)
	}
}
