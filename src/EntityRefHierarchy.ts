import {AnyRef} from "./AnyRef";

export class EntityRefHierarchy<T extends ReadonlyArray<AnyRef | undefined>> {
	constructor(readonly list: T) {
		if (this.list.filter(x => x).length < 1) {
			throw new TypeError('EntityRefHierarchy must contain at least 1 ref');
		}

		Object.freeze(this);
	}

	getRef<TType extends NonNullable<T[number]>['type']>(type: TType) {
		return this.list.find(ref => ref && ref.type === type) as GetRefType<T, TType>
	}

	get root() {
		for (const ref of this) {
			if (ref) {
				return ref;
			}
		}
	}

	get leaf() {
		let lastRef: T[number] | undefined;
		for (const ref of this) {
			if (ref) {
				lastRef = ref;
			}
		}
		return lastRef;
	}

	* [Symbol.iterator]() {
		for (const ref of this.list) {
			if (ref) {
				yield ref;
			}
		}
	}
}


type GetRefType<
	T extends readonly (AnyRef | undefined)[],
	TType extends string
> = {
	[K in keyof T]:
	// If the slot is exactly `undefined` then just keep it.
	[T[K]] extends [undefined]
		? T[K]
		// Otherwise, if the non-undefined part has the right type, return the entire T[K] (which may be a union with undefined)
		: (NonNullable<T[K]> extends { type: TType } ? T[K] : never)
}[number];
