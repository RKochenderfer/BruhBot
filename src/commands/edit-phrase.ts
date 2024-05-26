import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
import { ChatInputCommandInteractionWrapper } from '../extensions/chat-input-command-interaction-wrapper'
import { ServerCollection } from '../extensions/server-collection'
import Command from '../command'
import FlaggedPattern from '../message-checker/flagged-pattern'
import { logger } from '../log/logger'
import Server from '../models/server'
import { MessageChecker } from '..'

export default class EditPhrase extends Command {
	constructor() {
		const name = 'editphrase'
		const data = new SlashCommandBuilder()
			.setName(name)
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
			)

		super(name, data)
	}

	execute = async (
		interaction: ChatInputCommandInteraction | ChatInputCommandInteractionWrapper,
		serverCollection?: ServerCollection,
	): Promise<void> => {
		interaction = interaction as ChatInputCommandInteractionWrapper
		const guildId = interaction.guildId!

		if (interaction.isNotAdmin()) {
			interaction.reply({ content: 'Only an Admin can use this command', ephemeral: true })
			return
		}
		await interaction.deferReply()

		const flaggedPatternToUpdate = FlaggedPattern.from(interaction.options)

		if (!flaggedPatternToUpdate.areFlagsValid()) {
			await interaction.followUp({
				content:
					'Invalid flag found. Here is the list of valid EMCAScript flags: g|m|i|x|s|u|U|A|J|D',
				ephemeral: true,
			})
			return
		}

		if (await serverCollection?.isServerInDb(guildId)) {
			logger.info(
				flaggedPatternToUpdate,
				`Updating pattern key: ${flaggedPatternToUpdate.key}`,
			)
			await serverCollection?.upsertPattern(guildId, flaggedPatternToUpdate)
		} else {
			logger.warn('Attempt to update flagged patterns for server not added')
			return
		}

		MessageChecker.updatePatternInCache(interaction.guildId!, flaggedPatternToUpdate)
		await interaction.followUp({
			content: 'Your pattern has been created',
			ephemeral: true,
		})
	}

	async addServer(server: Server, serverCollection: ServerCollection) {
		await serverCollection.insertServer(server)
		logger.info(
			server.flaggedPatterns,
			`Creating server document and adding pattern for guildId: ${server.guildId}`,
		)
	}
}
