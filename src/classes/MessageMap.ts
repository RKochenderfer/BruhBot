import { MessageMapError } from "../errors/MessageMapError";
import { CommandType } from "../models/Command";
import { Action } from "./Actions/Action";
import { BruhAction } from "./Actions/BruhAction";
import { BruhbotAction } from "./Actions/BruhbotAction";
import { CorpseFoundAction } from "./Actions/CorpseFoundAction";
import { HelpAction } from "./Actions/HelpAction";
import { HugAction } from "./Actions/HugAction";
import { InitiativeAction } from "./Actions/InitiativeAction";
import { InsultAction } from "./Actions/InsultAction";
import { KillAction } from "./Actions/KillAction";
import { LeftistAssAction } from "./Actions/LeftistAssAction";
import { PlayAction } from "./Actions/PlayAction";
import { RollAction } from "./Actions/RollAction";
import { SocksAction } from "./Actions/SocksAction";
import { TeamBuilderAction } from "./Actions/TeamBuilderAction";
import { YeAction } from "./Actions/YeAction";
import { YeeAction } from "./Actions/YeeAction";

export class MessageMap {
	private static methodMap = new Map<CommandType, Action>([
		[CommandType.BRUH, new BruhAction()],
		[CommandType.CORPSE_FOUND, new CorpseFoundAction()],
		[CommandType.YEE, new YeeAction()],
		[CommandType.HUG, new HugAction()],
		[CommandType.LEFTIST_ASS, new LeftistAssAction()],
		[CommandType.BRUHBOT, new BruhbotAction()],
		[CommandType.INSULT, new InsultAction()],
		[CommandType.KILL, new KillAction()],
		[CommandType.SOCKS, new SocksAction()],
		[CommandType.PLAY, new PlayAction()],
		[CommandType.YE, new YeAction()],
		[CommandType.ROLL, new RollAction()],
		[CommandType.INITIATIVE, new InitiativeAction()],
		[CommandType.TEAM_BUILDER, new TeamBuilderAction()],
	]);

	getCommand(command: CommandType): Action {
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
}
