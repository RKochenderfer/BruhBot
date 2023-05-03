import { REST, Routes } from 'discord.js'

const commands: any[] = []
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN!)

async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands`)

		const data: any = await rest.put(
			Routes.applicationCommands(process.env.CLIENT_ID!),
			{ body: commands },
		)

		console.log(`Successfully reloaded ${data.length} application (/) commands`)
	} catch (error) {
		console.error(error)
	}
}
