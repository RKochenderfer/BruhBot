import {
	ChatInputCommandInteraction,
	SlashCommandBuilder,
} from 'discord.js'
// import { FileHandler } from '../message-interactions/file-handler'
// const KILL_MESSAGES_PATH = join(
// 	__dirname,
// 	'../../data/kill-messages.json',
// )

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
		interaction.reply({ content: 'This is currently out of service', ephemeral: true })
		// const fh = new FileHandler(KILL_MESSAGES_PATH)
		// try {
		// 	const json: any = await fh.readFile()
		// 	const target = interaction.options.getMentionable(
		// 		'user',
		// 	) as GuildMember

		// 	// if the target user is bruh bot refuse
		// 	if (target.user.id === process.env.BOT_USER_ID!) {
		// 		const file = new AttachmentBuilder(
		// 			'./assets/gifs/no-i-dont-think-i-will.gif',
		// 		)

		// 		interaction.reply({ files: [file] })
		// 		return
		// 	}

		// 	if (target && target.valueOf() !== interaction.user.id) {
		// 		const index = Math.floor(
		// 			Math.random() * json['killed-by'].length,
		// 		)
		// 		let death = json['killed-by'][index] as string
		// 		death = death.replace(/\?/g, interaction.user.toString())
		// 		death = death.replace(/#/g, target.toString())
		// 		interaction.reply(`${death}`)
		// 	} else {
		// 		const index = Math.floor(
		// 			Math.random() * json['kill-self'].length,
		// 		)
		// 		interaction.reply({
		// 			content: `${interaction.user} ${json['kill-self'][index]}`,
		// 		})
		// 	}
		// } catch (error) {
		// 	console.error(error)
		// 	interaction.reply('There was an error')
		// }
	},
}
