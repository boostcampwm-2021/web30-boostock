import ValidationError, { ValidationErrorMessage } from 'errors/ValidationError';

export default class Validator {
	private value: unknown;

	init(value: unknown): this {
		this.value = value;
		return this;
	}

	isInteger(): this {
		if (!Number.isSafeInteger(Number(this.value))) throw new ValidationError(ValidationErrorMessage.NOT_INTEGER_VALUE);
		return this;
	}

	isFloat(value: unknown): this {
		if (Number(value) % 1 !== 0) throw new ValidationError(ValidationErrorMessage.NOT_FLOAT_VALUE);
		return this;
	}

	isPositive(): this {
		if (Number(this.value) <= 0) throw new ValidationError(ValidationErrorMessage.NOT_POSITIVE_VALUE);
		return this;
	}

	isNegative(): this {
		if (Number(this.value) >= 0) throw new ValidationError(ValidationErrorMessage.NOT_NEGATIVE_VALUE);
		return this;
	}

	isString(): this {
		if (typeof this.value !== 'string') throw new ValidationError(ValidationErrorMessage.NOT_STRING_VALUE);
		return this;
	}

	isInObject(obj: Record<string, unknown>): this {
		if (
			!Object.values(obj)
				.map((value: unknown) => String(value))
				.includes(String(this.value))
		)
			throw new ValidationError(ValidationErrorMessage.NOT_INCLUDED_VALUE);
		return this;
	}

	toNumber(): number {
		return Number(this.value);
	}

	toString(): string {
		return String(this.value);
	}
}
