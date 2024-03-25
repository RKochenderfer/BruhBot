import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { ChatInputCommandInteractionWrapper } from './extensions/chat-input-command-interaction-wrapper';
import { ServerCollection } from './extensions/server-collection';

export default interface Command {
	data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">,
	execute: (interaction: ChatInputCommandInteraction | ChatInputCommandInteractionWrapper, collection?: ServerCollection) => Promise<void>
}