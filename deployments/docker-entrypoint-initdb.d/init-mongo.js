print('#################### START ####################');
db = db.getSiblingDB('bruhbot');
db.createUser({
	user: 'bruhbot',
	pwd: 'password',
	roles: [
		{
			role: 'readWrite',
			db: 'bruhbot',
		},
	],
});

db.createCollection('servers', { capped: false });
db.servers.createIndex({ name: 1 });
db.createCollection('logs');
db.logs.createIndex({ _id: -1 });
db.logs.createIndex({ type: 1 });
db.logs.createIndex({ guildId: 1 });
print('#################### END ####################');