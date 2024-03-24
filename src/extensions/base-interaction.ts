import {
	ChatInputCommandInteraction as DiscordjsChatInputCommandInteraction,
	PermissionsBitField,
} from 'discord.js'

export class ChatInputCommandInteraction extends DiscordjsChatInputCommandInteraction {
	public isAdmin(): boolean {
		if (this.memberPermissions == null) {
			throw 'Member permissions is null'
		}
		return this.memberPermissions.has(PermissionsBitField.Flags.Administrator)
	}

	public isNotAdmin(): boolean {
		return this.isAdmin()
	}
}
