import { AsciiTable, RenderRequest } from '../src/ascii-table'

describe('asciiTable tests', () => {
	test('render creates an ASCII table with the data', () => {
		// arrange
		const headers = ['Roll', 'Values', 'Total']
		const dataToAdd = ['1d6+1', '2', '3']
		const asciiTable = new AsciiTable()
		const data = [
			headers,
			dataToAdd,
		]

		// act
		const render = asciiTable.render(data)

		// assert
		const expected = `\`| Roll   || Values  || Total  |
-------------------------------
| 1d6+1  || 2       || 3      |\``
		expect(render.length).toBeGreaterThan(0)
		expect(render).toBe(expected)
	})

	test('renderRequest creates an ASCII table with the data', () => {
		// arrange
		const headers: string[] = ['Roll', 'Values', 'Total']
		const dataToAdd: string[][] = [['1d6+1', '2', '3'], ['1d20', '20', '20']]
		const asciiTable = new AsciiTable()
		const renderRequest = RenderRequest.from(headers, dataToAdd)

		// act
		const result = asciiTable.renderRequest(renderRequest)

		// assert
		const expected = `| Roll   || Values  || Total  |
| 1d6+1  || 2       || 3      |
| 1d20   || 20      || 20     |`

		expect(result.length).not.toBe(0)
		expect(result).toBe(expected)
	})
})