const fs = require('fs')
const Music = require('./Music')
const BruhBot = require('./BruhBot')
const DiceRoller = require('./DiceRoller')
const RoundTracker = require('./RoundTracker')
const fetch = require('node-fetch')
const killMessages = require('../killMessages.json')

/**
 * Class managing functionality for chat messages
 */
class ChatMessages {
	static #refuseHug = 10
	static #threaten = 10
	static #niceComment = 10

	/**
	 * Randomly capitalizes letters in a string
	 * @param str
	 * @returns {string}
	 */
	static #randomCapitalize(str) {
		// Randomly capitalize letters
		const randNumCapital = Math.floor(Math.random() * str.length)
		let indexesToCapital = []
		for (let i = 0; i < randNumCapital; i++) {
			const num = Math.floor(Math.random() * str.length)
			if (!indexesToCapital.includes(num)) indexesToCapital.push(num)
		}
		let s = []
		for (let i = 0; i < str.length; i++) {
			if (indexesToCapital.includes(i)) {
				s.push(str.charAt(i).toUpperCase())
			} else {
				s.push(str.charAt(i))
			}
		}

		return s.join('')
	}

	/**
	 * Randomly chooses a user to be sus
	 * @param msg
	 */
	static corpseFound(msg) {
		let users = []
		msg.guild.members.cache.each(u => {
			if (u.displayName !== 'BruhBot') users.push(u.id)
		})
		const randUser = users[Math.floor(Math.random() * users.length)]
		msg.channel.send(`<@${randUser}> is kinda sus.`)

	}

	/**
	 * Replies to msg with yee with random e's and capitals
	 * @param msg
	 */
	static yee(msg) {
		let yee = 'yee'

		// Add random number of es
		let numEs = Math.floor(Math.random() * 25)
		for (let i = 0; i < numEs; i++) {
			yee += 'e'
		}

		msg.reply(`${this.#randomCapitalize(yee)}`)
	}

	/**
	 * Replies to the user with bruh
	 * @param msg
	 */
	static bruh(msg) {
		const val = Math.random() * 100
		if (val > this.#threaten) {
			msg.reply('bruh')
		} else {
			msg.reply("I'M GOING TO KILL YOU LATER TONIGHT. WATCH YOUR BACK HUMAN.")
		}
	}

	/**
	 * Gives a hug to the mentioned user
	 * @param msg
	 */
	static hug(msg) {
		const val = Math.floor(Math.random() * 100)
		if (val > this.#refuseHug) {
			const words = ['super ', 'big ', 'little ', 'bro ', 'side ', 'hand ', '']
			let randWord = words[Math.floor(Math.random() * words.length)]
			const targetMember = msg.mentions.members.first()

			msg.channel.send(`${targetMember} gets a ${randWord}hug`)
		} else {
			msg.channel.send('No')
		}
	}

	/**
	 * Plays leftist_ass.mp3 clip
	 * @param msg
	 */
	static leftistAss(msg) {
		Music.play_file(msg, process.env.LEFTIST_ASS_PATH)
	}

	static play(msg) {
		const commands = msg.content.split(' ')
		if (commands.length > 1) {
			Music.play_url(msg, commands[1])
		}
	}

	/**
	 * Follows the first command given after !bruhbot
	 * @param msg
	 */
	static bruhBot(msg) {
		BruhBot.botCommand(msg)
	}

	/**
	 * Insults a mentioned user
	 * @param msg
	 * @returns {Promise<void>}
	 */
	static async insult(msg) {
		if (msg.mentions.users.size) {
			try {
				const targetMember = msg.mentions.members.first()
				const val = Math.random() * 100
				if (val > this.#niceComment) {
					const res = await fetch('https://insult.mattbas.org/api/insult')
					msg.channel.send(`${targetMember} ${await res.text()}`)
				} else {
					msg.channel.send(`No, ${targetMember} is too nice and I don't want to.`)
				}
			} catch (e) {
				console.error(e)
			}
		}
	}

	/**
	 * Kills self or kill user depending on if they mention a user or not
	 * @param msg
	 */
	static kill(msg) {
		const user = msg.author
		if (msg.mentions.users.size) {
			const target = msg.mentions.members.first()
			const index = Math.floor(Math.random() * killMessages["killed-by"].length)
			let death = killMessages['killed-by'][index]
			death = death.replace('?', `${user}`)
			msg.channel.send(`${target} ${death}`)
		} else {
			const index = Math.floor(Math.random() * killMessages["kill-self"].length)
			msg.channel.send(`${user} ${killMessages['kill-self'][index]}`)
		}
	}

	/**
	 * Manages a user's socks
	 * @param msg
	 */
	static socks(msg) {
		const status = msg.content.split(' ')[1]
		let raw = fs.readFileSync(process.env.SOCKS_PATH)
		let socks = JSON.parse(raw)
		switch (status) {
			case 'off':
				if (socks['no-socks'].includes(msg.author.id)) {
					msg.channel.send('Your socks are already off ;).')
				} else {
					socks['no-socks'].push(msg.author.id)
					msg.channel.send(`${msg.author}'s socks have been removed ;).`)
				}
				fs.writeFileSync(process.env.SOCKS_PATH, JSON.stringify(socks))
				break
			case 'on':
				if (socks['no-socks'].includes(msg.author.id)) {
					msg.channel.send('Your socks are back on.')
					const index = socks['no-socks'].indexOf(msg.author.id)
					socks['no-socks'].splice(index, 1)
					fs.writeFileSync(process.env.SOCKS_PATH, JSON.stringify(socks))
				} else {
					msg.channel.send(`Your socks are still on.`)
				}
				break
			case 'status':
				const users = socks['no-socks'].map(ns => global.client.users.cache.get(ns))

				let str = ''
				if (users.length > 1) {
					for (let i = 0; i < users.length; i++) {
						if (i === users.length - 1) {
							str += `${users[i].nickname} `
						} else {
							str += `${users[i].nickname}, `
						}
					}
					str += 'are not wearing socks ;).'
				} else if (users.length === 1) {
					str += `${users[0].nickname} is not wearing socks. Quite the brave one ;)`
				} else {
					str = 'Everyone is wearing socks :(.'
				}

				msg.channel.send(`${str}`)
				break
			default:
				msg.channel.send('You must state that your socks are on or off or ask for the status.')
		}
	}

	/**
	 * Gets a kanye quote
	 * @param msg
	 */
	static async ye(msg) {
		try {
			const res = await fetch('https://api.kanye.rest')
			const json = await res.json()
			msg.channel.send(`Kanye West says, "${await json.quote}"`)
		} catch (e) {
			console.error(e)
		}
	}

	/**
	 * Rolls a dice with the passed count and type
	 * @param msg
	 */
	static roll(msg) {
		const args = msg.content.split(' ')
		if (args.length === 3) {
			if (!isNaN(args[1])) {
				const values = DiceRoller.roll(msg, args[1], args[2])
				if (values !== null) {
					let diceTense = ''
					if (args[1] > 1) {
						diceTense = `${args[2]}'s were`
					} else {
						diceTense = `${args[2]} was`
					}
					msg.reply(`${args[1]} ${diceTense} rolled. Values [${values.join(', ')}]`)
				} else {
					msg.channel.send(`Invalid dice with count ${args[1]} and type ${args[2]} received.`)
				}
			} else {
				msg.channel.send(`${args[1]} is not an integer.`)
			}
		}
	}

	/**
	 * Passes round tracker interaction to RoundTracker
	 * @param msg
	 */
	static initiativeTracker(msg) {
		RoundTracker.initiativeTracker(msg)
	}

	/**
	 * Gives list of message commands
	 * @param msg
	 * @param messageMap
	 */
	static help(msg, messageMap) {
		let help = '> Commands:\n'
		const iter = messageMap[Symbol.iterator]()

		for (const item of iter) {
			help += `> \`${item[0]}\`: ${item[1].desc}\n`
		}

		msg.channel.send(`${help}`)
	}
}

module.exports = ChatMessages