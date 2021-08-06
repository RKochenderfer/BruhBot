import { CommandInteraction, Message } from 'discord.js'
import { Action } from './Action'

export class HugAction extends Action {
	private static refuseHug = 10

	constructor() {
		super('Sends a hug to a mentioned user')
	}

	async execute(interaction: CommandInteraction) {
		throw new Error('Not implemented')
		// const val = Math.floor(Math.random() * 100)
		// if (val > HugAction.refuseHug) {
		// 	const words = [
		// 		'super ',
		// 		'big ',
		// 		'little ',
		// 		'bro ',
		// 		'side ',
		// 		'hand ',
		// 		'',
		// 	]
		// 	let randWord = words[Math.floor(Math.random() * words.length)]
		// 	const targetMember = interaction.mentions?.members?.first()

		// 	interaction.channel.send(`${targetMember} gets a ${randWord}hug`)
		// } else {
		// 	interaction.channel.send('No')
		// }
	}
}
