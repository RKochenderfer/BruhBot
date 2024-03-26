import { Collection, MongoClient } from 'mongodb'
import Server from './models/server'
import { logger } from './utils/logger'
import { ServerCollection } from './extensions/server-collection'
import { CpuInfo } from 'os'

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

const connect = async () => {
	try {
		const client = new MongoClient(process.env.MONGODB_CONNSTRING!)

		await client.connect()

		const db = client.db(process.env.MONGO_INITDB_DATABASE!)
		const serversCollection = ServerCollection.from(db.collection('servers') as Collection<Server>)
		/* eslint-disable @typescript-eslint/no-explicit-any */
		const logsCollection = db.collection('logs') as Collection<any>
		collections.servers = serversCollection
		collections.logs = logsCollection

		return true
	} catch (error) {
		logger.error(error)
		return false
	}
}

export const connectToDatabase = async () => {
	for (let i = 0; i < 5; i++) {
		if (await connect()) return
		await sleep(1000)
	}

	throw new Error('Unable to connect to db')
}
