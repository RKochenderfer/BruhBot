import { Message, REST, Routes } from 'discord.js'
import { Logger } from 'pino'
import CommandRegister from '../commandRegister'

export class CommandUpdaterService {
	constructor(private logger: Logger, private commandRegistry: CommandRegister) {}

	/**
	 * Updates the / commands for a guild
	 */
	async updateCommands(message: Message) {
		this.logger.info(`Updating commands for guild: ${message.guildId}`)
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const commands: any[] = []
		const rest = new REST({ version: '10' }).setToken(process.env.TOKEN!)

		try {
			for (let commandJSON of this.commandRegistry.generateCommandDataJSON()) {
				commands.push(commandJSON)
				this.logger.debug(commandJSON)
			}
			this.logger.info(`Started refreshing ${commands.length} application (/) commands`)

			if (!message.guildId) return

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const data: any = await rest.put(
				Routes.applicationGuildCommands(process.env.CLIENT_ID!, message.guildId),
				{ body: commands },
			)
			this.logger.info(`Successfully reloaded ${data.length} application (/) commands`)
		} catch (error) {
			message.reply({ content: 'Failed to update commands' })
			this.logger.error(error)
		}
	}
}
