export class Against {
	public NullOrUndefined(obj: any) {
		if (obj == undefined) {
			throw 'Value is null or undefined'
		}
	}

	public EmptyOrWhitespace(str: string | null | undefined) {
		if (!str || str.trim().length === 0) {
			throw 'String is null, empty, or only whitespace'
		}
	}
}

export class Guard {
	public static Against: Against = new Against()
}