import { CommandInteraction, Guild, GuildMember } from 'discord.js'
import { Court } from './Court'
import { Trial as TrialModel } from '../../../models/Court/Trial'
import * as names from './Names'
import { Database } from '../../Database'
import { Reply } from '../../Reply'
import { ObjectId } from 'mongodb'
import { TrialHistory } from './Trial/TrialHistory'

export class Trial implements Court {
	private interaction: CommandInteraction | null = null
	private reply: Reply | null = null

	async performAction(interaction: CommandInteraction): Promise<void> {
		const subCommand = interaction.options.getSubcommand()
		this.interaction = interaction
		this.reply = new Reply(interaction)

		switch (subCommand) {
			case names.trialNewJudgeName:
				await this.newJudge()
				break
			case names.trialAssignJudgeName:
				await this.assignJudge()
				break
			case names.trialStartName:
				await this.startTrial()
				break
			case names.trialEndName:
				await this.endTrial()
				break
			case names.trialHistoryName:
				await this.trialHistory()
				break
			default:
				console.error(`How da fuck did you get here?: ${subCommand}`)
		}
	}

	private async trialHistory() {
		const trialIdSearch = this.interaction?.options.getString(names.trialId)
		const weekRangeSearch = this.interaction?.options.getNumber(names.trialPreviousWeeksName)
		const judgeSearch = this.interaction?.options.getUser(names.trialJudgeName)

		if (trialIdSearch) {
			// search trials by id
			const history = new TrialHistory(this.interaction!, trialIdSearch)
			history.searchTrialId()
		} else if (weekRangeSearch) {
			// search trials by week range
			const history = new TrialHistory(this.interaction!, undefined, weekRangeSearch)
			history.searchWeeks()
		} else {
			// search trials by judge user id
			const history = new TrialHistory(this.interaction!, undefined, undefined, judgeSearch!)
			history.searchJudgeId()
		}

	}

	private async startTrial() {
		const description = this.interaction!.options.getString(
			names.trialDescriptionName,
		)

		if (!description) throw new Error('No description found for trial')

		try {
			const judge = await this.randomJudge()
			const date = new Date()

			const trial = new TrialModel(
				this.interaction?.guildId!,
				judge.id,
				date.toISOString(),
				false,
				description,
			)
			const result = await Database.collections.court?.insertOne(trial)

			if (result) {
				await this.interaction?.followUp({
					content: `The trial was created with ${judge} as the judge and can now proceed! Here is the trial ID: ${result.insertedId}`,
				})
			} else {
				await this.interaction?.followUp({
					content:
						'There was an error creating the trial. Please try again.',
				})
			}
		} catch (error) {
			console.error(error)
			await this.interaction?.followUp({
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

			console.log(result)

			if (result) {
				await this.reply!.followUp(
					`${newJudge} has been assigned to trial ${trialId}`,
				)
			} else {
				throw new Error(`Unable to assign ${newJudge} as the new judge`)
			}
		} catch (error) {
			console.error(error)
			await this.reply!.followUp(
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
					m.roles.cache.find(r => r.name === 'court') !== undefined &&
					!currentJudges.includes(m.id) 
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
				await this.reply!.followUp(
					`${newJudge} is the new judge for trial ${trialId}!`,
				)
			} else {
				await this.reply!.followUp(
					`Unable to update trial ${trialId} with new judge ${newJudge}. Is this the correct trial number?`,
				)
			}
		} catch (error) {
			console.error(error)
			await this.reply!.followUp('Unable to assign a new random judge.')
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
				votingIsOpen: false,
			}

			const result = await Database.collections.court?.updateOne(query, {
				$set: { complete: true, verdict: verdict },
			})

			if (result) {
				await this.reply!.followUp(`Verdict: ${verdict}. This trial has been concluded!`)
			} else {
				await this.reply!.followUp(
					"Unable to end trial. Are you sure you're a judge?",
				)
			}
		} catch (error) {
			console.error(error)
			await this.reply!.followUp(
				'There was an error ending the trial. Please try again.',
			)
		}
	}
}