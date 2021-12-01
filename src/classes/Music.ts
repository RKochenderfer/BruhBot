<<<<<<< HEAD
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
=======
import { CommandInteraction, GuildMember, Message, Snowflake } from 'discord.js'
import {
	joinVoiceChannel,
	createAudioPlayer,
	demuxProbe,
	createAudioResource,
	VoiceConnection,
	VoiceConnectionStatus,
	DiscordGatewayAdapterCreator,
	AudioPlayerStatus,
	NoSubscriberBehavior,
	entersState,
	VoiceConnectionDisconnectReason,
	getVoiceConnection,
} from '@discordjs/voice'
import { MusicError } from '../errors/MusicError'

import { promisify } from 'util'

import {createReadStream, ReadStream} from 'fs'

const wait = promisify(setTimeout)

export class Music {
	static subscriptions = new Map<string, VoiceConnection>()

	static async probeAndCreateResource(readableStream: ReadStream) {
		const { stream, type } = await demuxProbe(readableStream);
		return createAudioResource(stream, { inputType: type });
	}

	static subscribeToChannel(voiceConnection: VoiceConnection) {
		const audioPlayer = createAudioPlayer()
		voiceConnection.on('stateChange', async (_, newState) => {
			if (newState.status === VoiceConnectionStatus.Disconnected) {
				if (
					newState.reason ===
						VoiceConnectionDisconnectReason.WebSocketClose &&
					newState.closeCode === 4014
				) {
					/*
						If the WebSocket closed with a 4014 code, this means that we should not manually attempt to reconnect,
						but there is a chance the connection will recover itself if the reason of the disconnect was due to
						switching voice channels. This is also the same code for the bot being kicked from the voice channel,
						so we allow 5 seconds to figure out which scenario it is. If the bot has been kicked, we should destroy
						the voice connection.
					*/
					try {
						await entersState(
							voiceConnection,
							VoiceConnectionStatus.Connecting,
							5_000,
						)
						// Probably moved voice channel
					} catch {
						voiceConnection.destroy()
						// Probably removed from voice channel
					}
				} else if (voiceConnection.rejoinAttempts < 5) {
					/*
						The disconnect in this case is recoverable, and we also have <5 repeated attempts so we will reconnect.
					*/
					await wait((voiceConnection.rejoinAttempts + 1) * 5_000)
					voiceConnection.rejoin()
				} else {
					/*
						The disconnect in this case may be recoverable, but we have no more remaining attempts - destroy.
					*/
					voiceConnection.destroy()
				}
			} else if (newState.status === VoiceConnectionStatus.Destroyed) {
				/*
					Once destroyed, stop the subscription
				*/
			}
		})

		// Configure audio player
		audioPlayer.on('stateChange', (oldState, newState) => {
			if (
				newState.status === AudioPlayerStatus.Idle &&
				oldState.status !== AudioPlayerStatus.Idle
			) {
				// If the Idle state is entered from a non-Idle state, it means that an audio resource has finished playing.
				// The queue is then processed to start playing the next track, if one is available.
			} else if (newState.status === AudioPlayerStatus.Playing) {
			}
		})

		voiceConnection.subscribe(audioPlayer)
	}

	static async playFile(interaction: CommandInteraction, path: string) {
		if (!interaction.guildId)
			return

		let voiceConn = getVoiceConnection(interaction.guildId)
		if (!voiceConn) {
			if (interaction.member instanceof GuildMember && interaction.member.voice.channel) {
				const channel = interaction.member.voice.channel
				voiceConn = joinVoiceChannel({
					channelId: channel.id,
					guildId: channel.guild.id,
					adapterCreator: channel.guild.voiceAdapterCreator as DiscordGatewayAdapterCreator,
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
				if (!process.env.LEFTIST_ASS_PATH) {
					throw new MusicError('Leftist Ass path undefined')
				}
				const resource = await this.probeAndCreateResource(createReadStream(process.env.LEFTIST_ASS_PATH))
				player.play(resource)
				player.on('error', error => {
					console.error(`Error: ${error}`)
				})
				voiceConn.subscribe(player)
				
				await interaction.followUp('Playing!')
				await entersState(player, AudioPlayerStatus.Idle, 10e3)
				voiceConn.destroy()
			} catch (e) {
				console.warn(e)
				await interaction.followUp('Failed to join channel in 10 seconds')
				voiceConn.disconnect()
				voiceConn.destroy()
			}
		} else {
			voiceConn.destroy()
		}
	}
}
>>>>>>> law-and-order
