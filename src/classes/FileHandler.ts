import * as fs from 'fs'

export class FileHandler {
	private _path: string

	constructor(path: string) {
		this._path = path
	}

	public async readFile(): Promise<{}> {
		try {
			const raw = await fs.promises.readFile(this._path)
			return JSON.parse(raw.toString())
		} catch (e) {
			throw e
		}
	}

	public async writeFile(data: {}) {
		try {
			await fs.promises.writeFile(this._path, JSON.stringify(data))
		} catch (error) {
			throw error
		}
	}

	public async pathExists() {
		try {
			await fs.accessSync(this._path)
			return true
		} catch {
			return false
		}
	}
}
