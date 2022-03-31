// Reference https://github.com/sorensen/ascii-table/blob/master/ascii-table.js

export enum Align {
	Left,
	Center,
	Right,
	Auto,
}

export class AsciiTable {
	private name: string
	private nameAlign: Align
	private rows: any[]
	private maxCells: number
	private aligns: Align[]
	private colMaxes: any
	private spacing: number
	private headingAlign: Align
	private heading: string | null
	private border: boolean
	private edge: string
	private fill: string
	private top: string
	private bottom: string
	private justify: boolean

	constructor(name?: string) {
		this.name = name || ''
		this.nameAlign = Align.Center
		this.rows = []
		this.maxCells = 0
		this.aligns = []
		this.colMaxes = []
		this.spacing = 0
		this.headingAlign = Align.Center
		this.heading = null
		this.border = true
		this.edge = '|'
		this.fill = '-'
		this.top = '.'
		this.bottom = "'"
		this.justify = false
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

	default() {
		this.name = ''
		this.nameAlign = Align.Center
		this.rows = []
		this.maxCells = 0
		this.aligns = []
		this.colMaxes = []
		this.spacing = 0
		this.headingAlign = Align.Center
		this.heading = null
		this.border = true
		this.edge = '|'
		this.fill = '-'
		this.top = '.'
		this.bottom = "'"
	}

	private clear(name: string) {
		// TODO: Pick up from here. This is the clear on line 191
		const options = this.default()

		if (toString.call(name) === '[object String]') {
			this.name = name
		}
	}

	/**
	 * Sets the table border
	 * @param edge
	 * @param fill
	 * @param top
	 * @param bottom
	 */
	setBorer(edge?: string, fill?: string, top?: string, bottom?: string) {
		this.border = true

		this.edge = edge || '|'
		this.fill = fill || '-'
		this.top = top || '.'
		this.bottom = bottom || "'"
	}

	/**
	 * Removes the table border
	 */
	removeBorder() {
		this.border = false
		this.edge = ' '
		this.fill = ' '
	}

	/**
	 * Adds row to table
	 * @param row
	 */
	addRow(row: any[]) {
		this.maxCells = Math.max(this.maxCells, row.length)
		this.rows.push(row)
	}

	/**
	 * 
	 * @returns The rows
	 */
	getRows() {
		return this.rows.slice().map(row => row.slice())
	}

	/**
	 * Adds a row matrix to rows
	 * @param rows 
	 */
	addRowMatrix(rows: any[]) {
		for (let i = 0; i < rows.length; i++) {
			this.addRow(rows[i])
		}
	}

	addData(data: any[], rowCallback: any, asMatrix: boolean) {
		for (let index = 0, limit = data.length; index < limit; index++) {
			let row = rowCallback(data[index])
			if (asMatrix) {
				this.addRowMatrix(row)
			} else {
				this.addRow(row)
			}
		}
	}

	clearRows() {
		this.rows = []
		this.maxCells = 0
		this.colMaxes = []
	}

	setJustify(val: boolean) {
		this.justify = val
	}

	render() {
		let self = this,
			body = [],
			mLen = this.maxCells,
			max = AsciiTable.arrayFill(mLen, 0),
			total = mLen * 3,
			rows = this.rows,
			justify = 0,
			border = this.border,
			all = this.heading ? [this.heading].concat(rows) : rows

		// Calculate max table cell lengths across all rows
		for (var i = 0; i < all.length; i++) {
			var row = all[i]
			for (var k = 0; k < mLen; k++) {
				var cell = row[k]
				max[k] = Math.max(max[k], cell ? cell.toString().length : 0)
			}
		}
		this.colMaxes = max
		justify = this.justify ? Math.max.apply(null, max) : 0

		// Get
		max.forEach(function (x) {
			total += justify ? justify : x + self.spacing
		})
		justify && (total += max.length)
		total -= this.spacing

		// Heading
		border && body.push(this.separator(total - mLen + 1, this.top))
		if (this.name) {
			body.push(this.renderTitle(total - mLen + 1))
			border && body.push(this.separator(total - mLen + 1))
		}
		if (this.heading) {
			body.push(this.renderRow(this.heading, ' ', this.headingAlign))
			body.push(this.rowSeperator(mLen, this.fill))
		}
		for (var i = 0; i < this.__rows.length; i++) {
			body.push(this.renderRow(this.rows[i], ' '))
		}
		border && body.push(this.separator(total - mLen + 1, this.bottom))

		var prefix = this.options.prefix || ''
		return prefix + body.join('\n' + prefix)
	}

	private separator(length: number, sideValue?: string): string {
		sideValue || (sideValue = this.edge)

		return sideValue + AsciiTable.alignRight(sideValue, length, this.fill)
	}

	private rowSeparator() {
		const blanks = AsciiTable.arrayFill(this.maxCells, this.fill)

		return this.renderRow(blanks, this.fill)
	}

	private renderTitle(length: number): string {

	}

	private renderRow() {

	}
}
