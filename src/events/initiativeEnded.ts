import { ChatInputCommandInteractionWrapper } from '../extensions/chatInputCommandInteractionWrapper'

/**
 * An event that a channel in a guild has started to roll initiative
 */
export class InitiativeEnded {
	private constructor(
		readonly guildId: string,
		readonly channelId: string,
		readonly interaction: ChatInputCommandInteractionWrapper,
	) {}

	static from(guildId: string, channelId: string, interaction: ChatInputCommandInteractionWrapper): InitiativeEnded {
		if (guildId === '') throw new Error('Guild id cannot be empty')
		if (channelId === '') throw new Error('Channel id cannot be empty')

		return new InitiativeEnded(guildId, channelId, interaction)
	}
}
