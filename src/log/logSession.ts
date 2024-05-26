import { UUID } from 'crypto';
import { Message } from 'discord.js';
import { Guard } from '../guard/guard';

export default class LogSession {
	constructor(
		private _displayName: string,
		private _correlationId: UUID,
		private _userId: string,
		private _guildId: string,
		private _guildName: string,
	) {	}
	
	public get guildName(): string {
		return this._guildName;
	}
	public get guildId(): string {
		return this._guildId;
	}
	public get correlationId(): UUID | undefined {
		return this._correlationId;
	}
	public set correlationId(value: UUID | undefined) {
		if (!value) {
			this.correlationId = undefined
		} else {
			this._correlationId = value;
		}
	}
	public get userId(): string {
		return this._userId;
	}
	public get displayName(): string {
		return this._displayName;
	}

	public static from(message: Message<boolean>): LogSession {
		Guard.Against.NullOrUndefined(message.author.username)
		Guard.Against.NullOrUndefined(message.author.id)
		Guard.Against.NullOrUndefined(message.guildId)
		Guard.Against.NullOrUndefined(message.guild?.name)

		return new LogSession(
			message.author.username,
			crypto.randomUUID(),
			message.author.id,
			message.guildId!,
			message.guild?.name!
		)
	}
}
