import { Collection, Db, MongoClient } from 'mongodb'
import { logger } from './index'
import { InteractionLog } from './log'
import Log from './models/log'
import Server from './models/server'

export const collections: { servers?: Collection<Server>; logs?: Collection<Log> } =
	{}

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

export const insertLog = (log: Log) => {
	try {
		collections.logs?.insertOne(log)
	} catch (error) {
		console.error(error)
	}
}

export const addPins = (guildId: string, message: string) => {
	const query = { guildId: guildId }
	collections.servers?.updateOne(query, {})
}