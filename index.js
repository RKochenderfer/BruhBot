'use strict'

require('dotenv').config()
const Discord = require('discord.js')
const client = new Discord.Client()

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`)
})

client.on('guildMemberAdd', member => {
	// Send the message to a designated channel on a server:
	const channel = member.guild.channels.cache.find(ch => ch.name === 'general');
	// Do nothing if the channel wasn't found on this server
	if (!channel) return;
	// Send the message, mentioning the member
	channel.send(`Welcome to the server, ${member}`);
});

client.on('message', msg => {
	if (msg.content === '!corpse_found') {
		const list = msg.guild.members

		console.log(list)
	}
})

// When user says the message "!ping"
client.on('message', msg => {
	if (msg.content === '!ping') {
		msg.reply('Pong!')
	}
})

client.login(process.env.TOKEN)