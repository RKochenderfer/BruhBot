import { CommandInteraction } from 'discord.js'
import { Music } from '../Music'
import { Command } from './Command'
import { LeftistAssActionError } from '../../errors/LeftistAssActionError'

export class LeftistAssCommand extends Command {
	constructor() {
		super(
			'leftist_ass',
			'Plays a clip of I will eat you Leftist ass in the same voice channel as the user that summoned it',
		)
	}
	async execute(interaction: CommandInteraction) {
		interaction.reply({ content: 'This has not been implemented it' })
		return
		// interaction.deferReply()
		// // TODO: UNABLE TO JOIN VOICE CHAT ERROR
		// const path = process.env.LEFTIST_ASS_PATH
		// if (!path) {
		// 	throw new LeftistAssActionError(
		// 		'Env variable LEFTIST_ASS_PATH undefined.',
		// 	)
		// }
		// try {
		// 	await Music.playFile(interaction, path)
		// } catch (e) {
		// 	// interaction.reply('There was an error playing the file')
		// }
	}
}
