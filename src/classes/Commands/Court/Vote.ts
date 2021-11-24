import { ObjectId } from 'bson'
import { CacheType, CommandInteraction } from 'discord.js'
import { Trial } from '../../../models/Court/Trial'
import { Database } from '../../Database'
import { Reply } from '../../Reply'
import { Court } from './Court'
import {Vote as VoteModel} from '../../../models/Court/Vote'
import * as names from './Names'

export class Vote implements Court {
	private reply: Reply | null = null
	private interaction: CommandInteraction | null = null
	private trialId: string = ''
	private trialEntry: Trial | null = null

	async performAction(interaction: CommandInteraction): Promise<void> {
		this.trialId = interaction.options.getString(names.trialId)!
		this.reply = new Reply(interaction)
		this.interaction = interaction

		try {
			const result = await this.getTrialEntry()

			if (!result) {
				this.reply.followUp(`Trial ${this.trialId} was not found.`)
				return
			}

			this.trialEntry = result

			await this.performCommand()
		} catch (error) {
			console.error(error)
			this.reply.followUp(
				'There was an error creating the vote. Are you sure the trial exists?',
			)
		}
	}

	private async getTrialEntry(): Promise<Trial | null> {
		const query = {
			_id: new ObjectId(this.trialId),
		}

		const result = (await Database.collections.court?.findOne(
			query,
		)) as unknown as Trial

		if (result) {
			return result
		} else {
			return null
		}
	}

	private async performCommand() {
		const subCommand = this.interaction!.options.getSubcommand()

		switch (subCommand) {
			case names.voteStartName:
				await this.startVote()
				break
			case names.voteEndName:
				await this.endVote()
				break
			case names.voteAffirmativeName:
				await this.voteAffirmative()
				break
			case names.voteNegativeName:
				await this.voteNegative()
				break
			default:
				this.reply?.followUp('How the hell did you get here?')
		}
	}

	private async endVote() {
				// Check to make sure only the judge of a trial can call for a vote
		if (!this.trialEntry!.votingIsOpen) {
			await this.reply?.followUp(
				`Voting for trial ${this.trialId} has already ended.`,
			)
			return
		}

		if (this.interaction?.user.id !== this.trialEntry?.judge) {
			await this.reply?.followUp(
				`Only the judge for trial ${this.trialId} can end a vote.`,
			)
			return
		}

		const query = {
			_id: new ObjectId(this.trialId),
		}

		const result = await Database.collections.court?.updateOne(query, {
			$set: { votingIsOpen: false },
		})

		if (result) {
			let yeaCount = 0
			let nayCount = 0

			// this.trialEntry?.votes?.forEach(v => {
			// 	if (v.vote === t)
			// })
			// await this.reply?.followUp(
			// 	`The voting for trial ${this.trialId} has started!`,
			// )
		} else {
			await this.reply?.followUp(
				`I was unable to start the vote for trial ${this.trialId}`,
			)
		}
	}

	private async voteNegative() {
		if (!this.trialEntry!.votingIsOpen) {
			this.reply?.followUp(`Voting for ${this.trialId} is not open. The judge must start the vote.`)
			return
		}

		const newVote = new VoteModel(this.interaction?.user.id!, 'nay')
		this.trialEntry?.votes?.push(newVote)
		const query = {
			_id: new ObjectId(this.trialId)
		}

		const result = Database.collections.court?.updateOne(query, {
			$set: {votes: this.trialEntry?.votes}
		})

		if (result) {
			await this.reply?.followUp(`${this.interaction?.user} has voted nay!`)
		} else {
			await this.reply?.followUp(`We were unable to cast the vote for user ${this.interaction?.user}`)
		}
	}
	private async voteAffirmative() {
		if (!this.trialEntry!.votingIsOpen) {
			this.reply?.followUp(`Voting for ${this.trialId} is not open. The judge must start the vote.`)
			return
		}

		const newVote = new VoteModel(this.interaction?.user.id!, names.voteAffirmativeName)
		this.trialEntry?.votes?.push(newVote)
		const query = {
			_id: new ObjectId(this.trialId)
		}

		const result = Database.collections.court?.updateOne(query, {
			$set: {votes: this.trialEntry?.votes}
		})

		if (result) {
			await this.reply?.followUp(`${this.interaction?.user} has voted ${names.voteAffirmativeName}!`)
		} else {
			await this.reply?.followUp(`We were unable to cast the vote for user ${this.interaction?.user}`)
		}
	}
	private async startVote() {
		// Check to make sure only the judge of a trial can call for a vote
		if (this.trialEntry!.votingIsOpen) {
			await this.reply?.followUp(
				`Voting for trial ${this.trialId} is already open.`,
			)
			return
		}

		if (this.interaction?.user.id !== this.trialEntry?.judge) {
			await this.reply?.followUp(
				`Only the judge for trial ${this.trialId} can start a vote.`,
			)
			return
		}

		//if (!this.trialEntry!.votingIsOpen && this.interaction?.user.id !== this.trialEntry!.judge) {
		const query = {
			_id: new ObjectId(this.trialId),
		}

		const result = await Database.collections.court?.updateOne(query, {
			$set: { votingIsOpen: true },
		})

		if (result) {
			await this.reply?.followUp(
				`The voting for trial ${this.trialId} has started!`,
			)
		} else {
			await this.reply?.followUp(
				`I was unable to start the vote for trial ${this.trialId}`,
			)
		}
	}
}
