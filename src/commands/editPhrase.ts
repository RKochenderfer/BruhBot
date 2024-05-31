import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
import { ChatInputCommandInteractionWrapper } from '../extensions/chatInputCommandInteractionWrapper'
import Command from '../command'
import FlaggedPattern from '../message-checker/flaggedPattern'
import { MessageChecker } from '..'
import GuildCache from '../caches/guildCache'
import { Logger } from 'pino'

export default class EditPhrase extends Command {
	constructor(private _guildCache: GuildCache, private _logger: Logger) {
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
	): Promise<void> => {
		this._logger.debug('Started to edit a phrase')

		interaction = interaction as ChatInputCommandInteractionWrapper
		const guildId = interaction.guildId!

		if (interaction.isNotAdmin()) {
			await interaction.reply({ content: 'Only an Admin can use this command', ephemeral: true })
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

		const guild = await this._guildCache.get(guildId)
		const oldPattern = guild?.flaggedPatterns?.find(x => x.key === flaggedPatternToUpdate.key)
		if (!oldPattern) {
			throw new Error('Pattern key to be updated was not found')
		}
		flaggedPatternToUpdate.messageHistory = oldPattern.messageHistory
		await this._guildCache.updateFlaggedPattern(guildId, flaggedPatternToUpdate)

		await interaction.followUp({
			content: `The pattern with key ${flaggedPatternToUpdate.key} has been updated`,
			ephemeral: true,
		})

		this._logger.debug('Completed editing phrase')
	}
}
