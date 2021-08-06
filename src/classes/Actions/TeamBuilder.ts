import { CommandInteraction, Message } from 'discord.js'
import { Action } from './Action'

export class TeamBuilder extends Action {
	constructor() {
		super('Builds teams for a game')
	}

	async execute(interaction: CommandInteraction) {
		throw new Error('Method not implemented.')
		// func: (msg) => {
		//     try {
		//         const teams = TeamBuilder.messageHandler(msg);
		//         teams.generateTeams();
		//         const strings = teams.buildTeamStrings();
		//         for (let i = 0; i < strings.length; i++) {
		//             msg.channel.send(strings[i]);
		//         }
		//         // msg.channel.send(`${teams.getTeams()}`)
		//     } catch (ex) {
		//         msg.channel.send(`Failed to build teams: ${ex}`);
		//     }
		// },
	}
}
