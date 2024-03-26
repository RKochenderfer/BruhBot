export class Against {
	public NullOrUndefined(obj: any) {
		if (obj == undefined) {
			throw 'Value is null or undefined'
		}
	}

	public EmptyOrWhitespace(str: string) {
		if (str.trim().length === 0) {
			throw 'String is empty or only whitespace'
		}
	}
}

export class Guard {
	public static Against: Against = new Against()
}