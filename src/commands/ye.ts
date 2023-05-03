import { CommandInteraction, SlashCommandBuilder } from 'discord.js'

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
