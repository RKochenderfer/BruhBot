import 'dotenv/config'
import {
	Client,
	Intents,
	ApplicationCommandManager,
	GuildStickerManager,
} from 'discord.js'
import { MessageMap } from './classes/MessageMap'
import { Command } from './models/Command'
import { MessageChecker } from './classes/MessageChecker'

const messageMap = new MessageMap()
const messageChecker = new MessageChecker()

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
	if (message.author.bot) {
		return
	} else if (message.content.toLowerCase() === '!deploy') {
		const data = Command.buildCommandDataMap()
		const command = await client.guilds.cache
			.get(message.guildId!)
			?.commands.set(data)
	} else {
		await MessageChecker.CheckMessage(message)
	}
})

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return
	// client.application?.commands.delete(interaction.commandId)
	// interaction.guild?.commands.delete(interaction.commandId)
	// 	.then(console.log)
	// 	.catch(console.error)
	const commandType = Command.commandMap(interaction.commandName)
	if (commandType) {
		const command = messageMap.getCommand(commandType)
		await command.execute(interaction)
	}
})

client.login(process.env.TOKEN!).then(async () => {
	// Update commands when launching
	// const data = Command.buildCommandDataMap()
	// const commands = await client.guilds.cache.get('123456789012345678')?.commands.
	// await client.application?.commands.set(data)
})

client.on('error', error => {
	console.error('A')
	console.error(error)
})
