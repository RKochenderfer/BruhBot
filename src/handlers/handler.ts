import { Logger } from 'pino';

export default abstract class Handler {
	abstract execute(): Promise<void>
}