import * as mongodb from 'mongodb'

export class Database {
    private static client: mongodb.MongoClient
    private static db: mongodb.Db
    static collections: {court?: mongodb.Collection} = {}

    constructor() {}

    public async connectToDatabase() {
        Database.client = new mongodb.MongoClient(process.env.DB_CONN_STRING!)
        await Database.client.connect()
        Database.db = Database.client.db(process.env.DB_NAME!)
        Database.collections.court = Database.db.collection(process.env.COLLECTION_NAME!)
    }
}

