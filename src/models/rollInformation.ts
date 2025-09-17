export class RollInformation {
	private constructor(
		readonly diceCount: number,
		readonly dieType: number,
		readonly modifierString: string,
		readonly evaluatedModifierString: number,
		readonly values: number[],
		readonly total: number,
	) {}

	static from(
		diceCount: number,
		dieType: number,
		modifierString: string,
		evaluatedModifierString: number,
		values: number[],
		total: number,
	): RollInformation {
		if (diceCount === 0) {
			throw new Error('dieCount cannot be 0')
		}
		if (values.length === 0) {
			throw new Error('values cannot be empty')
		}

		return new RollInformation(diceCount, dieType, modifierString, evaluatedModifierString, values, total)
	}
}
