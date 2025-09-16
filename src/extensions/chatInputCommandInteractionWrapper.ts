import {
	CacheType,
	ChatInputCommandInteraction,
	CommandInteractionOptionResolver,
	Guild,
	InteractionDeferReplyOptions,
	InteractionReplyOptions,
	InteractionResponse,
	Message,
	MessagePayload,
	PermissionsBitField,
	TextChannel,
} from 'discord.js'

export class ChatInputCommandInteractionWrapper {
	private hasResponded = false
	private constructor(private _interaction: ChatInputCommandInteraction) {}

	static from(interaction: ChatInputCommandInteraction): ChatInputCommandInteractionWrapper {
		return new ChatInputCommandInteractionWrapper(interaction)
	}

	public get interaction(): ChatInputCommandInteraction {
		return this._interaction
	}

	public get guild(): Guild | null {
		return this._interaction.guild
	}

	public get guildId(): string | null {
		return this._interaction.guildId
	}

	public get channelId(): string {
		return this._interaction.channelId
	}

	public get options(): Omit<CommandInteractionOptionResolver<CacheType>, 'getMessage' | 'getFocused'> {
		return this._interaction.options
	}

	public get serverName(): string | null {
		return this._interaction.guild!.name
	}

	public get userId(): string {
		return this._interaction.user.id
	}

	public get username(): string {
		return this._interaction.user.username
	}

	public get textChannel(): TextChannel | undefined {
		if (this._interaction.channel === null) {
			return undefined
		}
		return this._interaction.channel as TextChannel
	}

	public get subcommand(): string | undefined {
		return this._interaction.options.getSubcommand()
	}

	async followUp(followUpOptions: string | InteractionReplyOptions | MessagePayload): Promise<Message<boolean>> {
		return await this._interaction.followUp(followUpOptions)
	}

	async reply(
		replyOptions: string | InteractionReplyOptions | MessagePayload,
	): Promise<InteractionResponse<boolean>> {
		if (this.hasResponded) {
			throw new Error('You have already responded to this interaction')
		}
		this.hasResponded = true
		return await this._interaction.reply(replyOptions)
	}

	async deferReply(options?: InteractionDeferReplyOptions | undefined): Promise<InteractionResponse<boolean>> {
		return await this.interaction.deferReply(options)
	}

	isAdmin(): boolean {
		if (this._interaction.memberPermissions == null) {
			throw 'Member permissions is null'
		}
		return this._interaction.memberPermissions.has(PermissionsBitField.Flags.Administrator)
	}

	isNotAdmin(): boolean {
		return !this.isAdmin()
	}
}
