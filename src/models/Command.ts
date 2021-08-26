import { ApplicationCommandData } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import { MessageMap } from '../classes/MessageMap'
import { CommandData } from './CommandData'

export enum CommandType {
	BRUH = 'bruh',
	CORPSE_FOUND = 'corpse_found',
	YEE = 'yee',
	HUG = 'hug',
	LEFTIST_ASS = 'leftist_ass',
	BRUHBOT = 'bruhbot',
	INSULT = 'insult',
	KILL = 'kill',
	SOCKS = 'socks',
	PLAY = 'play',
	YE = 'ye',
	ROLL = 'roll',
	INITIATIVE = 'initiative',
	TEAM_BUILDER = 'team_builder',
}

export class Command {
	static commandMap(str: string): CommandType | undefined {
		switch (str) {
			case CommandType.BRUH.toString():
				return CommandType.BRUH
			case CommandType.CORPSE_FOUND.toString():
				return CommandType.CORPSE_FOUND
			case CommandType.YEE.toString():
				return CommandType.YEE
			case CommandType.HUG.toString():
				return CommandType.HUG
			case CommandType.LEFTIST_ASS.toString():
				return CommandType.LEFTIST_ASS
			case CommandType.BRUHBOT.toString():
				return CommandType.BRUHBOT
			case CommandType.INSULT.toString():
				return CommandType.INSULT
			case CommandType.KILL.toString():
				return CommandType.KILL
			case CommandType.SOCKS.toString():
				return CommandType.SOCKS
			case CommandType.PLAY.toString():
				return CommandType.PLAY
			case CommandType.YE.toString():
				return CommandType.YE
			case CommandType.ROLL.toString():
				return CommandType.ROLL
			case CommandType.INITIATIVE.toString():
				return CommandType.INITIATIVE
			case CommandType.TEAM_BUILDER.toString():
				return CommandType.TEAM_BUILDER
			default:
				return undefined
		}
	}

    static getCommandEnum(command: string): CommandType | undefined {
        return this.commandMap(command)
    }

	static buildCommandDataMap(): any {
		const commands = []
		
		for (const val in CommandType) {
			const lowercaseVal = val.toLowerCase()
			const builder = MessageMap.getSlashCommandBuilders(Command.commandMap(lowercaseVal)!)
			
			commands.push(builder.toJSON())
		}

		return commands
		// let data: ApplicationCommandData[] = []
		// for (const val in CommandType) {
        //     const lowercaseVal = val.toLowerCase()
		// 	const toAdd: ApplicationCommandData = {
		// 		name: lowercaseVal,
		// 		description: MessageMap.getDescription(Command.commandMap(lowercaseVal)!),
		// 		options: MessageMap.getOptions(Command.commandMap(lowercaseVal)!)
		// 	}
		// 	data.push(toAdd)
		// }

		// return data
	}
}
