import { CacheType, CommandInteraction } from "discord.js";
import { Court } from "./Court";

export class Trial implements Court {

    performAction(interaction: CommandInteraction): void {
        const subCommand = interaction.options.getSubcommand()

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

        // if (subCommand === 'new_judge') {
        //     this.newJudge()
        // } else if (subCommand === 'start') {
        //     this.startTrial()
        // } else {
        //     this.endTrial()
        // }
    }

    private startTrial() {
        const judge = this.randomJudge()
    }

    private assignJudge() {

    }

    private randomJudge() {

    }

    private newJudge() {
        // get the current judge

        // randomly get a new judge till it's different than the current one
    }

    private endTrial() {

    }
}