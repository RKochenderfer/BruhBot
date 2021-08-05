const fs = require('fs')

/**
 * Character representation in initiative:
 * {
 *     userId: #########,
 *     initiative: ##
 * }
 */

class RoundTracker {
	static roundTrackerStatus = new Map([
		[
			'start',
			{
				'desc': 'Starts a new initiative tracker.',
				func: (msg, initiative) => this.#reset(msg, initiative)
			}
		],
		[
			'reset',
			{
				'desc': 'Resets the initiative tracker.',
				func: (msg, initiative) => this.#reset(msg, initiative)
			}
		],
		[
			'show',
			{
				'desc': 'Shows the initiative order and the current entry\'s turn',
				func: (msg, initiative) => this.#show(msg, initiative)
			}
		],
		[
			'next',
			{
				'desc': 'Shift the initiative to the next entry',
				func: (msg, initiative) => this.#next(msg, initiative)
			}
		],
		[
			'help',
			{
				'desc': 'Lists all the commands for the round tracker',
				func: (msg, _initiative) => this.#help(msg)
			}
		]
	])

	static roundTrackerEdit = new Map([
		[
			'add',
			{
				'desc': 'Adds an entry to the initiative tracker',
				func: (msg, initiative, args) => this.#add(msg, initiative, args)
			}
		],
		[
			'remove',
			{
				'desc': 'Removes an entry to the initiative tracker',
				func: (msg, initiative, args) => this.#remove(msg, initiative, args)
			}
		],
		[
			'edit',
			{
				'desc': 'Edits an entry to the initiative tracker',
				func: (msg, initiative, args) => this.#edit(msg, initiative, args)
			}
		],
	])

	/**
	 * Sorts an initiative array
	 * @param a
	 * @param b
	 * @returns {number}
	 */
	static #initiativeSort(a, b) {
		if (a.initiative < b.initiative) {
			return 1
		} else if (a.initiative > b.initiative) {
			return -1
		} else {
			return 0
		}
	}

	/**
	 * Resets the initiative tracker
	 * @param msg
	 * @param initiative
	 */
	static #reset(msg, initiative) {
		initiative.entries = []
		initiative['current-index'] = 0
		fs.writeFileSync(process.env.INITIATIVE_PATH, JSON.stringify(initiative))
	}

	/**
	 * Adds a new entry to the initiative tracker
	 * @param msg
	 * @param initiative
	 * @param args
	 */
	static #add(msg, initiative, args) {
		if (args.length === 3) {
			// This is so a user can just do `!initiative add 20` and it apply to the user
			initiative.entries.push({'user_id': msg.author.id, initiative: args[2]})
		} else if (args.length === 4) {
			// This is so a user can do `!initiative add goblin-2 10`
			initiative.entries.push({'user_id': args[2], initiative: args[3]})
		} else {
			return
		}
		initiative.entries.sort(this.#initiativeSort)
		fs.writeFileSync(process.env.INITIATIVE_PATH, JSON.stringify(initiative))
	}

	/**
	 * Removes an entry from the initiative tracker
	 * @param msg
	 * @param initiative
	 * @param args
	 */
	static #remove(msg, initiative, args) {
		if (args.length > 1) {
			const id = (args.length === 2) ? msg.author.id : args[2]
			const toRemove = initiative.entries.findIndex(u => u.user_id === id)
			if (toRemove > -1) {
				initiative.entries.splice(toRemove, 1)
			} else {
				msg.channel.send(`${msg.author} was not found in the initiative.`)
				return
			}
			fs.writeFileSync(process.env.INITIATIVE_PATH, JSON.stringify(initiative))
		}
	}

	/**
	 * Edits an entry in the initiative tracker
	 * @param msg
	 * @param initiative
	 * @param args
	 */
	static #edit(msg, initiative, args) {
		// Make sure args are valid length
		if (args.length > 2 && args.length < 5) {
			// Check to see if this is for a player or for a npc
			const id = (args.length === 3) ? msg.author.id : args[2]
			const toEdit = initiative.entries.findIndex(u => u.id === id)
			if (args.length === 3) {
				initiative.entries[toEdit].initiative = args[2]
				msg.channel.send(`${msg.author}'s initiative was updated to ${args[2]}`)
			} else if (args.length === 4) {
				initiative.entries[toEdit].initiative = args[3]
				msg.channel.send(`${args[2]}'s initiative was updated to ${args[3]}`)
			}
			initiative.entries.sort(this.#initiativeSort)
			fs.writeFileSync(process.env.INITIATIVE_PATH, JSON.stringify(initiative))
		}
	}

	/**
	 * Shows all entries in the initiative tracker
	 * @param msg
	 * @param initiative
	 */
	static async #show(msg, initiative) {
		if (initiative.entries.length === 0) {
			msg.channel.send('The initiative order is empty')
		} else {
			const entries = initiative.entries.map(u => u.user_id)
			let builder = ''
			for (let i = 0; i < entries.length; i++) {
				if (isNaN(entries[i])) {
					builder += `${entries[i]}`
				} else {
					const user = msg.guild.members.cache.get(entries[i])
					builder += `${user.nickname}`
				}

				if (i < entries.length - 1) {
					builder += ', '
				}
			}

			msg.channel.send(`Initiative order: ${builder}`)
		}
	}

	/**
	 * Shows the next person in the initiative order
	 * @param msg
	 * @param initiative
	 */
	static #next(msg, initiative) {
		let turn

		initiative['current-index']++
		if (initiative['current-index'] >= initiative.entries.length) initiative['current-index'] = 0

		if (isNaN(initiative.entries[initiative['current-index']].user_id)) {
			turn = initiative.entries[initiative['current-index']].user_id
		} else {
			const user = msg.guild.members.cache.get(initiative.entries[initiative['current-index']].user_id)
			turn = `${user.nickname}`
		}

		msg.channel.send(`It is now ${turn}'s turn.`)
		fs.writeFileSync(process.env.INITIATIVE_PATH, JSON.stringify(initiative))
	}

	static #helpBuilder(iter) {
		let str = ''

		for (const item of iter) {
			str += `> \`${item[0]}\`: ${item[1].desc}\n`
		}

		return str
	}

	/**
	 * Presents all commands for RoundTracker
	 * @param msg
	 */
	static #help(msg) {
		let help = ''
		const iterStatus = this.roundTrackerStatus[Symbol.iterator]()
		const iterEdits = this.roundTrackerEdit[Symbol.iterator]()

		help += this.#helpBuilder(iterStatus)
		help += this.#helpBuilder(iterEdits)

		msg.channel.send(`${help}`)
	}

	/**
	 * Handles arguments for the initiative tracker
	 * @param msg
	 */
	static initiativeTracker(msg) {
		const args = msg.content.split(' ')
		let raw = fs.readFileSync(process.env.INITIATIVE_PATH)
		let initiative = JSON.parse(raw)

		if (args.length > 0) {
			// Delete all entries in initiative array
			let method = this.roundTrackerStatus.get(args[1])
			// If there is no status method for args[1] check action methods
			if (method === undefined) {
				method = this.roundTrackerEdit.get(args[1])
				// If the method exists perform it
				if (method !== undefined) {
					method.func(msg, initiative, args)
				}
			} else {
				method.func(msg, initiative)
			}
		}
	}
}

module.exports = RoundTracker