import FlaggedPattern from '../message-checker/flagged-pattern'
import Pin from './pin'

export default interface Server {
	name: string,
	guildId: string,
	pins?: Pin[],
	flaggedPatterns?: FlaggedPattern[],
}
