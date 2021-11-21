import { CacheType, CommandInteraction } from "discord.js";
import { Court } from "./Court";

export class Trial implements Court {
    performAction(interaction: CommandInteraction<CacheType>): void {
        throw new Error("Method not implemented.");
    }
}