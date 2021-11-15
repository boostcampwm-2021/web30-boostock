/* eslint-disable class-methods-use-this */

export default class Validator {
	private value: unknown;

	init(value: unknown): this {
		this.value = value;
		return this;
	}

	isInteger(): this {
		if (!Number.isSafeInteger(Number(this.value))) throw new Error('Validator Error: Not Integer Value');
		return this;
	}

	isFloat(value: unknown): this {
		if (Number(value) % 1 !== 0) throw new Error('Validator Error: Not Float Value');
		return this;
	}

	isPositive(): this {
		if (Number(this.value) <= 0) throw new Error('Validator Error: Not Positive Value');
		return this;
	}

	isNegative(): this {
		if (Number(this.value) >= 0) throw new Error('Validator Error: Not Negative Value');
		return this;
	}

	isString(): this {
		if (typeof this.value !== 'string') throw new Error('Validator Error: Not String Value');
		return this;
	}

	isInObject(obj: Record<string, unknown>): this {
		if (
			!Object.values(obj)
				.map((value: unknown) => String(value))
				.includes(String(this.value))
		)
			throw new Error('Validator Error: Not Included Value');
		return this;
	}

	toNumber(): number {
		return Number(this.value);
	}

	toString(): string {
		return String(this.value);
	}
}
