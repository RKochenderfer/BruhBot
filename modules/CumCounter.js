const CumCounterError = require('../errors/CumCounterError')

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

    static async #CreateFile(msg) {
        // TODO: FINISH ME
        let json = {}
        json[msg.guild.id] = new Date()
        try {
            await Fs.writeFile(this.#cumCounterFilePath, JSON.stringify(json))
        } catch (e) {
            throw new CumCounterError(`Error creating cum_counter.json: ${e}`)
        }
        await this.#WriteMessage(msg, `CUM DETECTED. FIRST INSTANCE LOGGED.`)
    }

    static #CheckElapsedTime(timestamp, currentTime) {
        const timeLastFound = Date.parse(timestamp)

        let timeDiff = currentTime - timeLastFound;
        timeDiff /= 1000
        return timeDiff
    }

    static async #WriteTimeToFile(data) {
        try {
            await Fs.writeFile(this.#cumCounterFilePath, JSON.stringify(data))   
        } catch (e) {
            throw new CumCounterError(`Could not write to file: ${e}`)
        }
    }

    /**
     * 
     * @param {Message} msgClient 
     * @param {number} elapsedTime 
     */
    static async #WriteMessage(msgClient, string) {
        try {
            msgClient.channel.send(string)
        } catch (e) { 
            throw new CumCounterError(`Error sending message to channgel: ${msgClient.channel.id}`)
        }
    }

    /**
     *
     * @param msg {Message}
     * @returns {Promise<void>}
     * @constructor
     */
    static async #AdjustTimer(msg) {
        const json = await this.#ReadFile()
        let elapsedTime = 0
        let currentTime = new Date()
        if (json[msg.guild.id]) {
            elapsedTime = this.#CheckElapsedTime(json[msg.guild.id], currentTime)
            await this.#WriteMessage(msg, `CUM DETECTED. SECONDS SINCE LAST FOUND: ${elapsedTime}`)
        }
        json[msg.guild.id] = {
            timestamp: currentTime
        }
        json[msg.guild.id] = currentTime
        await this.#WriteTimeToFile(json)
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
            await this.#AdjustTimer(msg)
        } else {
            await this.#CreateFile(msg)
        }
    }
}

module.exports = CumCounter