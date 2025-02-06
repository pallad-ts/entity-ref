import {AnyRef} from "./AnyRef";

export class EntityRefHierarchy<T extends Array<AnyRef | undefined>> {
	constructor(readonly list: T) {
		if (this.list.filter(x => x).length < 1) {
			throw new TypeError('EntityRefHierarchy must contain at least 1 ref');
		}

		Object.freeze(this);
	}

	getRef<TType extends NonNullable<T[number]>['type']>(type: TType) {
		return this.list.find(ref => ref && ref.type === type) as (T[number] & { type: TType }) | undefined;
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

