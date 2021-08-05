const ytdl = require('ytdl-core')

class Music {
	/**
	 * Checks if bot has the current permissions to join and speak in a voice channel
	 * @param channel
	 * @param msg
	 * @returns {Readonly<Permissions>|null}
	 */
	static #permission(channel, msg) {
		const permission = channel.permissionsFor(msg.client.user)

		if (!permission.has('CONNECT') || !permission.has("SPEAK")) {
			msg.channel.send('I need permission to join and speak in your voice channel!')
			return null
		}

		return permission
	}

	/**
	 * Gets the voice channel the user is currently in
	 * @param msg
	 * @returns {Promise<null|boolean|*>}
	 */
	static async #getVoiceChannel(msg) {
		const voiceChannel = msg.member.voice.channel
		if (!voiceChannel) {
			msg.channel.send('You need to be in a voice channel use this command!')
			return null
		}
		let permission = this.#permission(voiceChannel, msg)
		if (permission === null) return null
		/* This will play a youtube video and should be saved but switching to a .mp3 for clips */
		return voiceChannel;
	}

	/**
	 * Stops the bot from playing music in a voice channel
	 * @param msg
	 * @returns {Promise<void>}
	 */
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

	/**
	 * Plays a youtube video from a url
	 * @param msg
	 * @param url
	 * @returns {Promise<void>}
	 */
	static async play_url(msg, url) {
		try {
			const voiceChannel = await this.#getVoiceChannel(msg)
			const conn = await voiceChannel.join()
			conn
				.play(ytdl(url))
				.on('finish', () => {
					voiceChannel.leave()
				})
				.on('error', error => console.error(error))
		} catch (e) {
			console.error(e)
		}
	}

	/**
	 * Plays a song that is stored as an mp3
	 * @param msg
	 * @param path
	 * @returns {Promise<boolean>}
	 */
	static async play_file(msg, path) {
		try {
			const voiceChannel = await this.#getVoiceChannel(msg)
			const conn = await voiceChannel.join()
			if (conn === null) return false
			conn
				.play(path)
				.on('finish', () => {
					voiceChannel.leave()
				})
				.on('error', err => console.error(err))
		} catch (err) {
			console.log(err)
			return false
		}
	}
}

module.exports = Music