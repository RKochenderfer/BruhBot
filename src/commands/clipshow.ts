import { SlashCommandBuilder } from 'discord.js'
import GuildCache from '../caches/guildCache'
import { Logger } from 'pino'
import { ChatInputCommandInteractionWrapper } from '../extensions/chatInputCommandInteractionWrapper'
import Command from '../command'

export default class Clipshow extends Command {
	constructor(private _guildCache: GuildCache, private _logger: Logger) {
		const name = 'clipshow'
		const data = new SlashCommandBuilder()
			.setName('clipshow')
			.setDescription(
				'Gets a random quote from the pinned list or previously pinned comments',
			)

		super(name, data)
	}

	execute = async (interaction: ChatInputCommandInteractionWrapper): Promise<void> => {
		this._logger.debug('Started clipshow')
		await interaction.deferReply()

		const guild = await this._guildCache.get(interaction.guildId!)
		if (!guild) throw new Error('Guild not found')

		if (guild.pins == undefined || guild.pins?.length === 0) {
			await interaction.followUp({ content: 'The server has no pins', ephemeral: true })
			return
		}

		const randomPinnedMessage = guild.pins[Math.floor(Math.random() * guild.pins.length)]
		const author = await interaction.guild?.members.fetch(randomPinnedMessage.userId!)

		await interaction.followUp(
			`> ${randomPinnedMessage.message}\n\t-**${
				author?.nickname ? author.nickname : author?.user.username
			}**`,
		)

		this._logger.debug('Completed clipshow')
	}
}
