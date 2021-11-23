import { CacheType, CommandInteraction } from 'discord.js'
import { Reply } from '../../Reply'
import { Court } from './Court'
import * as names from './Names'

export class Vote implements Court {
	private readonly yea = 'yea'
	private readonly nay = 'nay'
	private reply: Reply | null = null
	private interaction: CommandInteraction | null = null

	async performAction(interaction: CommandInteraction): Promise<void> {
		const subCommand = interaction.options.getSubcommand()
		this.reply = new Reply(interaction)
		this.interaction = interaction

		switch (subCommand) {
			case names.voteStartName:
				await this.startVote()
				break
			case names.voteAffirmativeName:
				await this.voteAffirmative()
				break
			case names.voteNegativeName:
				await this.voteNegative()
				break
			default:
				this.reply.followUp('How the hell did you get here?')
		}
	}
	private async voteNegative() {
		throw new Error('Method not implemented.')
	}
	private async voteAffirmative() {
		throw new Error('Method not implemented.')
	}
	private async startVote() {
		throw new Error('Method not implemented.')
	}
}
