import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction } from 'discord.js'
import { Command } from './Command'
import { Attornies } from './Court/Attornies'
import { Court } from './Court/Court'
import { Deduct } from './Court/Deduct'
import { Grant } from './Court/Grant'
import { Trial } from './Court/Trial'
import { Vote } from './Court/Vote'

export class CourtCommand extends Command {
	constructor() {
		super('court', 'handles court proceedings')
	}

	private readonly voteName = 'vote'

	private readonly voteStartName = 'start'

	private readonly voteAffirmativeName = 'yea'

	private readonly voteNegativeName = 'nay'

	private readonly grantName = 'grant'

	private readonly grantAttorneyName = 'attorney'

	private readonly grantPointsAmountName = 'points'

	private readonly deductName = 'deduct'

	private readonly deductAttorneyName = 'attorney'

	private readonly deductPointsAmountName = 'points'

	private readonly trialName = 'trial'

	private readonly trialStartName = 'start'

	private readonly trialEndName = 'end'

	private readonly setAttorneysName = 'attornies'

	private readonly setProsecutorName = 'prosecutor'

	private readonly setDefendentName = 'defendent'

	private readonly commandMap = new Map<string, Court>([
		[this.voteName, new Vote()],
        [this.trialName, new Trial()],
        [this.grantName, new Grant()],
        [this.deductName, new Deduct()],
        [this.setAttorneysName, new Attornies()]
	])

	buildCommand(): SlashCommandBuilder {
		let builder = super.buildCommand()

		// Vote commands
		builder.addSubcommandGroup(option =>
			option
				.setName(this.voteName)
				.setDescription('The vote commands')
				.addSubcommand(option =>
					option
						.setName(this.voteStartName)
						.setDescription('Starts the vote'),
				)
				.addSubcommand(option =>
					option
						.setName(this.voteAffirmativeName)
						.setDescription('Vote in favor of motion'),
				)
				.addSubcommand(option =>
					option
						.setName(this.voteNegativeName)
						.setDescription('Votes against the motion'),
				),
		)

		// Point commands
		builder.addSubcommand(option =>
			option
				.setName(this.grantName)
				.setDescription('Grants points to a mentioned attorney')
				.addMentionableOption(option =>
					option
						.setName(this.grantAttorneyName)
						.setDescription('Attorney to receive court points')
						.setRequired(true),
				)
				.addIntegerOption(option =>
					option
						.setName(this.grantPointsAmountName)
						.setDescription('The points to grant to an attorney')
						.setRequired(true),
				),
		)

		builder.addSubcommand(option =>
			option
				.setName(this.deductName)
				.setDescription('Deducts points to a mentioned attorney')
				.addMentionableOption(option =>
					option
						.setName(this.deductAttorneyName)
						.setDescription('Attorney to be deducted court points')
						.setRequired(true),
				)
				.addIntegerOption(option =>
					option
						.setName(this.deductPointsAmountName)
						.setDescription('The points to deduct from an attorney')
						.setRequired(true),
				),
		)
		// Start trial commands
		builder.addSubcommand(option =>
			option
				.setName(this.trialName)
				.setDescription('Start the court')
				.addStringOption(option =>
					option
						.setName(this.trialStartName)
						.setDescription('Starts a trial'),
				)
				.addStringOption(option =>
					option
						.setName(this.trialEndName)
						.setDescription('Ends a trial'),
				),
		)

		// attorneys
		builder.addSubcommand(option =>
			option
				.setName(this.setAttorneysName)
				.setDescription('Set the Prosecutor and Defendent')
				.addUserOption(option =>
					option
						.setName(this.setProsecutorName)
						.setDescription('Sets the prosecutor for the trial')
						.setRequired(true),
				)
				.addUserOption(option =>
					option
						.setName(this.setDefendentName)
						.setDescription('Sets the defendent for the trial')
						.setRequired(true),
				),
		)

		return builder
	}

	async execute(interaction: CommandInteraction): Promise<void> {
		const command = interaction.options.getSubcommandGroup
			? interaction.options.getSubcommandGroup.name
			: interaction.options.getSubcommand.name

        const action = this.commandMap.get(command)
        action?.performAction(interaction)
	}
}
