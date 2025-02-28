import {createFactory} from "../createFactory";
import {EntityRefList} from "../EntityRefList";

describe('EntityRefList', () => {

	const factory = createFactory('WORKSPACE', (id: number) => id);
	const factoryProject = createFactory('PROJECT', (id: number) => id);

	const REF_1 = factory(1);
	const REF_2 = factory(2);
	const REF_3 = factory(3);

	const list = new EntityRefList([REF_1, REF_2]);

	describe('creating', () => {
		it('fails for empty list', () => {
			expect(() => new EntityRefList([] as never))
				.toThrowError('EntityRefList cannot be empty');
		});

		it('all refs must have the same type', () => {
			expect(() => new EntityRefList([REF_1, factoryProject(1)] as never))
				.toThrowError('All refs must have the same type. Expected: WORKSPACE, got: PROJECT');
		})
	});

	it('type', () => {
		expect(list.type)
			.toEqual('WORKSPACE');
	});

	it('size', () => {
		expect(list.size).toEqual(2);
	});

	describe('has', () => {
		it('returns true for existing ref', () => {
			expect(list.has(REF_1))
				.toEqual(true);
		});

		it('returns false for non-existing ref', () => {
			expect(list.has(REF_3))
				.toEqual(false);
		});
	});

	it('iterator', () => {
		expect([...list])
			.toEqual([REF_1, REF_2]);
	});

	describe('indexOf', () => {
		it('returns index of existing ref', () => {
			expect(list.indexOf(REF_1))
				.toEqual(0);
			expect(list.indexOf(REF_2))
				.toEqual(1);
		});

		it('returns -1 for non-existing ref', () => {
			expect(list.indexOf(REF_3))
				.toEqual(-1);
		});
	});

	describe('fromArray', () => {
		it('returns undefined for empty array', () => {
			expect(EntityRefList.fromArray([]))
				.toBeUndefined();

			expect(EntityRefList.fromArray([undefined]))
				.toBeUndefined();
		});

		it('creates list from array', () => {
			const list = EntityRefList.fromArray([REF_1, undefined, REF_2]);
			expect(list)
				.toEqual(new EntityRefList([REF_1, REF_2]));
		});
	});
});
