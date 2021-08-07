import { ApplicationCommandOptionData, CommandInteraction, Message } from 'discord.js'
import { Action } from './Action'

export class HugAction extends Action {
	private static refuseHug = 10
	private static optionName = 'mention'

	constructor() {
		const description = 'Sends a hug to a mentioned user'
		const options: ApplicationCommandOptionData[] = [{
			name: HugAction.optionName,
			type: 'MENTIONABLE',
			description: 'The mentioned user to hug',
			required: true
		}]

		super(description, options)
	}

	async execute(interaction: CommandInteraction) {
		const val = Math.floor(Math.random() * 100)
		if (val > HugAction.refuseHug) {
			const words = ['super ', 'big ', 'little ', 'bro ', 'side ', 'hand ', '']
			let randWord = words[Math.floor(Math.random() * words.length)]
			const mentioned = interaction.options.getMentionable(HugAction.optionName)
			
			interaction.reply({content: `${mentioned} gets a ${randWord}hug`}) // reply is always required
		} else {
			// msg.channel.send('No')
			interaction.reply({content: "No, I don't think I will."})
		}
	}
}
