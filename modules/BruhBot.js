const Music = require("./Music");

class BruhBot {
	static bruhBotMap = new Map([
		[
			'stfu',
			{
				'desc': 'Forcibly disconnects bruhbot from the voice channel a user is in',
				func: msg => this.#stfu(msg)
			}
		]
	])

	static #stfu(msg, arg) {
		Music.stop(msg)
			.catch(err => console.error(err))
	}

	static botCommand(msg) {
		const statement = msg.content.split(' ')
		if (statement.length > 1) {
			const command = this.bruhBotMap.get(statement[1])
			command.func(msg)
		} else {
			msg.channel.send('Invalid BruhBot command.')
		}
	}
}

module.exports = BruhBot