import { CommandInteraction, Message } from 'discord.js'
import { Command } from './Action'

export class TeamBuilder extends Command {
	constructor() {
		super('Builds teams for a game')
	}

	async execute(interaction: CommandInteraction) {
		interaction.reply({content: 'This has not been implemented it'})
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
