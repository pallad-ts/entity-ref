import {EntityRef} from "./EntityRef";
import {AnyRef} from "./AnyRef";

export class EntityRefList<T extends AnyRef> {
	#list: T[] = [];

	readonly type: T['type'];

	constructor(list: T[]) {
		if (list.length === 0) {
			throw new Error('EntityRefList cannot be empty');
		}

		this.type = list[0].type;
		for (const ref of list) {
			this.#add(ref);
		}
	}

	has(ref: T): boolean {
		return this.indexOf(ref) >= 0;
	}

	indexOf(ref: T): number {
		return this.#list.findIndex(x => EntityRef.isEqual(x, ref));
	}

	#add(...refList: T[]): this {
		for (const ref of refList) {
			if (ref.type !== this.type) {
				throw new TypeError('All refs must have the same type. Expected: ' + this.type + ', got: ' + ref.type);
			}
			if (!this.has(ref)) {
				this.#list.push(ref);
			}
		}
		return this;
	}

	[Symbol.iterator]() {
		return this.#list[Symbol.iterator]();
	}

	get size() {
		return this.#list.length;
	}

	static fromArray<T extends AnyRef>(list: Array<AnyRef | undefined>): EntityRefList<T> | undefined {
		const refs = list.filter(x => x) as T[];
		return refs.length > 0 ? new EntityRefList(refs) : undefined;
	}
}
