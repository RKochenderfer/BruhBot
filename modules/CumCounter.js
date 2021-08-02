const { promises: Fs } = require('fs')
class CumCounter {
    static #cumCounterFilePath = './cum-counter.json'

    static async #pathExists(path) {
        try {
            await Fs.access(path)
            return true
        } catch {
            return false;
        }
    }

    static async #ReadFile() {
        const raw = await Fs.readFile(this.#cumCounterFilePath)

        let json = {}
        try {
            json = JSON.parse(raw)
        } catch (e) {
            throw new CumCounterError(e)
        }

        return json
    }

    static async #CreateFile() {

    }

    /**
     *
     * @param msg {Message}
     * @returns {Promise<void>}
     * @constructor
     */
    static async #AdjustTimer(msg) {
        const json = this.#ReadFile()
        if (msg.guild.id in json) {
            const thisServer = msg.guild.id;
            const timeLastFound = json.timestamp


        } else {
            json[msg.guild.id] = {
                timestamp: Date.now()
            }
        }
    }

    /**
     *
     * @param msg {Message}
     * @returns {Promise<void>}
     * @constructor
     */
    static async Counter(msg) {
        if (await this.#pathExists(CumCounter.#cumCounterFilePath)) {
            // read the file
            await this.#AdjustTimer()
        } else {
            await this.#CreateFile()
        }
    }
}

module.exports = CumCounter