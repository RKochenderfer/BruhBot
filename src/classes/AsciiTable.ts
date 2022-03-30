// Reference https://github.com/sorensen/ascii-table/blob/master/ascii-table.js

export enum Align {
	Left,
	Center,
	Right,
	Auto,
}

export interface TableOptions {
	name: string
	nameAlign: Align
	rows: []
	maxCells: number
	aligns: []
	colMaxes: []
	spacing: number
	headingAlign: Align
	heading: string | null
	border: boolean
    edge: string
    fill: string
    top: string
    bottom: string
}

export class TableOptionsBuilder {
    static default(): TableOptions {
        return {
            name: '',
            nameAlign: Align.Center,
            rows: [],
            maxCells: 0,
            aligns: [],
            colMaxes: [],
            spacing: 0,
            headingAlign: Align.Center,
            heading: null,
            border: true,
            edge: '|',
            fill: '-',
            top: '.',
            bottom: "'"
        } as TableOptions
    }
}

export class AsciiTable {
	private name: string
	private options: TableOptions
    private border = false

	constructor(name: string, options?: TableOptions) {
		this.name = name
		this.options = options ? options : ({} as TableOptions)
	}

	static align(
		direction: Align,
		inputString: string,
		stringLength: number,
		paddingChar?: string | undefined,
	): string {
		switch (direction) {
			case Align.Left:
				return this.alignLeft(inputString, stringLength, paddingChar)
			case Align.Right:
				return this.alignRight(inputString, stringLength, paddingChar)
			case Align.Center:
				return this.alignCenter(inputString, stringLength, paddingChar)
			default:
				return this.alignAuto(inputString, stringLength, paddingChar)
		}
	}

	static alignAuto(
		inputString: string,
		stringLength: number,
		paddingChar?: string | undefined,
	): string {
		if (inputString === undefined || inputString === null) inputString = ''
		var type = toString.call(inputString)
		paddingChar || (paddingChar = ' ')
		stringLength = +stringLength
		if (type !== '[object String]') {
			inputString = inputString.toString()
		}
		if (inputString.length < stringLength) {
			switch (type) {
				case '[object Number]':
					return this.alignRight(
						inputString,
						stringLength,
						paddingChar,
					)
				default:
					return this.alignLeft(
						inputString,
						stringLength,
						paddingChar,
					)
			}
		}
		return inputString
	}

	static alignCenter(
		inputString: string,
		stringLength: number,
		paddingChar?: string | undefined,
	): string {
		if (!stringLength || stringLength < 0) {
			return ''
		}
		if (inputString === undefined || inputString === null) {
			inputString = ''
		}
		if (typeof paddingChar === 'undefined') {
			paddingChar = ' '
		}

		var nLen = inputString.length,
			half = Math.floor(stringLength / 2 - nLen / 2),
			odds = Math.abs((nLen % 2) - (stringLength % 2)),
			stringLength = inputString.length

		return (
			this.alignRight('', half, paddingChar) +
			stringLength +
			this.alignLeft('', half + odds, paddingChar)
		)
	}

	static alignRight(
		inputString: string,
		stringLength: number,
		paddingChar?: string | undefined,
	): string {
		if (!stringLength || stringLength < 0) {
			return ''
		}
		if (inputString === undefined || inputString === null) {
			inputString = ''
		}
		if (typeof paddingChar === 'undefined') {
			paddingChar = ' '
		}
		var alen = stringLength + 1 - inputString.length
		if (alen <= 0) return inputString

		return (
			Array(stringLength + 1 - inputString.length).join(paddingChar) +
			inputString
		)
	}

	static alignLeft(
		inputString: string,
		stringLength: number,
		paddingChar?: string | undefined,
	): string {
		if (!stringLength || stringLength < 0) {
			return ''
		}
		if (inputString === undefined || inputString === null) {
			inputString = ''
		}
		if (typeof paddingChar === 'undefined') {
			paddingChar = ' '
		}

		const alen = stringLength + 1 - inputString.length
		if (alen <= 0) return inputString

		return (
			inputString +
			Array(stringLength + 1 - inputString.length).join(paddingChar)
		)
	}

	/**
	 * Fill an array at a given size with the given fill value
	 * @param stringLength
	 * @param fillVal
	 */
	static arrayFill(stringLength: number, fillVal: any) {
		const array = new Array(stringLength)
		for (var i = 0; i !== stringLength; i++) {
			array[i] = fillVal
		}

		return array
	}

	private clear(name: string): TableOptions { // TODO: Pick up from here. This is the clear on line 191
		const options = TableOptionsBuilder.default()

		if (toString.call(name) === '[object String]') {
			this.name = name
		}

        return options
	}
}
