import {EntityRef} from "./EntityRef";
import {AnyRef} from "./AnyRef";

export class EntityRefHierarchy<T extends AnyRef> {
	constructor(readonly list: T[]) {
		if (this.list.length < 1) {
			throw new TypeError('EntityRefHierarchy must contain at least 1 element');
		}
		Object.freeze(this);
	}

	static fromOptionalRefs<T extends AnyRef>(refList: Iterable<T | undefined>): EntityRefHierarchy<T> | undefined {
		const finalRefList = Array.from(refList).filter(x => x);
		if (finalRefList.length === 0) {
			return undefined;
		}
		return new EntityRefHierarchy<T>(finalRefList as [T, ...T[]]);
	}

	rootRef(): T {
		return this.list[0];
	}

	leafRef(): T {
		return this.list[this.list.length - 1];
	}

	getRef<TType extends T['type']>(type: TType) {
		return this.list.find(ref => ref.type === type) as (T & { type: TType }) | undefined;
	}

	[Symbol.iterator]() {
		return this.list[Symbol.iterator]();
	}
}

