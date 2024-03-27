import { SlashCommandBuilder } from 'discord.js'
import FlaggedPattern from '../message-checker/flagged-pattern'
import { MessageChecker } from '..'
import { ChatInputCommandInteractionWrapper } from '../extensions/chat-input-command-interaction-wrapper'
import { ServerCollection } from '../extensions/server-collection'
import Command from '../command'
import { Logger } from 'pino'
import Names from '../command-names'

export default class AddPhrase extends Command {
	private readonly _serverCollection: ServerCollection
	protected data = new SlashCommandBuilder()
		.setName(Names.addPhrase)
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
		)

	constructor(serverCollection: ServerCollection) {
		super(Names.addPhrase)
		this._serverCollection = serverCollection
	}

	execute = async (interaction: ChatInputCommandInteractionWrapper): Promise<void> => {
		const guildId = interaction.guildId!

		interaction.guardAgainstNonAdmin()
		await interaction.deferReply()

		const flaggedPatternToAdd = FlaggedPattern.from(interaction.options)
		this.addPattern(guildId, flaggedPatternToAdd)

		await interaction.followUp({
			content: 'Your pattern has been created',
			ephemeral: true,
		})
	}

	private addPattern = async (guildId: string, flaggedPatternToAdd: FlaggedPattern) => {
		flaggedPatternToAdd.guardAgainstInvalidFlags()
		await this._serverCollection!.addPattern(guildId, flaggedPatternToAdd)
		this.logger?.info(flaggedPatternToAdd, `Adding pattern to guild: ${guildId}`)

		MessageChecker.addPatternToCache(guildId, flaggedPatternToAdd)
	}
}
