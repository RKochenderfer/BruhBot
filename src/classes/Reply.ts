import { CommandInteraction } from "discord.js";

export class Reply {
    private interaction: CommandInteraction

    constructor(interaction: CommandInteraction) {
        this.interaction = interaction
    }    

    public reply(message: string) {
        this.interaction.reply({content: message})
    }

    public followUp(message: string) {
        this.interaction.followUp({content: message})
    }
}