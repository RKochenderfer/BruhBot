import { Message } from "discord.js";

export class MesageChecker {
    private msg: Message

    constructor(msg: Message) {
        this.msg = msg
    }
    // private static flagged_expressions = [
    //     {
    //         'regex': /cum/im,
    //         func: async msg => await CumCounter.Counter(msg)
    //     }
    // ]

    async CheckMessage() {
        
    }
}