import { CommandInteraction } from "discord.js";

export interface Court {
    performAction(interaction: CommandInteraction): void
}