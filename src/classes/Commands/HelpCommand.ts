import { CommandInteraction, Message } from 'discord.js'
import { CommandType } from '../../models/Command'
import { Command } from './Action'

export class HelpCommand extends Command {
	// private _messageMap: Map<Command, any>;

	constructor() {
		super('Shows possible top level commands for bruhbot')
		// this._messageMap = messageMap;
	}
	async execute(interaction: CommandInteraction) {
		interaction.reply({content: 'This has not been implemented it'})
	}
}
