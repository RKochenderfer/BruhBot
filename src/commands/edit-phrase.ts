import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
import { ChatInputCommandInteractionWrapper } from '../extensions/chat-input-command-interaction-wrapper'
import { ServerCollection } from '../extensions/server-collection'
import Command from '../command'
import FlaggedPattern from '../message-checker/flagged-pattern'
import { logger } from '../utils/logger'
import { MessageChecker } from '..'

export default class EditPhrase extends Command {
	private readonly _serverCollection: ServerCollection

	constructor(serverCollection: ServerCollection) {
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
		this._serverCollection = serverCollection
	}

	execute = async (
		interaction: ChatInputCommandInteraction | ChatInputCommandInteractionWrapper,
	): Promise<void> => {
		interaction = interaction as ChatInputCommandInteractionWrapper
		const guildId = interaction.guildId!

		interaction.guardAgainstNonAdmin()
		await interaction.deferReply()

		const flaggedPatternToUpdate = FlaggedPattern.from(interaction.options)
		this.updatePattern(guildId, flaggedPatternToUpdate)

		await interaction.followUp({
			content: 'Your pattern has been created',
			ephemeral: true,
		})
	}

	private updatePattern = async (guildId: string, flaggedPatternToUpdate: FlaggedPattern) => {
		flaggedPatternToUpdate.guardAgainstInvalidFlags()
		await this._serverCollection.updatePattern(guildId, flaggedPatternToUpdate)
		logger.info(flaggedPatternToUpdate, `Updating pattern for guild ${guildId}`)

		MessageChecker.updatePatternInCache(guildId, flaggedPatternToUpdate)
	}
}
