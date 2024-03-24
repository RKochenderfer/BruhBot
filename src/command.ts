import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { ChatInputCommandInteractionWrapper } from './extensions/chat-input-command-interaction-wrapper';
import { Database } from './db';

export default interface Command {
	data: SlashCommandBuilder,
	execute: (interaction: ChatInputCommandInteraction | ChatInputCommandInteractionWrapper, collections?: Database) => Promise<void>
}