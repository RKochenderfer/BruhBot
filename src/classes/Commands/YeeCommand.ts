import { CommandInteraction } from 'discord.js'
import { Command } from './Action'

export class YeeCommand extends Command {
	constructor() {
		super('Replies to a user with a random length and capitalized "yee"')
	}

	private static randomCapitalize(str: string) {
		// Randomly capitalize letters
		const randNumCapital = Math.floor(Math.random() * str.length)
		let indexesToCapital: number[] = []
		for (let i = 0; i < randNumCapital; i++) {
			const num = Math.floor(Math.random() * str.length)
			if (!indexesToCapital.includes(num)) indexesToCapital.push(num)
		}
		let s = []
		for (let i = 0; i < str.length; i++) {
			if (indexesToCapital.includes(i)) {
				s.push(str.charAt(i).toUpperCase())
			} else {
				s.push(str.charAt(i))
			}
		}

		return s.join('')
	}

	async execute(interaction: CommandInteraction) {
		let yee = 'yee'

		let numEs = Math.floor(Math.random() * 25)
		for (let i = 0; i < numEs; i++) {
			yee += 'e'
		}
		
		interaction.reply({content: `${YeeCommand.randomCapitalize(yee)}`})
	}
}
