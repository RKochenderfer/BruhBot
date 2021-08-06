import 'dotenv/config'
import { Client, Intents, Message } from 'discord.js'
import { MessageMap } from './classes/MessageMap'
import { Command } from './models/Command'

const messageMap = new MessageMap()

const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
})

// Add listeners
client.once('ready', () => {
	console.log(`Logged in as ${client.user?.tag}`)
})

client.on('guildMemberAdd', member => {
	const channel = member.guild.channels.cache.find(
		ch => ch.name === 'general',
	)
	if (!channel) return
	// Send message
})

client.on('messageCreate', async message => {
	if (message.content.toLowerCase() === '!deploy') {
		const data = Command.buildCommandDataMap()
		const command = await client.guilds.cache
			.get(message.guildId!)
			?.commands.set(data)
		console.log(command)
	}
})

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return
	try {
		const commandType = Command.commandMap(interaction.commandName)
		if (commandType) {
			const command = messageMap.getCommand(commandType)
            command.execute(interaction)
		}
	} catch (error) {}
})

client.login(process.env.TOKEN!).then(async () => {
	// Update commands when launching
	// const data = Command.buildCommandDataMap()
	// const commands = await client.guilds.cache.get('123456789012345678')?.commands.
	// await client.application?.commands.set(data)
})
