import {
	ChatInputCommandInteraction,
	PermissionsBitField,
	SlashCommandBuilder,
} from 'discord.js'
import FlaggedPattern from '../message-checker/flagged-pattern'
import * as db from '../db'
import { MessageChecker } from '..'
import { logger } from '../utils/logger'

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addphrase')
		.setDescription('Adds a phrase to the message checker')
		.addStringOption(option =>
			option
				.setName('key')
				.setDescription('The word that is being checked for.')
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
				.setDescription(
					'The flags to be applied to the regex expression',
				)
				.setRequired(false),
		),

	async execute(interaction: ChatInputCommandInteraction) {
		if (!interaction.memberPermissions?.has(PermissionsBitField.Flags.Administrator)) {
			interaction.reply({ content: 'Only an Admin can use this command', ephemeral: true })
			return
		}
		await interaction.deferReply()
		try {
			const key = interaction.options.getString('key', true)
			const regexExpressions = interaction.options.getString(
				'regex_expression',
				true,
			)
			const regexFlags = interaction.options.getString('regex_flags')
			const response = interaction.options.getString('response', true)

			const messageChecker = new FlaggedPattern(
				key,
				regexExpressions,
				response,
				regexFlags,
			)
			if (!messageChecker.checkFlagsValid()) {
				await interaction.followUp({
					content: 'Invalid flag found. Here is the list of valid EMCAScript flags: g|m|i|x|s|u|U|A|J|D',
					ephemeral: true,
				})
				return
			}

			const serverExists = await db.collections.servers!.findOne({
				guildId: interaction.guildId!,
			})

			const toAdd = new FlaggedPattern(
				messageChecker.key,
				messageChecker.expression,
				messageChecker.response,
				messageChecker.flags,
			)

			if (serverExists) {
				db.collections.servers!.updateOne(
					{ guildId: interaction.guildId! },
					{ $push: { flaggedPatterns: toAdd } },
				)

				logger.debug(toAdd, `Adding pattern to guild: ${interaction.guildId}`)
			} else {
				db.collections.servers!.insertOne({
					name: interaction.guild!.name!,
					guildId: interaction.guildId!,
					flaggedPatterns: [toAdd],
				})
				logger.info(toAdd, `Creating server document and adding pattern for guildId: ${interaction.guildId}`)
			}

			MessageChecker.addPatternToCache(interaction.guildId!, toAdd)
			await interaction.followUp({
				content: 'Your pattern has been created',
				ephemeral: true,
			})
		} catch (error) {
			logger.error(error)
		}
	},
}
