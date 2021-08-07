import * as fs from 'fs'
import { Message } from 'discord.js'
import { CumCounterError } from '../errors/CumCounterError'

export class CumCounter {
    private static cumCounterFilePath = './cum-counter.json'

    private static async pathExists(path: string) {
        try {
            await fs.accessSync(path)
            return true
        } catch {
            return false;
        }
    }

    private static readFile(): {} {
        try {
            const raw = fs.readFileSync(CumCounter.cumCounterFilePath)
            return JSON.parse(raw.toString())
        } catch (e) {
            throw new CumCounterError('Error reading from file')
        }
    }

    private static async createFile(msg: Message) {
        let json = {}
        if (msg.guild?.id) {
            // @ts-ignore
            json[msg.guild?.id] = new Date()
            fs.writeFile(CumCounter.cumCounterFilePath, JSON.stringify(json), (err) => {
                if (err) {
                    throw new CumCounterError('Cannot write counter to file')
                }
            })
            await this.writeMessage(msg, `CUM DETECTED. FIRST INSTANCE LOGGED.`)
        }
        
    }

    private static checkElapsedTime(timestamp: string, currentTime: number) {
        const timeLastFound = Date.parse(timestamp)

        let timeDiff = currentTime - timeLastFound;
        timeDiff /= 1000
        return timeDiff
    }

    private static writeTimeToFile(data: {}) {
        fs.writeFile(CumCounter.cumCounterFilePath, JSON.stringify(data), (err) => {
            if (err) {
                throw new CumCounterError('Error writing time to counter file.')
            }
        })
    }

    private static async writeMessage(msgClient: Message, string: string) {
        try {
            msgClient.channel.send({content: string})
        } catch (e) { 
            throw new CumCounterError(`Error sending message to channgel: ${msgClient.channel.id}`)
        }
    }

    private static async adjustTimer(msg: Message) {
        const json = await this.readFile()
        let elapsedTime = 0
        let currentTime = new Date()
        // @ts-ignore
        if (msg.guild?.id && json[msg.guild?.id]) {
            // @ts-ignore
            elapsedTime = this.checkElapsedTime(json[msg.guild.id], currentTime)
            await this.writeMessage(msg, `CUM DETECTED. SECONDS SINCE LAST FOUND: ${elapsedTime}`)
        }
        // @ts-ignore
        json[msg.guild.id] = {
            timestamp: currentTime
        }
        // @ts-ignore
        json[msg.guild.id] = currentTime
        await this.writeTimeToFile(json)
    }

    static async Counter(msg: Message) {
        if (await this.pathExists(CumCounter.cumCounterFilePath)) {
            // read the file
            await this.adjustTimer(msg)
        } else {
            await this.createFile(msg)
        }
    }
}