import FlaggedPattern from '../message-checker/flaggedPattern'
import Pin from './pin'

export default interface Guild {
	name: string
	guildId: string
	pins?: Pin[]
	flaggedPatterns?: FlaggedPattern[]
}
