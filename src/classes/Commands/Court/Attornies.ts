import { ObjectId } from 'mongodb'
import { CacheType, CommandInteraction } from 'discord.js'
import { Court } from './Court'
import * as names from './Names'
import { Database } from '../../Database'
import { Reply } from '../../Reply'

export class Attornies implements Court {
	private reply: Reply | null = null
	async performAction(
		interaction: CommandInteraction<CacheType>,
	): Promise<void> {
        // TODO: FIX THE MODEL TO INCLUDE THE ATTORNEY MODEL AND NOT JUST THE ID
		this.reply = new Reply(interaction)
		const trialId = interaction.options.getString(names.trialId)
		const prosecutor = interaction.options.getUser(names.setProsecutorName)!
		const defender = interaction.options.getUser(names.setDefendentName)!

		const query = {
			_id: new ObjectId(trialId!),
		}
		try {
			const result = await Database.collections.court?.updateOne(query, {
				$set: {
					prosecutor: prosecutor.id,
					defender: defender.id,
				},
			})

			if (result) {
				this.reply!.followUp(
					`${prosecutor} is now the prosecutor and ${defender} is now the defender for trial ${trialId}!`,
				)
			}
		} catch (error) {
			console.error(error)
			this.reply.followUp(
				`Unable to assign ${prosecutor} as prosecutor and ${defender} as defender`,
			)
		}
	}
}
