const Music = require('./Music')
const BruhBot = require("./BruhBot")
const fetch = require('node-fetch')

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
		if (msg.content === '!corpse_found') {
			let users = []
			msg.guild.members.cache.each(u => {
				if (u.displayName !== 'BruhBot') users.push(u.id)
			})
			const randUser = users[Math.floor(Math.random() * users.length)]
			msg.channel.send(`<@${randUser}> is kinda sus.`)
		}
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

	static bruh(msg) {
		const val = Math.floor(Math.random() * 100)
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
		const song = {
			title: 'Alex Jones Will Eat Your Leftist Ass (remix) | Song A Day #4145',
			url: 'https://www.youtube.com/watch?v=o5EKuIus-oE'
		}

		Music.play(msg, song)
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
				const val = Math.floor(Math.random() * 100)
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
	 * Gives list of message commands
	 * @param msg
	 * @param messageMap
	 */
	static help(msg, messageMap) {
		let help = 'Commands:\n'
		const iter = messageMap[Symbol.iterator]()

		for (const item of iter) {
			help += `\`${item[0]}\`: ${item[1].desc}\n`
		}

		msg.channel.send(`${help}`)
	}
}

module.exports = ChatMessages