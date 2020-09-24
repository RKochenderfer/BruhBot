const ytdl = require('ytdl-core')

class Music {
	static #permission(channel, msg) {
		const permission = channel.permissionsFor(msg.client.user)

		if (!permission.has('CONNECT') || !permission.has("SPEAK")) {
			msg.channel.send('I need permission to join and speak in your voice channel!')
			return null
		}

		return permission
	}

	static async stop(msg) {
		const voiceChannel = msg.member.voice.channel
		if (!voiceChannel) {
			msg.channel.send('You must be in the voice channel the bot is currently in to use this command.')
			return
		}
		try {
			voiceChannel.leave()
		} catch (e) {
			console.error(e)
		}
	}

	static async play(msg, song) {
		const voiceChannel = msg.member.voice.channel
		if (!voiceChannel) {
			msg.channel.send('You need to be in a voice channel use this command!')
			return false
		}
		let permission = this.#permission(voiceChannel, msg)
		if (permission === null) return false
		try {
			const conn = await voiceChannel.join()
			const dispatcer = conn
				.play('C:\\Users\\rayjk\\repos\\BruhBot\\songs\\leftist_ass.mp3')
				.on('finish', () => {
					voiceChannel.leave()
				})
				.on('error', err => console.error(err))
			/* This will play a youtube video and should be saved but switching to a .mp3 for clips */
			// const conn = await voiceChannel.join()
			// const dispatcher = conn
			// 	.play(ytdl(song.url))
			// 	.on('finish', () => {
			// 		voiceChannel.leave()
			// 	})
			// 	.on('error', error => console.error(error))
		} catch (err) {
			console.log(err)
			return false
		}
	}
}

module.exports = Music