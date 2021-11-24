import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction } from 'discord.js'
import { Command } from './Command'
import { Attornies } from './Court/Attornies'
import { Basics } from './Court/Basics'
import { Court } from './Court/Court'
import { Deduct } from './Court/Deduct'
import { Grant } from './Court/Grant'
import { Trial } from './Court/Trial'
import { Vote } from './Court/Vote'
import * as names from './Court/Names'

export class CourtCommand extends Command {
	private readonly commandMap = new Map<string, Court>([
		[names.voteName, new Vote()],
		[names.trialName, new Trial()],
		[names.grantName, new Grant()],
		[names.deductName, new Deduct()],
		[names.setAttorneysName, new Attornies()],
		[names.basicsName, new Basics()],
	])

	constructor() {
		super('court', 'handles court proceedings')
	}

	buildCommand(): SlashCommandBuilder {
		let builder = super.buildCommand()

		// Vote commands
		builder.addSubcommandGroup(option =>
			option
				.setName(names.voteName)
				.setDescription('The vote commands')
				.addSubcommand(option =>
					option
						.setName(names.voteStartName)
						.setDescription('Starts the vote')
						.addStringOption(option =>
							option
								.setName(names.trialId)
								.setDescription('The trial ID')
								.setRequired(true)
						)
				)
				.addSubcommand(option =>
					option
						.setName(names.voteEndName)
						.setDescription('Ends the vote')
						.addStringOption(option =>
							option
								.setName(names.trialId)
								.setDescription('The trial ID')
								.setRequired(true)
						)
				)
				.addSubcommand(option =>
					option
						.setName(names.voteAffirmativeName)
						.setDescription('Vote in favor of motion')
						.addStringOption(option =>
							option
								.setName(names.trialId)
								.setDescription('The trial ID')
								.setRequired(true),
						),
				)
				.addSubcommand(option =>
					option
						.setName(names.voteNegativeName)
						.setDescription('Votes against the motion')
						.addStringOption(option =>
							option
								.setName(names.trialId)
								.setDescription('The trial ID')
								.setRequired(true),
						),
				),
		)

		// Start trial commands
		builder.addSubcommandGroup(option =>
			option
				.setName(names.trialName)
				.setDescription('Start the court')
				.addSubcommand(option =>
					option
						.setName(names.trialStartName)
						.setDescription('Starts a trial')
						.addStringOption(option =>
							option
								.setName(names.trialDescriptionName)
								.setDescription(
									'The description of what the trial is about',
								)
								.setRequired(true),
						),
				)
				.addSubcommand(option =>
					option
						.setName(names.trialEndName)
						.setDescription('Ends a trial')
						.addStringOption(option =>
							option
								.setName(names.trialVerdictName)
								.setDescription('The verdict of the trial')
								.setRequired(true),
						),
				)
				.addSubcommand(option =>
					option
						.setName(names.trialNewJudgeName)
						.setDescription(
							'Randomly assigns a new judge to the trial',
						)
						.addStringOption(option =>
							option
								.setName(names.trialId)
								.setDescription(
									'The ID of the trial to be assigned a new judge',
								)
								.setRequired(true),
						),
				)
				.addSubcommand(option =>
					option
						.setName(names.trialAssignJudgeName)
						.setDescription(
							'Assigns the judge position to a specific user',
						)
						.addUserOption(option =>
							option
								.setName(names.trialJudgeName)
								.setDescription(
									'The user to be assigned to judge position',
								)
								.setRequired(true),
						)
						.addStringOption(option =>
							option
								.setName(names.trialId)
								.setDescription(
									'The ID of the trial to be assigned a new judge',
								)
								.setRequired(true),
						),
				),
		)

		// Point commands
		builder.addSubcommand(option =>
			option
				.setName(names.grantName)
				.setDescription('Grants points to a mentioned attorney')
				.addMentionableOption(option =>
					option
						.setName(names.grantAttorneyName)
						.setDescription('Attorney to receive court points')
						.setRequired(true),
				)
				.addIntegerOption(option =>
					option
						.setName(names.grantPointsAmountName)
						.setDescription('The points to grant to an attorney')
						.setRequired(true),
				),
		)

		builder.addSubcommand(option =>
			option
				.setName(names.deductName)
				.setDescription('Deducts points to a mentioned attorney')
				.addMentionableOption(option =>
					option
						.setName(names.deductAttorneyName)
						.setDescription('Attorney to be deducted court points')
						.setRequired(true),
				)
				.addIntegerOption(option =>
					option
						.setName(names.deductPointsAmountName)
						.setDescription('The points to deduct from an attorney')
						.setRequired(true),
				),
		)
		// attorneys
		builder.addSubcommand(option =>
			option
				.setName(names.setAttorneysName)
				.setDescription('Set the Prosecutor and Defendent')
				.addStringOption(option =>
					option
						.setName(names.trialId)
						.setDescription('The trial id')
						.setRequired(true),
				)
				.addUserOption(option =>
					option
						.setName(names.setProsecutorName)
						.setDescription('Sets the prosecutor for the trial')
						.setRequired(true),
				)
				.addUserOption(option =>
					option
						.setName(names.setDefendentName)
						.setDescription('Sets the defendent for the trial')
						.setRequired(true),
				),
		)

		builder.addSubcommand(option =>
			option
				.setName(names.basicsName)
				.setDescription('Replies with the basics of hog court'),
		)

		return builder
	}

	async execute(interaction: CommandInteraction): Promise<void> {
		interaction.deferReply()
		let command = ''
		try {
			command = interaction.options.getSubcommandGroup()
		} catch (ex) {
			command = interaction.options.getSubcommand()
		}

		if (command === '') {
			interaction.followUp({ content: 'There was an error somewhere' })
		}

		const action = this.commandMap.get(command)
		// interaction.followUp({ content: 'Received' })
		action?.performAction(interaction)
	}
}
