import { REST, Routes } from 'discord.js'

if (!process.env.TOKEN) {
	throw new Error('Token not found in env.')
} else if (!process.env.CLIENT_ID) {
	throw new Error('Client ID not found in env.')
} else if (!process.env.GUILD_ID) {
	throw new Error('Client ID not found in env.')
}


const commands: any[] = []
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN)

async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands`)

		const data: any = await rest.put(
			Routes.applicationGuildCommands(process.env.CLIENT_ID!, process.env.GUILD_ID!),
			{ body: commands },
		)

		console.log(`Successfully reloaded ${data.length} application (/) commands`)
	} catch (error) {
		console.error(error)
	}
}
