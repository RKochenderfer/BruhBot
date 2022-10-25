import { REST, Routes } from 'discord.js'
import { token, clientId, guildId } from '../config.json'

const commands: any[] = []
const rest = new REST({ version: '10' }).setToken(token)

async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands`)

		const data: any = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		)

		console.log(`Successfully reloaded ${data.length} application (/) commands`)
	} catch (error) {
		console.error(error)
	}
}
