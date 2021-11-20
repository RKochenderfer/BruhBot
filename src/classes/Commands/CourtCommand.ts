import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction } from 'discord.js'
import { Command } from './Command'

export class CourtCommand extends Command {
    private static startName = 'start'
    private static voteName = 'vote'
    private static givePointName = 'give'
    private static deductPointName = 'deduct'

	constructor() {
		super('court', 'handles court proceedings')
	}

	buildCommand(): SlashCommandBuilder {
		let builder = super.buildCommand()

        builder.addSubcommand(option =>
            option.setName(CourtCommand.startName)
            .setDescription('Starts the court proceedings')
        )

        return builder
	}

	execute(interaction: CommandInteraction): Promise<void> {
		throw new Error('Method not implemented.')
	}
}
