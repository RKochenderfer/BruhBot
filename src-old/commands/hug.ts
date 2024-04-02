import {
	AttachmentBuilder,
	ChatInputCommandInteraction,
	SlashCommandBuilder,
} from 'discord.js'

const refusalRate = 10
/**
 * Hug a mentioned user
 */
module.exports = {
	data: new SlashCommandBuilder()
		.setName('hug')
		.setDescription('Sends a hug to a user.')
		.addMentionableOption(option =>
			option
				.setName('user')
				.setDescription('The mentioned user to hug')
				.setRequired(true),
		),

	async execute(interaction: ChatInputCommandInteraction) {
		const val = Math.floor(Math.random() * 100)
		if (val > refusalRate) {
			const words = [
				'super ',
				'big ',
				'little ',
				'bro ',
				'side ',
				'hand ',
				'',
			]
			const randWord = words[Math.floor(Math.random() * words.length)]
			const mentioned = interaction.options.getMentionable('user')
			if (!mentioned) {
				interaction.reply({
					content: 'Something went wrong when giving the hug :(.',
				})
			} else {
				interaction.reply(`${mentioned} gets a ${randWord}hug`)
			}
		} else {
			// msg.channel.send('No')
			const file = new AttachmentBuilder('./assets/gifs/no-i-dont-think-i-will.gif')

			interaction.reply({ files: [file] })
		}
	},
}
