import { PermissionsBitField, SlashCommandBuilder } from 'discord.js';
import { ChatInputCommandInteraction } from '../extensions/base-interaction';
import FlaggedPattern from '../message-checker/flagged-pattern';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('editphrase')
		.setDescription('Edit a phrase to the message checker')
		.addStringOption(option =>
			option
				.setName('key')
				.setDescription('The existing phrase in the database')
				.setRequired(true),
		)
		.addStringOption(option =>
			option
				.setName('regex_expression')
				.setDescription(
					'The regex expression for bruhbot to check against (ex: gonk). Do not include flags here',
				)
				.setRequired(true),
		)
		.addStringOption(option =>
			option
				.setName('response')
				.setDescription('The response Bruhbot will give to the sender')
				.setRequired(true),
		)
		.addStringOption(option =>
			option
				.setName('regex_flags')
				.setDescription('The flags to be applied to the regex expression')
				.setRequired(false),
		),

	async execute(interaction: ChatInputCommandInteraction) {
		if (interaction.isNotAdmin()) {
			interaction.reply({ content: 'Only an Admin can use this command', ephemeral: true })
			return
		}

		await interaction.deferReply()
		const messageChecker = FlaggedPattern.from(interaction.options)
		try {
			if (!messageChecker.areFlagsValid()) {
				await interaction.followUp({
					content:
						'Invalid flag found. Here is the list of valid EMCAScript flags: g|m|i|x|s|u|U|A|J|D',
					ephemeral: true,
				})
				return
			}
		} catch (error) {

		}
	}
}