const Music = require('./Music')
const BruhBot = require("./BruhBot");

/**
 * Class managing functionality for chat messages
 */
class ChatMessages {
	static #bruhCount = 0
	static #hugCount = 0
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
		this.#bruhCount++
		if (this.#bruhCount === 5) {
			this.#bruhCount = 0
			msg.reply("I'M GOING TO KILL YOU LATER TONIGHT. WATCH YOUR BACK HUMAN.")
		} else {
			msg.reply('bruh')
		}
	}

	/**
	 * Gives a hug to the mentioned user
	 * @param msg
	 */
	static hug(msg) {
		if (msg.mentions.users.size && this.#hugCount !== 10) {
			this.#hugCount++
			const words = ['super ', 'big ', 'little ', 'bro ', 'side ', 'hand ', '']
			let randWord = words[Math.floor(Math.random() * words.length)]
			const targetMember = msg.mentions.members.first()

			msg.channel.send(`${targetMember} gets a ${randWord}hug`)
		} else if (this.#hugCount === 10) {
			msg.channel.send('No')
			this.#hugCount = 0
		}
	}

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