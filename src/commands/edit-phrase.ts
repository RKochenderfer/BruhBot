import { PermissionsBitField, SlashCommandBuilder } from 'discord.js';
import { ChatInputCommandInteractionWrapper } from '../extensions/chat-input-command-interaction-wrapper';
import FlaggedPattern from '../message-checker/flagged-pattern';
import { ServerCollection } from '../extensions/server-collection';
import { logger } from '../utils/logger'
import Server from '../models/server';
import { MessageChecker } from '..';
import { Database } from '../db';

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

	async execute(interaction: ChatInputCommandInteractionWrapper, collections: Database) {
		const serverCollection = await collections.servers!
		const guildId = interaction.guildId!

		if (interaction.isNotAdmin()) {
			interaction.reply({ content: 'Only an Admin can use this command', ephemeral: true })
			return
		}

		await interaction.deferReply()
		const flaggedPatternToUpdate = FlaggedPattern.from(interaction.options)
		try {
			if (!flaggedPatternToUpdate.areFlagsValid()) {
				await interaction.followUp({
					content:
						'Invalid flag found. Here is the list of valid EMCAScript flags: g|m|i|x|s|u|U|A|J|D',
					ephemeral: true,
				})
				return
			}

			if (await serverCollection.isServerInDb(guildId)) {
				await serverCollection.addPattern(guildId, flaggedPatternToUpdate)
				logger.debug(flaggedPatternToUpdate, `Adding pattern to guild: ${interaction.guildId}`)
			} else {
				const server: Server = {
					name: interaction.serverName!,
					guildId: guildId,
					flaggedPatterns: [flaggedPatternToUpdate],
					pins: []
				} 
				await this.addServer(server, serverCollection)
			}

			MessageChecker.updatePatternInCache(interaction.guildId!, flaggedPatternToUpdate)
			await interaction.followUp({
				content: 'Your pattern has been created',
				ephemeral: true,
			})
		} catch (error) {

		}
	}
}