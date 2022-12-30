import { collections, Database } from '../db';
import Pin from './pin';

export default class Server {
	constructor(
		public name: string,
		public guildId: string,
		public pins?: Pin[]
	) {}
}

export const createOne = (collections: Database, server: Server) => {
	collections.servers?.insertOne(server)
}