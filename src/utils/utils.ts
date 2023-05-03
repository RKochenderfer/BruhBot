import { BaseInteraction, GuildTextBasedChannel, Message, TextChannel } from 'discord.js'
import { Logger } from '..'
import { DiscordInfo, InteractionLog, LogLevel, Type, UserInfo } from '../log'

export const getTimestamp = () => {
	const pad = (n: any, s = 2) => `${new Array(s).fill(0)}${n}`.slice(-s)
	const d = new Date()

	return `${pad(d.getFullYear(), 4)}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
		d.getHours(),
	)}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.${pad(d.getMilliseconds(), 3)}`
}

export const logMessage = async (
	message: Message,
	start: number,
	regexString?: string,
	error?: Error,
) => {
	const channelName = (message.channel as GuildTextBasedChannel as TextChannel).name
	await Logger.logInteraction(
		{
			logLevel: LogLevel.INFO,
			discordInfo: {
				channelId: message.channelId,
				channelName: channelName,
				guildId: message.guildId,
				guildName: message.guild?.name,
				content: message.content,
				regex: regexString == undefined ? null : regexString,
				isError: error != null,
				error: error == undefined ? null : error,
				author: {
					id: message.author.id,
					bot: message.author.bot,
					username: message.author.username,
					discriminator: message.author.discriminator,
				} as UserInfo,
			} as DiscordInfo,
			executionTime: Date.now() - start,
		} as InteractionLog,
		Type.MESSAGE,
	)
}

export const logInteraction = async (
	interaction: BaseInteraction,
	commandType: string,
	commandName: string,
	start: number,
	error?: Error,
) => {
	const channelName = (interaction.channel as GuildTextBasedChannel as TextChannel).name
	await Logger.logInteraction(
		{
			logLevel: LogLevel.INFO,
			discordInfo: {
				channelId: interaction.channelId,
				channelName: channelName,
				guildId: interaction.guildId,
				guildName: interaction.guild?.name,
				command: commandName,
				commandType: commandType,
				isError: error != undefined,
				error: error == undefined ? null : error,
				author: {
					id: interaction.user.id,
					bot: interaction.user.bot,
					username: interaction.user.username,
					discriminator: interaction.user.discriminator,
				} as UserInfo,
			} as DiscordInfo,
			executionTime: Date.now() - start,
		} as InteractionLog,
		Type.INTERACTION,
	)
}
