const Music = require("./Music");

class BruhBot {
	static #bruhBotMap = new Map([
		[
			'stfu',
			{
				'desc': 'Forcibly disconnects bruhbot from the voice channel a user is in',
				func: msg => this.#stfu(msg)
			}
		],
		[
			'help',
			{
				'desc': 'Lists commands and description for bruhbot',
				func: msg => this.#help(msg)
			}
		]
	])

	/**
	 * Forces the bot to leave the voice channel the user is in
	 * @param msg
	 */
	static #stfu(msg) {
		Music.stop(msg)
			.catch(err => console.error(err))
	}

	/**
	 * Displays all the possible commands for bruhbot
	 * @param msg
	 */
	static #help(msg) {
		let help = 'Commands:\n'
		const iter = this.#bruhBotMap[Symbol.iterator]()

		for (const item of iter) {
			help += `> \`${item[0]}\`: ${item[1].desc}\n`
		}

		msg.channel.send(`${help}`)
	}

	/**
	 * Handles a bruhbot command
	 * @param msg
	 */
	static botCommand(msg) {
		const statement = msg.content.split(' ')
		if (statement.length > 1) {
			const command = this.#bruhBotMap.get(statement[1])
			command.func(msg)
		} else {
			msg.channel.send('Invalid BruhBot command.')
		}
	}
}

module.exports = BruhBot