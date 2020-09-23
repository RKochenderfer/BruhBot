'use strict'

require('dotenv').config()
const Discord = require('discord.js')
const client = new Discord.Client()
const ChatMessages = require('./modules/ChatMessages')

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

// Handles when a user says !corpse_found
client.on('message', msg => {
	switch (msg.content) {
		case '!corpse_found':
			ChatMessages.corpseFound(msg)
			break
		case '!bruh':
			ChatMessages.bruh(msg)
			break
		case '!yee':
			ChatMessages.yee(msg)
			break
		default:
			if (msg.content.includes('!hug')) {
				ChatMessages.hug(msg)
			}
	}
})

client.login(process.env.TOKEN)