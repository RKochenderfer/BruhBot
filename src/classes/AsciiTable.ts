export class AsciiTable {
	private _heading: string

	constructor(heading: string) {
		this._heading = heading
	}

	render(rows: any[][]): string {
		return '`' + this.buildRows(rows) + '`'
	}

	private buildRows(data: any[][]): string {
		const colCount = data.length
		// Go through all rows
		const colWidths = this.getWidthOfColumns(data)
		const builtRows = this.buildTable(data, colWidths)

		return builtRows.join('\n')
	}

	private buildTable(data: any[][], colWidths: number[]): string[] {
		let builtRows = []
		for (let i = 0; i < data.length; i++) {
			let row = ''
			for (let j = 0; j < data[i].length; j++) {
				let initial = `| ${data[i][j]}`
				while (initial.length < colWidths[j]) {
					initial += ' '
				}
				initial += '|'
				row += initial
			}
			builtRows.push(`${row}`)
		}

		return this.splitDataHeaderRow(builtRows)
	}

	private splitDataHeaderRow(builtRows: string[]): string[] {
		const totalWidth = this.getTotalWidth(builtRows)
		const firstRow = builtRows[0]
		const modified = builtRows.slice(1)

		let splitRow = ''
		while (splitRow.length !== totalWidth) {
			splitRow += '-'
		}

		return [firstRow, splitRow, ...modified]
	}

	private getTotalWidth(builtRows: string[]) {
		return Math.max(...builtRows.map(row => row.length))
	}

	private buildHeader() {}

	private getWidthOfColumns(data: any[][]): number[] {
		let widths = []
		for (let i = 0; i < data[0].length; i++) {
			let colEntries = []
			for (let j = 0; j < data.length; j++) {
				colEntries.push(data[j][i].toString().length + 4) // the +4 includes space at beginning and end and the 2 | dividers
			}
			widths.push(Math.max(...colEntries))
		}

		return widths
	}

	private getColumnWidth(data: any[][], colNumber: number): number {
		let lengths: number[] = data.map(
			row => row[colNumber].toString().length,
		)

		return Math.max(...lengths)
	}
}
