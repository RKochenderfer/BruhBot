import pino from 'pino'

const transport = pino.transport({
	target: 'pino-mongodb',
	options: {
		uri: process.env.MONGODB_CONNSTRING,
		database: 'bruhbot',
		collection: 'logs',
		mongoOptions: {
			auth: {
				username: process.env.MONGO_USERNAME,
				password: process.env.MONGO_PASSWORD,
			},
		},
	},
})

export const logger = pino(transport)
