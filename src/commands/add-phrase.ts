import { SlashCommandBuilder } from 'discord.js'
import FlaggedPattern from '../message-checker/flagged-pattern'
import { MessageChecker } from '..'
import { logger } from '../utils/logger'
import { ChatInputCommandInteractionWrapper } from '../extensions/chat-input-command-interaction-wrapper'
import Server from '../models/server'
import { ServerCollection } from '../extensions/server-collection'
import { Database } from '../db'
import { Collection } from 'mongodb'

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
				.setDescription('The flags to be applied to the regex expression')
				.setRequired(false),
		),

	async execute(interaction: ChatInputCommandInteractionWrapper, serverCollection: ServerCollection ) {
		const guildId = interaction.guildId!

		if (interaction.isNotAdmin()) {
			interaction.reply({ content: 'Only an Admin can use this command', ephemeral: true })
			return
		}
		await interaction.interaction.deferReply()

		const flaggedPatternToAdd = FlaggedPattern.from(interaction.options)
		try {			
			if (!flaggedPatternToAdd.areFlagsValid()) {
				await interaction.interaction.followUp({
					content:
						'Invalid flag found. Here is the list of valid EMCAScript flags: g|m|i|x|s|u|U|A|J|D',
					ephemeral: true,
				})
				return
			}

			if (await serverCollection.isServerInDb(guildId)) {
				await serverCollection.addPattern(guildId, flaggedPatternToAdd)
				logger.debug(flaggedPatternToAdd, `Adding pattern to guild: ${interaction.guildId}`)
			} else {
				const server: Server = {
					name: interaction.serverName!,
					guildId: guildId,
					flaggedPatterns: [flaggedPatternToAdd],
					pins: []
				} 
				await this.addServer(server, serverCollection)
			}

			MessageChecker.addPatternToCache(interaction.guildId!, flaggedPatternToAdd)
			await interaction.followUp({
				content: 'Your pattern has been created',
				ephemeral: true,
			})
		} catch (error) {
			logger.error(error)
		}
	},

	async addServer(server: Server, serverCollection: ServerCollection) {
		await serverCollection.insertServer(server)
		logger.info(
			server.flaggedPatterns,
			`Creating server document and adding pattern for guildId: ${server.guildId}`,
		)
	}
}

