'use strict'

require('dotenv').config()
const Discord = require('discord.js')
const client = new Discord.Client()
const ChatMessages = require('./modules/ChatMessages')

const messageMap = new Map([
	[
		'!bruh',
		{
			'desc': 'Replies to sender with bruh',
			func: msg => ChatMessages.bruh(msg)
		}
	],
	[
		'!corpse_found',
		{
			'desc': 'Randomly chooses a user to be "sus"',
			func: msg => ChatMessages.corpseFound(msg)
		}
	],
	[
		'!yee',
		{
			'desc': 'Replies to a user with a random length and capitalized "yee"',
			func: msg => ChatMessages.yee(msg)
		}
	],
	[
		'!hug',
		{
			'desc': 'Sends a hug to a mentioned user',
			func: msg => ChatMessages.hug(msg)
		}
	],
	[
		'!leftist_ass',
		{
			'desc': 'Plays a clip of I will eat you Leftist ass in the same voice channel as the user that summoned it',
			func: msg => ChatMessages.leftistAss(msg)
		}
	],
	[
		'!bruhbot',
		{
			'desc': 'Issues a command directly to bruhbot',
			func: msg => ChatMessages.bruhBot(msg)
		}
	],
	[
		'!help',
		{
			'desc': 'Shows possible top level commands for bruhbot',
			func: (msg, messageMap) => ChatMessages.help(msg, messageMap)
		}
	]
])

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

let i = 0
// Handles when a user says !corpse_found
client.on('message', msg => {
	const prefix = msg.content.split(' ')[0]
	if (messageMap.has(prefix)) {
		let selected = messageMap.get(prefix)
		if (prefix === '!help') {
			selected.func(msg, messageMap)
		} else {
			selected.func(msg)
		}
	}
})

client.login(process.env.TOKEN)