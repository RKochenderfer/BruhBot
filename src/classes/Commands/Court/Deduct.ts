import { CacheType, CommandInteraction } from "discord.js";
import { Court } from "./Court";

export class Deduct implements Court {
    performAction(interaction: CommandInteraction<CacheType>): void {
        throw new Error("Method not implemented.");
    }
}