import { CommandInteraction, GuildMember } from 'discord.js'
import {
	joinVoiceChannel,
	createAudioPlayer,
	demuxProbe,
	createAudioResource,
	VoiceConnection,
	VoiceConnectionStatus,
	DiscordGatewayAdapterCreator,
	AudioPlayerStatus,
	entersState,
	getVoiceConnection,
} from '@discordjs/voice'

import { ReadStream } from 'fs'
import { join } from 'path'
const Path = require('path')

export class Music {
	static subscriptions = new Map<string, VoiceConnection>()

	static async probeAndCreateResource(readableStream: ReadStream) {
		const { stream, type } = await demuxProbe(readableStream)
		return createAudioResource(stream, { inputType: type })
	}

	static async playFile(interaction: CommandInteraction, path: string) {
		if (!interaction.guildId) return

		let voiceConn = getVoiceConnection(interaction.guildId)
		if (!voiceConn) {
			if (
				interaction.member instanceof GuildMember &&
				interaction.member.voice.channel
			) {
				const channel = interaction.member.voice.channel
				voiceConn = joinVoiceChannel({
					channelId: channel.id,
					guildId: channel.guild.id,
					adapterCreator: channel.guild
						.voiceAdapterCreator as DiscordGatewayAdapterCreator,
				})
				voiceConn.on('error', console.warn)
			}
			if (!voiceConn) {
				await interaction.followUp('Join a channel and try again')
				return
			}
			try {
				await entersState(voiceConn, VoiceConnectionStatus.Ready, 10e3)
				const player = createAudioPlayer()
				voiceConn.subscribe(player)

				player.on('error', error => {
					console.error(`Error: ${error}`)
				})

				console.log(join(__dirname, '../../songs/leftist_ass.mp3'))

				const resource = createAudioResource(
					join(__dirname, '../../songs/leftist_ass.mp3'),
				)

				// const resource = createAudioResource('https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_700KB.mp3')

				player.play(resource)
				player.on(AudioPlayerStatus.Playing, () => {
					console.log('Now playing')
				})

				

				await interaction.followUp('Playing!')
				await entersState(player, AudioPlayerStatus.Idle, 10e3)
				voiceConn.destroy()
			} catch (e) {
				console.warn(e)
				await interaction.followUp(
					'Failed to join channel in 10 seconds',
				)
				voiceConn.disconnect()
				voiceConn.destroy()
			}
		} else {
			voiceConn.destroy()
		}
	}
}
