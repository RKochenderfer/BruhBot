import { Collection, Db, MongoClient } from 'mongodb'
import { logger } from './index'
import { Log } from './log'

export const collections: { servers?: Collection } = {}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const connect = async () => {
	try {
		const client = new MongoClient(process.env.MONGODB_CONNSTRING!)

		await client.connect()

		const db = client.db(process.env.MONGO_INITDB_DATABASE!)
		const serversCollection = db.collection('servers')
		collections.servers = serversCollection

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

export const insertLog = (log: Log, db: Db) => {
	try {
		const result = collections.servers?.insertOne(log)

		if (result) {
			console.log('created')
		} else {
			console.log('failed')
		}
	} catch (error) {
		console.error(error)
	}
}
