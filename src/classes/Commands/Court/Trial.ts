import { CacheType, CommandInteraction, Snowflake, SnowflakeUtil } from "discord.js";
import { Court } from "./Court";
import { Trial as TrialModel } from "../../../models/Court/Trial"
import { CourtCommand } from "../CourtCommand";
import * as names from './Names'

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

    private startTrial() {
        const judge = this.randomJudge()
        const description = this.interaction!.options.getString(names.trialDescriptionName)

        if (!description)
            throw new Error('No description found for trial')


        const trial = new TrialModel(this.interaction?.guildId!, judge, Date.now(), false, description)

        // insert the trial data into the database

        // reply to the user who the judge is and that the trial can start
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

    private endTrial() {
        // set the trial to be complete
    }
}