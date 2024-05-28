import { UUID } from 'crypto';
import { BaseInteraction, Message } from 'discord.js';
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

	public static fromMessage(message: Message<boolean>): LogSession {
		Guard.Against.EmptyOrWhitespace(message.author.username)
		Guard.Against.EmptyOrWhitespace(message.author.id)
		Guard.Against.EmptyOrWhitespace(message.guildId)
		Guard.Against.EmptyOrWhitespace(message.guild?.name)

		return new LogSession(
			message.author.username,
			crypto.randomUUID(),
			message.author.id,
			message.guildId!,
			message.guild?.name!
		)
	}

	public static fromBaseInteraction(baseInteraction: BaseInteraction): LogSession {
		Guard.Against.EmptyOrWhitespace(baseInteraction.user.username)
		Guard.Against.EmptyOrWhitespace(baseInteraction.user.id)
		Guard.Against.EmptyOrWhitespace(baseInteraction.guildId)
		Guard.Against.EmptyOrWhitespace(baseInteraction.guild?.name)

		return new LogSession(
			baseInteraction.user.username,
			crypto.randomUUID(),
			baseInteraction.user.id,
			baseInteraction.guildId!,
			baseInteraction.guild?.name!
		)
	}

	public static fromCorrelationId(correlationId: UUID): LogSession {
		return new LogSession(
			"",
			correlationId,
			"",
			"",
			"",
		)
	}
}
