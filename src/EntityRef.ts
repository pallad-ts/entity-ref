import * as is from 'predicates'

const isType = is.struct({
	type: String,
	data: is.defined
});

export class EntityRef<TType extends string, TData extends {}> {
	constructor(readonly type: TType, readonly data: TData) {
		Object.freeze(this);
		Object.freeze(this.data);
	}

	/**
	 * Checks if provided value is entity ref of given type
	 */
	static is(value: any): value is EntityRef<any, any> {
		return isType(value);
	}

	static isOfType<TType extends string>(type: TType, value: any): value is EntityRef<TType, any> {
		return EntityRef.is(value) && value.type === type;
	}

	static create<TType extends string, T extends object>(type: TType, data: T): EntityRef<TType, T> {
		return new EntityRef<TType, T>(type, data);
	}
}
