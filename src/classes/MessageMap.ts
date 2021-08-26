import { ApplicationCommandOptionData } from "discord.js";
import { MessageMapError } from "../errors/MessageMapError";
import { CommandType } from "../models/Command";
import { Command } from "./Commands/Action";
import { BruhCommand } from "./Commands/BruhCommand";
import { BruhbotCommand } from "./Commands/BruhbotCommand";
import { CorpseFoundCommand } from "./Commands/CorpseFoundCommand";
import { HelpCommand } from "./Commands/HelpCommand";
import { HugCommand } from "./Commands/HugCommand";
import { InitiativeCommand } from "./Commands/InitiativeCommand";
import { InsultCommand } from "./Commands/InsultCommand";
import { KillCommand } from "./Commands/KillCommand";
import { LeftistAssCommand } from "./Commands/LeftistAssCommand";
import { PlayCommand } from "./Commands/PlayCommand";
import { RollCommand } from "./Commands/RollCommand";
import { SocksCommand } from "./Commands/SocksCommand";
import { TeamBuilderCommand } from "./Commands/TeamBuilderCommand";
import { YeCommand } from "./Commands/YeCommand";
import { YeeCommand } from "./Commands/YeeCommand";

export class MessageMap {
	private static methodMap = new Map<CommandType, Command>([
		[CommandType.BRUH, new BruhCommand()],
		[CommandType.CORPSE_FOUND, new CorpseFoundCommand()],
		[CommandType.YEE, new YeeCommand()],
		[CommandType.HUG, new HugCommand()],
		[CommandType.LEFTIST_ASS, new LeftistAssCommand()],
		[CommandType.BRUHBOT, new BruhbotCommand()],
		[CommandType.INSULT, new InsultCommand()],
		[CommandType.KILL, new KillCommand()],
		[CommandType.SOCKS, new SocksCommand()],
		[CommandType.PLAY, new PlayCommand()],
		[CommandType.YE, new YeCommand()],
		[CommandType.ROLL, new RollCommand()],
		[CommandType.INITIATIVE, new InitiativeCommand()],
		[CommandType.TEAM_BUILDER, new TeamBuilderCommand()],
	]);

	getCommand(command: CommandType): Command {
		const commandClass = MessageMap.methodMap.get(command)
		if (!commandClass) {
			throw new MessageMapError(`Command ${command} not found`)
		}
		// return this.descriptionMap[Command[command]]
        return commandClass
	}

	static getDescription(command: CommandType): string {
		const action = MessageMap.methodMap.get(command)
		if (!action) {
			throw new MessageMapError(`Attempt to get description of unknown command ${command}`)
		}

		return action.description
	}

	static getOptions(command: CommandType): ApplicationCommandOptionData[] | undefined {
		const action = MessageMap.methodMap.get(command)
		if (!action) {
			throw new MessageMapError(`Attempt to get description of unknown command ${command}`)
		}

		return action.options
	}
}
