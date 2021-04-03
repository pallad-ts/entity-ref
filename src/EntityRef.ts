export class EntityRef<TType, TData extends {}> {
	constructor(readonly type: TType, readonly data: TData) {
		Object.freeze(this);
		Object.freeze(this.data);
	}

	/**
	 * Checks if provided value is entity ref of given type
	 */
	static is(value: any): value is EntityRef<any, any> {
		return value instanceof EntityRef;
	}

	static isOfType<TType>(type: TType, value: any): value is EntityRef<TType, any> {
		return EntityRef.is(value) && value.type === type;
	}

	static create<T extends object, TType>(type: TType, data: T): EntityRef<TType, T> {
		return new EntityRef<TType, T>(type, data);
	}
}
