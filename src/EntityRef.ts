import * as is from 'predicates'
import {shallowEqual} from "shallow-equal";
import {AnyRef} from "./AnyRef";

const isType = is.struct({
	type: String,
	data: is.defined
});

export class EntityRef<TType extends string, TData extends {}> {
	constructor(readonly type: TType, readonly data: TData) {
		Object.freeze(this);
		Object.freeze(this.data);
	}

	equals(other: EntityRef<any, any>): boolean {
		return EntityRef.isEqual(this, other);
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

	/**
	 * Checks if two entity refs are equal.
	 *
	 * `data` is compared using `shallowEqual` if both data types are not primitives.
	 */
	static isEqual(a: AnyRef, b: AnyRef): boolean {
		if (a === b) {
			return true;
		}

		if (a.type === b.type) {
			const isBothPrimitive = is.primitive(a.data) && is.primitive(b.data);
			if (isBothPrimitive) {
				return a.data === b.data;
			}

			return shallowEqual(a.data, b.data);
		}

		return false;
	}
}
