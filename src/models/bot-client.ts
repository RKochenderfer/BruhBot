import { Client, Collection } from 'discord.js'

export default class BotClient extends Client {
	commands?: Collection<unknown, unknown>
}