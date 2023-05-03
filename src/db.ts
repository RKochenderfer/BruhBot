import { Collection, Db, MongoClient } from 'mongodb'
import Log from './models/log'
import Server from './models/server'

export type Database = {
	servers?: Collection<Server>
	logs?: Collection<Log>
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
		const serversCollection = db.collection('servers') as Collection<Server>
		const logsCollection = db.collection('logs') as Collection<Log>
		collections.servers = serversCollection
		collections.logs = logsCollection

		return true
	} catch (error) {
		console.error(error)
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

export const insertLog = async (log: Log) => {
	try {
		await collections.logs?.insertOne(log)
	} catch (error) {
		console.error(error)
	}
}

export const addPins = (guildId: string, message: string) => {
	const query = { guildId: guildId }
	collections.servers?.updateOne(query, {})
}
