import { ObjectId } from "bson"
import { CommandInteraction, User } from "discord.js"
import { Trial } from "../../../../models/Court/Trial"
import { Database } from "../../../Database"
import { Reply } from "../../../Reply"

export class TrialHistory {
    private readonly trialId?: string
    private readonly weeks?: number
    private readonly judge?: User
    private readonly interaction: CommandInteraction
    private readonly reply: Reply

    constructor(interaction: CommandInteraction, trialId?: string, weeks?: number, judge?: User) {
        this.interaction = interaction
        this.trialId = trialId
        this.weeks = weeks
        this.judge = judge 
        this.reply = new Reply(this.interaction)
    }

    private formatter(trials: Trial[]): string {
        let result = ''

        trials.forEach(t => {
            result += `ID: ${t._id} | Date: ${t.startDate} | Judge: ${t.judge} | Verdict: ${t.verdict}\n`
        })

        return result
    }

    async searchTrialId() {
        const query = {
            _id: new ObjectId(this.trialId)
        }

        try {
            const result = (await Database.collections.court?.findOne(query)) as unknown as Trial

            if (result) {
                await this.reply.followUp(this.formatter([result]))
            }
            
        } catch (error) {
            console.error(error)
            await this.reply.followUp('There was an error searching for that trial.')
        }
    }

    async searchWeeks() {
        const queryDate = new Date()
        queryDate.setDate(queryDate.getDate() - (7 * this.weeks!))

        try {
            const result = Database.collections.court?.findOne({
                trial: {
                    $lt: queryDate.toISOString()
                }
            }) as unknown as Trial[]

            if (result && result.length > 0) {
                this.reply.followUp(this.formatter(result))
            } else {
                this.reply.followUp(`No trials were found within ${this.weeks}`)
            }
        } catch (error) {
            console.error(error)
            this.reply.followUp('There was an error searching for the trials.')
        }
    }

    async searchJudgeId() {
        const query = {
            judge: this.judge?.id
        }
        try {
            const result = Database.collections.court?.find(query) as unknown as Trial[]

            if (result && result.length > 0) {
                this.reply.followUp(this.formatter(result))
            } else {
                this.reply.followUp(`No trials were found with ${this.judge?.username} as judge`)
            }
        } catch (error) {
            console.error(error)
            this.reply.followUp('There was an error searching for trial by judge.')
        }
    }   
}