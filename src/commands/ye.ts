// import { CommandInteraction } from 'discord.js'
// import { Command } from './Command'

import { CommandInteraction, SlashCommandBuilder } from 'discord.js'

// const fetch = require('node-fetch')

// export class YeCommand extends Command {
// 	constructor() {
// 		super('ye', 'Gets a random Kanye West quote')
// 	}
// 	async execute(interaction: CommandInteraction) {
// 		const res = await fetch('https://api.kanye.rest')
// 		const json = await res.json()

// 		interaction.reply({
// 			content: `Kanye West says: "${await json.quote}""`,
// 		})
// 	}
// }

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ye')
		.setDescription(
			'Gets a random Kanye West quote (hopefully not antisemitic',
		),

	async execute(interaction: CommandInteraction) {
		const res = await fetch('https://api.kanye.rest')
		const json = await res.json()

		interaction.reply(`Kanye West says: "${await json.quote}"`)
	},
}
