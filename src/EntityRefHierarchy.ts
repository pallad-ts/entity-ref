import {EntityRefNode} from "./EntityRefNode";

export class EntityRefHierarchy<T extends ReadonlyArray<EntityRefNode | undefined>> {
	constructor(readonly list: T) {
		if (this.list.filter(x => x).length < 1) {
			throw new TypeError('EntityRefHierarchy must contain at least one node');
		}

		Object.freeze(this);
	}

	getRef<TType extends NonNullable<T[number]>['type']>(type: TType) {
		return this.list.find(ref => ref && ref.type === type) as GetRefType<T, TType>
	}

	/**
	 * Returns first (root) defined ref in the hierarchy
	 */
	get root(): FirstDefinedUnion<T> {
		for (const ref of this) {
			if (ref) {
				return ref as FirstDefinedUnion<T>;
			}
		}
		throw new TypeError('EntityRefHierarchy must contain at least one node');
	}

	/**
	 * Returns last (leaf) defined ref in the hierarchy
	 */
	get leaf(): LastDefinedUnion<T> {
		let lastRef: T[number] | undefined;
		for (const ref of this) {
			if (ref) {
				lastRef = ref;
			}
		}
		return lastRef as any;
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
	T extends readonly (EntityRefNode | undefined)[],
	TType extends string
> = {
	[K in keyof T]:
	// If the slot is exactly `undefined` then just keep it.
	[T[K]] extends [undefined]
		? T[K]
		// Otherwise, if the non-undefined part has the right type, return the entire T[K] (which may be a union with undefined)
		: (NonNullable<T[K]> extends { type: TType } ? T[K] : never)
}[number];

export type FirstDefinedUnion<T extends readonly (EntityRefNode | undefined)[]> =
	T extends readonly [infer Head, ...infer Tail]
		? undefined extends Head
			? Tail extends readonly (EntityRefNode | undefined)[]
				? NonNullable<Head> | FirstDefinedUnion<Tail>
				: NonNullable<Head>
			: Head
		: never;

type LastDefinedUnion<T extends readonly (EntityRefNode | undefined)[]> =
	T extends readonly [...infer Rest, infer Last]
		? undefined extends Last
			? Rest extends readonly (EntityRefNode | undefined)[]
				? NonNullable<Last> | LastDefinedUnion<Rest>
				: NonNullable<Last>
			: Last
		: never;
