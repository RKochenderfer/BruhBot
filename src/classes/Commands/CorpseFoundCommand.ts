import { CommandInteraction } from 'discord.js'
import { Command } from './Command'

export class CorpseFoundCommand extends Command {
	constructor() {
		super('corpse_found', 'Randomly chooses a user to be "sus"')
	}

	async execute(interaction: CommandInteraction) {
		let users: string[] = []
		interaction.guild?.members.cache.each(u => {
			if (u.displayName !== 'BruhBot') users.push(u.id)
		})
		const randUser = users[Math.floor(Math.random() * users.length)]
		interaction.channel?.send({
			content: `<@${randUser}> is kinda sus.`,
		})
	}
}
