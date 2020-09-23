/**
 * Class managing functionality for chat messages
 */
class ChatMessages {
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
		msg.reply('bruh')
	}
}

module.exports = ChatMessages