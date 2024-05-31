import {
	AttachmentBuilder,
	SlashCommandBuilder,
} from 'discord.js'
import { Logger } from 'pino'
import { ChatInputCommandInteractionWrapper } from '../extensions/chatInputCommandInteractionWrapper'
import Command from '../command'

export default class Hug extends Command {
	private readonly _refusalRate

	constructor(private _logger: Logger) {
		const name = 'hug'
		const data = new SlashCommandBuilder()
		.setName('hug')
		.setDescription('Sends a hug to a user.')
		.addMentionableOption(option =>
			option
				.setName('user')
				.setDescription('The mentioned user to hug')
				.setRequired(true),
		)

		super(name, data)

		this._refusalRate = 10
	}

	execute = async (interaction: ChatInputCommandInteractionWrapper): Promise<void> => {
		this._logger.debug('Started hug')

		const val = Math.floor(Math.random() * 100)
		if (val > this._refusalRate) {
			const words = [
				'super ',
				'big ',
				'little ',
				'bro ',
				'side ',
				'hand ',
				'',
			]
			const randWord = words[Math.floor(Math.random() * words.length)]
			const mentioned = interaction.options.getMentionable('user')
			if (!mentioned) {
				await interaction.reply({
					content: 'Something went wrong when giving the hug :(.',
				})
			} else {
				await interaction.reply(`${mentioned} gets a ${randWord}hug`)
			}
		} else {
			const file = new AttachmentBuilder('./assets/gifs/no-i-dont-think-i-will.gif')

			await interaction.reply({ files: [file] })
		}

		this._logger.debug('Completed hug')
	}
}
