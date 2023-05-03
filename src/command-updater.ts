import * as fs from 'fs'
import * as path from 'path'
import BotClient from './models/bot-client'
import { Logger } from '.'
import { Guild, Message, REST, Routes } from 'discord.js'
import * as utils from './utils/utils'

/**
 * Reads the files in commands and builds the commands
 * @param client The bot client instance
 */
export const getCommands = (client: BotClient) => {
	const commandsPath = path.join(__dirname, 'commands')
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))

	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file)
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const command = require(filePath)

		if ('data' in command && 'execute' in command) {
			client.commands?.set(command.data.name, command)
		} else {
			Logger.logWarn(
				`The command at ${filePath} is missing a required "data" or "execute" property.`,
			)
		}
	}
}

/**
 * Updates the / commands for a server
 * @param message The sent message
 */
export const updateCommands = async (message: Message) => {
	console.log('Updating commands')
	await Logger.logInfo(
		`Updating commands for guild: ${message.guildId} at ${utils.getTimestamp()}`,
	)
	const commands: any[] = []
	const rest = new REST({ version: '10' }).setToken(process.env.TOKEN!)

	try {
		const commandsPath = path.join(__dirname, 'commands')
		const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))

		for (const file of commandFiles) {
			// eslint-disable-next-line @typescript-eslint/no-var-requires
			const command = require(`./commands/${file}`)
			commands.push(command.data.toJSON())
		}

		await Logger.logInfo(`Started refreshing ${commands.length} application (/) commands`)

		if (!message.guildId) return

		const data: any = await rest.put(
			Routes.applicationGuildCommands(process.env.CLIENT_ID!, message.guildId),
			{ body: commands },
		)

		// delete commands
		await rest.delete(
			Routes.applicationGuildCommand(
				process.env.CLIENT_ID!,
				message.guildId,
				'1034827085463695435',
			),
		)

		await rest.delete(
			Routes.applicationGuildCommand(
				process.env.CLIENT_ID!,
				message.guildId,
				'1034548001332527104',
			),
		)

		await rest.delete(
			Routes.applicationGuildCommand(
				process.env.CLIENT_ID!,
				message.guildId,
				'1034548028557762612',
			),
		)

		await Logger.logInfo(`Successfully reloaded ${data.length} application (/) commands`)
	} catch (error) {
		await Logger.logError(error)
	}
}
