export class User {
	private constructor(public readonly id: string, public readonly username: string) {}

	static from(id: string, username: string): User {
		if (!id) {
			throw new Error('User ID cannot be empty')
		}
		if (!username) {
			throw new Error('Username cannot be empty')
		}
		return new User(id, username)
	}
}
