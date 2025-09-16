import { RollInformation } from './rollInformation'

/**
 * The roll, server and user information for a dice roll
 */
export class DiceRolledInfo {
	private constructor(
		readonly roll: RollInformation,
		readonly userId: string,
		readonly name: string,
		readonly guildId: string,
		readonly channelId: string,
		readonly rolledAt: Date,
	) {}

	public static from(
		roll: RollInformation,
		userId: string,
		userName: string,
		guildId: string,
		channelId: string,
		rolledAt: Date,
	): DiceRolledInfo {
		if (!userId) {
			throw new Error('User ID cannot be empty')
		}
		if (!guildId) {
			throw new Error('Guild ID cannot be empty')
		}
		return new DiceRolledInfo(roll, userId, userName, guildId, channelId, rolledAt)
	}
}
