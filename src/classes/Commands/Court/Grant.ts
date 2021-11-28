import { ObjectId } from 'bson'
import { CacheType, CommandInteraction } from 'discord.js'
import { Trial } from '../../../models/Court/Trial'
import { Database } from '../../Database'
import { Reply } from '../../Reply'
import { Court } from './Court'
import * as names from './Names'

export class Grant implements Court {
	async performAction(interaction: CommandInteraction): Promise<void> {
		const attorney = interaction.options.getString(names.grantAttorneyName)
        const points = interaction.options.getNumber(names.grantPointsAmountName)
        const trialId = interaction.options.getString(names.trialId)
        const reply = new Reply(interaction)

        const query = {
            _id: new ObjectId(trialId!)
        }
        try {
            const trial = await this.getTrial(trialId!)            

            if (trial) {
                
                let result = null
                if (attorney === names.setProsecutorName) {
                    trial.prosecutor!.points! += points!
                    result = Database.collections.court?.updateOne(query, {
                        $set: {prosecutor: trial.prosecutor }
                    })
                } else {
                    trial.defender!.points! += points!
                    result = Database.collections.court?.updateOne(query, {
                        $set: {defender: trial.defender}
                    })
                }                
            } else {
                reply.followUp('The trial was not found.')
            }
        } catch (error) {
            console.error(error)
            reply.followUp('There was an error attmpeting to give points.')
        }
	}

    private async getTrial(trialId: string): Promise<Trial> {
        const query = new ObjectId(trialId)

        return Database.collections.court?.findOne(query) as unknown as Trial
    }
}
