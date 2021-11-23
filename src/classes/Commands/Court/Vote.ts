import { CacheType, CommandInteraction } from "discord.js";
import { Court } from "./Court";

export class Vote implements Court {
    async performAction(interaction: CommandInteraction<CacheType>): Promise<void> {
        throw new Error("Method not implemented.");
    }
}