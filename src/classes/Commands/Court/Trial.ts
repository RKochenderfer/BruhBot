import { CommandInteraction, Guild, GuildMember } from 'discord.js'
import { Court } from './Court'
import { Trial as TrialModel } from '../../../models/Court/Trial'
import * as names from './Names'
import { Database } from '../../Database'
import { Reply } from '../../Reply'
import { ObjectId } from 'mongodb'

export class Trial implements Court {
	private interaction: CommandInteraction | null = null
	private reply: Reply | null = null

	async performAction(interaction: CommandInteraction): Promise<void> {
		const subCommand = interaction.options.getSubcommand()
		this.interaction = interaction
		this.reply = new Reply(interaction)

		switch (subCommand) {
			case 'new_judge':
				await this.newJudge()
				break
			case 'assign_judge':
				await this.assignJudge()
				break
			case 'start':
				await this.startTrial()
				break
			case 'end':
				await this.endTrial()
				break
			default:
				console.error(`How da fuck did you get here?: ${subCommand}`)
		}
	}

	private async startTrial() {
		const description = this.interaction!.options.getString(
			names.trialDescriptionName,
		)

		if (!description) throw new Error('No description found for trial')

		try {
			const judge = await this.randomJudge()

			const trial = new TrialModel(
				this.interaction?.guildId!,
				judge.id,
				Date.now(),
				false,
				description,
			)
			const result = await Database.collections.court?.insertOne(trial)

			if (result) {
				this.interaction?.followUp({
					content: `The trial was created and can now proceed! Here is the trial ID: ${result.insertedId}`,
				})
			} else {
				this.interaction?.followUp({
					content:
						'There was an error creating the trial. Please try again.',
				})
			}
		} catch (error) {
			console.error(error)
			this.interaction?.followUp({
				content:
					'There was an error creating the trial. Please try again.',
			})
		}
	}

	/**
	 * Assigns a directly mentioned user to be judge
	 */
	private async assignJudge() {
		const newJudge = this.interaction?.options.getUser(names.trialJudgeName)
		const trialId = this.interaction?.options.getString(names.trialId)
		const query = {
			_id: new ObjectId(trialId!),
		}

		try {
			const result = await Database.collections.court?.updateOne(query, {
				$set: { judge: newJudge!.id },
			})

			if (result) {
				this.reply!.followUp(
					`${newJudge} has been assigned to trial ${trialId}`,
				)
			}
		} catch (error) {
			console.error(error)
			this.reply!.followUp(
				`There was an error assiging the new judge ${newJudge} to trial ${trialId}`,
			)
		}
	}

	private async randomJudgeQuery(
		query: Object,
		toIgnore?: string,
	): Promise<GuildMember> {
		let openTrials = (await Database.collections.court
			?.find(query)
			.toArray()) as unknown as TrialModel[]

		if (toIgnore) openTrials = openTrials.filter(t => t.judge !== toIgnore)

		const currentJudges = openTrials.map(t => t.judge)

		if (openTrials) {
			const users = this.interaction?.guild?.members.cache.filter(
				m =>
					!m.user.bot &&
					m.presence?.status === 'online' &&
					!currentJudges.includes(m.id),
			)

			if (!users || users.size === 0)
				throw new Error('Unable to find a viable judge.')

			if (!users) throw new Error('No users found')

			return users.random()!
		} else {
			const users = this.interaction?.guild?.members.cache.filter(
				m => m.presence?.status === ('online' || 'invisible'),
			)
			if (!users) throw new Error('No users found')

			return users.random()!
		}
	}

	private async randomJudge(): Promise<GuildMember> {
		const query = {
			guildId: this.interaction?.guildId,
			complete: false,
		}

		return await this.randomJudgeQuery(query)
	}

	/**
	 * Picks a random user to be the current judge
	 */
	private async newJudge() {
		const trialId = this.interaction?.options.getString(names.trialId)
		const currentTrialQuery = {
			_id: new ObjectId(trialId!),
		}

		try {
			const query = {
				guildId: this.interaction?.guildId,
				complete: false,
			}
			const newJudge = await this.randomJudgeQuery(query)

			const result = await Database.collections.court?.updateOne(
				currentTrialQuery,
				{
					$set: { judge: newJudge.id },
				},
			)

			if (result) {
				this.reply!.followUp(
					`${newJudge} is the new judge for trial ${trialId}!`,
				)
			} else {
				this.reply!.followUp(
					`Unable to update trial ${trialId} with new judge ${newJudge}. Is this the correct trial number?`,
				)
			}
		} catch (error) {
			console.error(error)
			this.reply!.followUp('Unable to assign a new random judge.')
		}
	}

	private async endTrial() {
		const userId = this.interaction?.user.id
		const guildId = this.interaction?.guildId
		const verdict = this.interaction?.options.getString(
			names.trialVerdictName,
		)

		try {
			const query = {
				guildId: guildId,
				judge: userId,
				complete: false,
			}

			const result = await Database.collections.court?.updateOne(query, {
				$set: { complete: true, verdict: verdict },
			})

			if (result) {
				this.reply!.followUp('This trial has been concluded!')
			} else {
				this.reply!.followUp(
					"Unable to end trial. Are you sure you're a judge?",
				)
			}
		} catch (error) {
			console.error(error)
			this.reply!.followUp(
				'There was an error ending the trial. Please try again.',
			)
		}
	}
}
