import { SlashCommandBuilder } from 'discord.js'
import FlaggedPattern from '../message-checker/flaggedPattern'
import { ChatInputCommandInteractionWrapper } from '../extensions/chat-input-command-interaction-wrapper'
import Command from '../command'
import GuildCache from '../caches/guildCache'
import Guild from '../models/guild'
import { Logger } from 'pino'

export default class AddPhrase extends Command {
	constructor(private _guildCache: GuildCache, private _logger: Logger) {
		const name = 'addphrase'
		const data = new SlashCommandBuilder()
			.setName(name)
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

		super(name, data)
	}

	execute = async (interaction: ChatInputCommandInteractionWrapper): Promise<void> => {
		this._logger.info('Started to add flagged phrase to guild')

		if (interaction.isNotAdmin()) {
			interaction.reply({ content: 'Only an Admin can use this command', ephemeral: true })
			return
		}
		await interaction.deferReply()

		const flaggedPatternToAdd = FlaggedPattern.from(interaction.options)
		if (!flaggedPatternToAdd.areFlagsValid()) {
			this._logger.warn(flaggedPatternToAdd, 'Invalid flags in add pattern request')
			await interaction.followUp({
				content:
					'Invalid flag found. Here is the list of valid EMCAScript flags: g|m|i|x|s|u|U|A|J|D',
				ephemeral: true,
			})
		} else {
			await this.addPattern(interaction, flaggedPatternToAdd)

			await interaction.followUp({
				content: 'Your pattern has been created',
				ephemeral: true,
			})
		}

		this._logger.info('Completed adding flagged phrase to guild')
	}

	private addPattern = async (
		interaction: ChatInputCommandInteractionWrapper,
		flaggedPattern: FlaggedPattern,
	) => {
		const currentGuild = this._guildCache.getCacheEntry(interaction.guildId!)
		const updatedGuild = {
			...currentGuild,
			flaggedPatterns: [flaggedPattern, ...(currentGuild?.flaggedPatterns ?? [])],
		} as Guild

		await this._guildCache.updateGuild(interaction.guildId!, updatedGuild)
		this._logger.info(flaggedPattern, 'Added flagged pattern to guild')
	}
}
