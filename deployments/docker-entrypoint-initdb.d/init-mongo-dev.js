print('#################### START ####################')
db = db.getSiblingDB('bruhbot')
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
db.createCollection('logs');
print('#################### END ####################')