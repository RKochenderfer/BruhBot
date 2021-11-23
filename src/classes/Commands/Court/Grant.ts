import { CacheType, CommandInteraction } from "discord.js";
import { Court } from "./Court";

export class Grant implements Court {
    async performAction(interaction: CommandInteraction<CacheType>): Promise<void> {
        throw new Error("Method not implemented.");
    }
}