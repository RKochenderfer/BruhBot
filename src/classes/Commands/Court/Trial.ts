import {
	CacheType,
	CommandInteraction,
	Snowflake,
	SnowflakeUtil,
} from 'discord.js'
import { Court } from './Court'
import { Trial as TrialModel } from '../../../models/Court/Trial'
import { CourtCommand } from '../CourtCommand'
import * as names from './Names'
import { Database } from '../../Database'

export class Trial implements Court {
	private interaction: CommandInteraction | null = null

	performAction(interaction: CommandInteraction): void {
		const subCommand = interaction.options.getSubcommand()
		this.interaction = interaction

		switch (subCommand) {
			case 'new_judge':
				this.newJudge()
				break
			case 'assign_judge':
				this.assignJudge()
				break
			case 'start':
				this.startTrial()
				break
			case 'end':
				this.endTrial()
				break
			default:
				console.error(`How da fuck did you get here?: ${subCommand}`)
		}
	}

	private async startTrial() {
		const judge = this.randomJudge()
		const description = this.interaction!.options.getString(
			names.trialDescriptionName,
		)

		if (!description) throw new Error('No description found for trial')

		const trial = new TrialModel(
			this.interaction?.guildId!,
			judge,
			Date.now(),
			false,
			description,
		)

		// TODO: Add a check to make sure the judge is only the judge for one trial at a time in a server

		try {
			const result = await Database.collections.court?.insertOne(trial)

			if (result) {
				this.interaction?.followUp({
					content: 'The trial was created and can now proceed!',
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
	private assignJudge() {
		// takes the user that is mentioned to be judge
		// make sure they are not an attorney
		// update the value in the database
	}

	private randomJudge(): string {
		// Get all users in the guild

		// Pick a random user

		// Return user's id

		return this.interaction?.user.id! // TODO:: SETUP THIS LOGIC
	}

	/**
	 * Picks a random user to be the current judge
	 */
	private newJudge() {
		// get the current judge
		// randomly get a new judge till it's different than the current one
	}

	private async endTrial() {
		// set the trial to be complete
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
				this.interaction?.followUp({
					content: 'This trial has been concluded!',
				})
			} else {
				this.interaction?.followUp({
					content:
						"Unable to end trial. Are you sure you're a judge?",
				})
			}
		} catch (error) {
			console.error(error)
			this.interaction?.followUp({
				content:
					'There was an error ending the trial. Please try again.',
			})
		}
	}
}
