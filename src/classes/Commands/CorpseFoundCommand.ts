import { CommandInteraction, GuildMember, Message, UserFlags } from 'discord.js'
import { Command } from './Action'

export class CorpseFoundCommand extends Command {
	constructor() {
		super('Randomly chooses a user to be "sus"')
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
