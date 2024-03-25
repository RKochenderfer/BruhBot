import {
	CacheType,
	ChatInputCommandInteraction,
	CommandInteractionOptionResolver,
	InteractionDeferReplyOptions,
	InteractionReplyOptions,
	InteractionResponse,
	Message,
	MessagePayload,
	PermissionsBitField,
} from 'discord.js'

export class ChatInputCommandInteractionWrapper {
	private constructor(private _interaction: ChatInputCommandInteraction) {}

	static from = (
		interaction: ChatInputCommandInteraction,
	): ChatInputCommandInteractionWrapper => {
		return new ChatInputCommandInteractionWrapper(interaction)
	}

	public get interaction(): ChatInputCommandInteraction {
		return this._interaction
	}

	public get guildId(): string | null {
		return this._interaction.guildId
	}

	public get options(): Omit<CommandInteractionOptionResolver<CacheType>, "getMessage" | "getFocused"> {
		return this._interaction.options
	}

	public get serverName(): string | null {
		return this._interaction.guild!.name
	}

	followUp = async (followUpOptions: string | InteractionReplyOptions | MessagePayload): Promise<Message<boolean>> => (
		await await this._interaction.followUp(followUpOptions)
	)

	reply = async (
		replyOptions: string | InteractionReplyOptions | MessagePayload,
	): Promise<InteractionResponse<boolean>> => {
		return await this._interaction.reply(replyOptions)
	}

	deferReply = async (
		options?: InteractionDeferReplyOptions | undefined,
	): Promise<InteractionResponse<boolean>> => {
		return await this.interaction.deferReply(options)
	}

	isAdmin = (): boolean => {
		if (this._interaction.memberPermissions == null) {
			throw 'Member permissions is null'
		}
		return this._interaction.memberPermissions.has(PermissionsBitField.Flags.Administrator)
	}

	isNotAdmin = (): boolean => {
		return !this.isAdmin()
	}
}
