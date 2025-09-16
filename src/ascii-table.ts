export class RenderRequest {
	private constructor(readonly headers: string[], readonly dataRows: string[][]) {}

	static from(headers: string[], dataRows: string[][]) {
		if (headers.length === 0) {
			throw new Error('Headers cannot be empty')
		}
		if (dataRows.length === 0) {
			throw new Error('dataRows cannot be empty')
		}
		dataRows.forEach(dataRow => {
			if (headers.length > dataRow.length) {
				throw new Error('There are more headers than columns in the data row')
			}
			if (dataRow.length !== headers.length) {
				throw new Error('Every data row must have a header')
			}
		})

		return new RenderRequest(headers, dataRows)
	}
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export class AsciiTable {
	/** This is the extra space to account for the paddings and the dividers */
	private readonly _extraSpaceForEachColumn = 4
	/**
	 * Render table
	 * @param rows Data to be entered. First row is the column headers
	 * @returns
	 */
	render(rows: any[][]): string {
		return '`' + this.buildRows(rows) + '`'
	}

	renderRequest(request: RenderRequest): string {
		const columnWidths = this.calculateColumnWidths(request)
		const tableRows = []
		const headerRow = this.buildRow(request.headers, columnWidths)
		tableRows.push(headerRow)

		request.dataRows.forEach(dataRow => {
			const stringDataRow = this.buildRow(dataRow, columnWidths)
			tableRows.push(stringDataRow)
		})

		return tableRows.join('\n')
	}

	private buildRow(data: string[], columnWidths: number[]): string {
		if (data.length !== columnWidths.length) {
			throw new Error('Data length and column width length does not match')
		}

		let row = ''
		// iterate through each data element
		for (let i = 0; i < data.length; i++) {
			let columnString = `| ${data[i]}`
			// add spaces to the column data until it reaches the column width
			while (columnString.length < columnWidths[i]) {
				columnString += ' '
			}
			columnString += '|'
			row += columnString
		}

		return row
	}

	private buildRows(data: any[][]): string {
		// Go through all rows
		const colWidths = this.getWidthOfColumns(data)
		const builtRows = this.buildTable(data, colWidths)

		return builtRows.join('\n')
	}

	private buildTable(data: any[][], colWidths: number[]): string[] {
		const builtRows = []
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

	/**
	 * Calculates the required column width to nicely display the data
	 * @param request
	 * @returns
	 */
	private calculateColumnWidths(request: RenderRequest): number[] {
		const widths: number[] = []
		// get the width to display each header
		request.headers.forEach(header => {
			widths.push(header.length + this._extraSpaceForEachColumn)
		})

		// go through all the data, and if the width to display the data is greater
		// than the header, change the width size to accommodate it
		request.dataRows.forEach(row => {
			for (let i = 0; i < widths.length; i++) {
				const columnData = row[i]
				const columnWidth = columnData.length + this._extraSpaceForEachColumn
				if (columnWidth > widths[i]) {
					widths[i] = columnWidth
				}
			}
		})

		return widths
	}

	private getWidthOfColumns(data: any[][]): number[] {
		const widths = []
		for (let i = 0; i < data[0].length; i++) {
			const colEntries = []
			for (let j = 0; j < data.length; j++) {
				// the +4 includes space at beginning and end and the 2 | dividers
				colEntries.push(data[j][i].toString().length + 4)
			}
			widths.push(Math.max(...colEntries))
		}

		return widths
	}
}
