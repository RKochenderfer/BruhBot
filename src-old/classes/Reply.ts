import { CommandInteraction } from "discord.js";

export class Reply {
    private interaction: CommandInteraction

    constructor(interaction: CommandInteraction) {
        this.interaction = interaction
    }    

    public async reply(message: string) {
        await this.interaction.reply({content: message})
    }

    public async followUp(message: string) {
        await this.interaction.followUp({content: message})
    }
}