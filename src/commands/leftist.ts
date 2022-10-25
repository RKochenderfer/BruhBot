import {
	ChatInputCommandInteraction,
	SlashCommandBuilder,
	VoiceBasedChannel,
} from 'discord.js'
import {
	joinVoiceChannel,
	VoiceConnection,
	createAudioPlayer,
	createAudioResource,
	AudioPlayerStatus,
} from '@discordjs/voice'
import { logger } from '../index'

const LEFTIST_ASS_PATH = './assets/songs/leftist_ass.mp3'

const connectToChannel = (channel: VoiceBasedChannel): VoiceConnection => {
	return joinVoiceChannel({
		channelId: channel.id,
		guildId: channel.guildId,
		adapterCreator: channel.guild.voiceAdapterCreator,
	})
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leftist')
		.setDescription('I will eat your leftist ass'),

	async execute(interaction: ChatInputCommandInteraction) {
		try {
			const user = interaction.guild?.members.cache.get(
				interaction.user.id,
			)
			if (!user || !user.voice.channel) return
			if (!user.voice.channel.isVoiceBased()) {
				interaction.reply({
					content:
						'You have to be in a voice channel to use this commands',
					ephemeral: true,
				})
			}

			const connection = connectToChannel(user.voice.channel)
			interaction.reply('playing')
			const player = createAudioPlayer()

			player.on('stateChange', (oldState, newState) => {
				logger.log(
					'INFO',
					`Connection transitioned from ${oldState.toString()} to ${newState.toString()}`,
				)
			})
			player.on(AudioPlayerStatus.Playing, () => {
				logger.log('INFO', `playing ${LEFTIST_ASS_PATH}`)
			})
			player.on('error', error => {
				logger.log(
					'WARN',
					`Error: ${error.message} with resource ${LEFTIST_ASS_PATH}`,
				)

				connection.destroy()
			})
			player.on(AudioPlayerStatus.Idle, () => {
				connection.destroy()
			})

			const resource = createAudioResource(LEFTIST_ASS_PATH)
			player.play(resource)

			connection.subscribe(player)

			// await timers.setTimeout(5000)
			// connection.destroy()
		} catch (error) {
			logger.log('ERROR', error)
		}
	},
}
