import { ObjectId } from 'mongodb'
import { CacheType, CommandInteraction } from 'discord.js'
import { Court } from './Court'
import * as names from './Names'
import { Database } from '../../Database'
import { Reply } from '../../Reply'
import { Attorney } from '../../../models/Court/Attorney'

export class Attornies implements Court {
	private reply: Reply | null = null
	async performAction(
		interaction: CommandInteraction<CacheType>,
	): Promise<void> {
		this.reply = new Reply(interaction)
		const trialId = interaction.options.getString(names.trialId)
		const prosecutorUser = interaction.options.getUser(names.setProsecutorName)!
		const defenderUser = interaction.options.getUser(names.setDefendentName)!

        const prosecutor = new Attorney(prosecutorUser.id)
        const defender = new Attorney(defenderUser.id)

		const query = {
			_id: new ObjectId(trialId!),
		}
		try {
			const result = await Database.collections.court?.updateOne(query, {
				$set: {
					prosecutor: prosecutor,
					defender: defender,
				},
			})

			if (result) {
				await this.reply!.followUp(
					`${prosecutorUser} is now the prosecutor and ${defenderUser} is now the defender for trial ${trialId}!`,
				)
			}
		} catch (error) {
			console.error(error)
			await this.reply.followUp(
				`Unable to assign ${prosecutor} as prosecutor and ${defender} as defender`,
			)
		}
	}
}
