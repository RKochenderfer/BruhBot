import FlaggedPattern from '../../src/message-checker/flagged-pattern'
import MessageChecker from '../../src/message-checker/messageChecker'

describe('testing MessageChecker', () => {
	test('isTextFlagged, with no regex flags, should return true when the provided text is found in any of the flagged patterns', () => {
		// Arrange
		const text = 'test'

		const key = 'test'
		const expression = 'test'
		const response = 'success'
		const flags = null

		const flaggedPattern = new FlaggedPattern(key, expression, response, flags)
		const messageChecker = new MessageChecker([flaggedPattern])

		// Act
		const result = messageChecker.isTextFlagged(text)

		// Assert
		expect(result).toBe(true)
	})

	test('isTextFlagged, with regex flags, should detect if the provided text is found in any of the flagged patterns', () => {
		// Arrange
		const text = 'TESt'

		const key = 'test'
		const expression = 'test'
		const response = 'success'
		const flags = 'i'

		const flaggedPattern = new FlaggedPattern(key, expression, response, flags)
		const messageChecker = new MessageChecker([flaggedPattern])

		// Act
		const result = messageChecker.isTextFlagged(text)

		// Assert
		expect(result).toBe(true)
	})

	test('isTextFlagged should return false if the provided text is not found in any of the flagged patterns', () => {
		// Arrange
		const text = 'foo'

		const key = 'test'
		const expression = 'test'
		const response = 'success'
		const flags = null

		const flaggedPattern = new FlaggedPattern(key, expression, response, flags)
		const messageChecker = new MessageChecker([flaggedPattern])

		// Act
		const result = messageChecker.isTextFlagged(text)

		// Assert
		expect(result).toBe(false)
	})

	test('isTextFlagged should return false if flagged patterns is empty', () => {
		// Arrange
		const text = 'foo'

		const key = 'test'
		const expression = 'test'
		const response = 'success'
		const flags = null

		const flaggedPattern = new FlaggedPattern(key, expression, response, flags)
		const messageChecker = new MessageChecker([])

		// Act
		const result = messageChecker.isTextFlagged(text)

		// Assert
		expect(result).toBe(false)
	})
})