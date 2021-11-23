import { CacheType, CommandInteraction } from 'discord.js'
import { Court } from './Court'

export class Basics implements Court {
	async performAction(interaction: CommandInteraction): Promise<void> {
		interaction.reply(`
        You are rewarded and docked court points depending on actions you take
You can use those court points for upgrades for instance the prosecution can spend five court points to get a Glock to just shoot the defense attorney.
The defense attorney can use five points to get a bulletproof shield that he can bludgeon the prosecuting attorney with
Anyone on the defense can claim a kangaroo court once per trial.
At which point a herd of untamed kangaroos will be unleashed upon the courtroom
As the presiding judge you have the ability to reshape reality to your whims. However you do have to put on an old woman's power suit powdered wig and makeup to also be the court stenographer
        `)
	}
}
