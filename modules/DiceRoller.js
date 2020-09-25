class DiceRoller {
	/**
	 * Returns a random integer between min (inclusive) and max (inclusive).
	 * The value is no lower than min (or the next integer greater than min
	 * if min isn't an integer) and no greater than max (or the next integer
	 * lower than max if max isn't an integer).
	 * Using Math.round() will give you a non-uniform distribution!
	 */
	static #getRandomInt(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	static #getRoll(type) {
		switch (type) {
			case 'd100':
				return this.#getRandomInt(1, 100)
			case 'd20':
				return this.#getRandomInt(1, 20)
			case 'd12':
				return this.#getRandomInt(1, 12)
			case 'd10':
				return this.#getRandomInt(1, 10)
			case 'd8':
				return this.#getRandomInt(1, 8)
			case 'd6':
				return this.#getRandomInt(1, 6)
			case 'd4':
				return this.#getRandomInt(1, 4)
			default:
				return null
		}
	}

	/**
	 * Rolls n = `count` dice of type = `type`
	 * @param msg
	 * @param count
	 * @param type
	 * @returns {[]}
	 */
	static roll(msg, count, type) {
		let values = []
		for (let i = 0; i < count; i++) {
			let val = this.#getRoll(type)
			if (val !== null) {
				values.push(this.#getRoll(type))
			} else {
				return null
			}
		}

		return values
	}
}

module.exports = DiceRoller