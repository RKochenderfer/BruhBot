import { SlashCommandBuilder } from '@discordjs/builders'
import { MessageMapError } from '../errors/MessageMapError'
import { CommandType } from '../models/Command'
import { Command } from './Commands/Command'
import { BruhCommand } from './Commands/BruhCommand'
import { BruhbotCommand } from './Commands/BruhbotCommand'
import { CorpseFoundCommand } from './Commands/CorpseFoundCommand'
import { HugCommand } from './Commands/HugCommand'
import { InitiativeCommand } from './Commands/InitiativeCommand'
import { InsultCommand } from './Commands/InsultCommand'
import { KillCommand } from './Commands/KillCommand'
import { LeftistAssCommand } from './Commands/LeftistAssCommand'
import { PlayCommand } from './Commands/PlayCommand'
import { SocksCommand } from './Commands/SocksCommand'
import { TeamBuilderCommand } from './Commands/TeamBuilderCommand'
import { YeCommand } from './Commands/YeCommand'
import { YeeCommand } from './Commands/YeeCommand'
import { RollCommand } from './Commands/DiceRollerCommand'

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
	])

	getCommand(command: CommandType): Command {
		const commandClass = MessageMap.methodMap.get(command)
		if (!commandClass) {
			throw new MessageMapError(`Command ${command} not found`)
		}
		// return this.descriptionMap[Command[command]]
		return commandClass
	}

	static getSlashCommandBuilders(
		commandType: CommandType,
	): SlashCommandBuilder {
		const command = MessageMap.methodMap.get(commandType)

		if (!command) {
			throw new MessageMapError(
				`Attempt to get description of unknown command ${commandType}`,
			)
		}

		return command.buildCommand()
	}
}
