import {
	AttachmentBuilder,
	ChatInputCommandInteraction,
	GuildMember,
	messageLink,
	SlashCommandBuilder,
} from 'discord.js'

const refusalRate = 10
/**
 * Hug a mentioned user
 */
module.exports = {
	data: new SlashCommandBuilder()
		.setName('nickname')
		.setDescription("Sets a user's nickname")
		.addMentionableOption(option =>
			option
				.setName('user')
				.setDescription("The mentioned user's new nickname.")
				.setRequired(true),
		)
		.addStringOption(option =>
			option
				.setName('nickname')
				.setDescription("The user's new nickname")
				.setRequired(true),
		),

	async execute(interaction: ChatInputCommandInteraction) {
		const mentioned = interaction.options.getMentionable(
			'user',
		) as GuildMember
		const oldNickname = mentioned.nickname
		const newNickname = interaction.options.getString('nickname')!
		const permissions = (await interaction.guild?.members.fetch(process.env.BOT_USER_ID!))?.permissions
		console.log(permissions?.toArray())

		if (!permissions?.has('ManageNicknames') || !permissions.has('ChangeNickname')) {
			interaction.reply(`I don't have permission to change nicknames because we live in a dictatorship.`)
			return
		}

		try {
			await mentioned.setNickname(newNickname)
			interaction.reply(
				`${oldNickname} has been renamed to ${newNickname}`,
			)
		} catch (error) {
			console.error(error)
			interaction.reply({
				content: 'Failed to rename user',
				ephemeral: true,
			})
		}
	},
}
