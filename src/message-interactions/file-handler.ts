/* eslint-disable @typescript-eslint/ban-types */
import * as fs from 'fs'

export class FileHandler {
	private _path: string

	constructor(path: string) {
		this._path = path
	}

	public async readFile(): Promise<{}> {
		const raw = await fs.promises.readFile(this._path)
		return JSON.parse(raw.toString())
	}

	public async writeFile(data: {}) {
		await fs.promises.writeFile(this._path, JSON.stringify(data))
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
