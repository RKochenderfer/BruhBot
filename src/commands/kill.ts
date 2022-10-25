import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
import { FileHandler } from '../message-interactions/file-handler'
const KILL_MESSAGES_PATH = './killMessages.json'

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kill')
		.setDescription('Kill a mentioned user.')
		.addMentionableOption(option =>
			option
				.setName('user')
				.setDescription('The user to kill')
				.setRequired(true),
		),

	async execute(interaction: ChatInputCommandInteraction) {
		const fh = new FileHandler(KILL_MESSAGES_PATH)
		try {
			const json: any = await fh.readFile()
			const target = interaction.options.getMentionable('user')

			if (target && target.valueOf() !== interaction.user.id) {
				const index = Math.floor(
					Math.random() * json['killed-by'].length,
				)
				let death = json['killed-by'][index] as string
				death = death.replace(/\?/g, interaction.user.toString())
				death = death.replace(/#/g, target.toString())
				interaction.reply(`${death}`)
			} else {
				const index = Math.floor(
					Math.random() * json['kill-self'].length,
				)
				interaction.reply({
					content: `${interaction.user} ${json['kill-self'][index]}`,
				})
			}
		} catch (error) {
			console.error(error)
			interaction.reply('There was an error')
		}
	},
}
