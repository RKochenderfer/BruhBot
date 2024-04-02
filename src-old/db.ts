import { Collection, MongoClient } from 'mongodb'
import Server from './models/server'
import { logger } from './utils/logger'
import { ServerCollection } from './extensions/server-collection'

export type Database = {
	servers?: ServerCollection
	/* eslint-disable @typescript-eslint/no-explicit-any */
	logs?: Collection<any>
}

/**
 * The connections to the collections in the database
 */
export const collections: Database = {}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const connect = async (): Promise<Database> => {
	const client = new MongoClient(process.env.MONGODB_CONNSTRING!)

	await client.connect()

	const db = client.db(process.env.MONGO_INITDB_DATABASE!)
	const serversCollection = ServerCollection.from(db.collection('servers') as Collection<Server>)
	/* eslint-disable @typescript-eslint/no-explicit-any */
	const logsCollection = db.collection('logs') as Collection<any>
	collections.servers = serversCollection
	collections.logs = logsCollection

	return collections
}

export const connectToDatabase = async (): Promise<Database> => {
	for (let i = 0; i < 5; i++) {
		try {
			return await connect()
		} catch (error) {
			await sleep(1000)	
		}
	}

	throw new Error('Unable to connect to db')
}
