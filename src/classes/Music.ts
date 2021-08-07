import { CommandInteraction, GuildMember, Message } from 'discord.js'
import {
	joinVoiceChannel,
	createAudioPlayer,
	createAudioResource,
	VoiceConnection,
	VoiceConnectionStatus,
	DiscordGatewayAdapterCreator,
} from '@discordjs/voice'
import { MusicError } from '../errors/MusicError'

export class Music {
	private static getVoiceChannel(interaction: CommandInteraction) {
		const voiceChannel = (interaction.member as GuildMember).voice.channel;
		/* This will play a youtube video and should be saved but switching to a .mp3 for clips */
		return voiceChannel
	}

	static connectToChannel(interaction: CommandInteraction): VoiceConnection {
		const voiceChannel = this.getVoiceChannel(interaction)
		if (!voiceChannel) {
			throw new MusicError('Unable to connect to voice channel')
		}
		const conn = joinVoiceChannel({
			channelId: voiceChannel?.id!,
			guildId: voiceChannel?.guild.id!,
			adapterCreator: voiceChannel?.guild.voiceAdapterCreator as DiscordGatewayAdapterCreator,
		})

		return conn
	}

	static playFile(interaction: CommandInteraction, path: string) {
		const conn = this.connectToChannel(interaction)
		const resource = createAudioResource(path)
		const player = createAudioPlayer()
		player.play(resource)
		conn.subscribe(player)
        // conn.on('finish', () => {
        //     player.stop()
        //     conn.disconnect()
        // })
		// conn.on('error', () => {
		// 	player.stop()
        //     conn.disconnect()
		// })
	}
}
