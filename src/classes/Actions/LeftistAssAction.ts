import { CommandInteraction, Message } from 'discord.js'
import { Music } from '../Music'
import { Action } from './Action'
import { LeftistAssActionError } from '../../errors/LeftistAssActionError'

export class LeftistAssAction extends Action {
	constructor() {
		super(
			'Plays a clip of I will eat you Leftist ass in the same voice channel as the user that summoned it',
		)
	}
	async execute(interaction: CommandInteraction) {
		// TODO: UNABLE TO JOIN VOICE CHAT ERROR
		const path = process.env.LEFTIST_ASS_PATH
		if (!path) {
			throw new LeftistAssActionError(
				'Env variable LEFTIST_ASS_PATH undefined.',
			)
		}
		Music.playFile(interaction, path)
	}
}
