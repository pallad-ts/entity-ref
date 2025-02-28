import {EntityRef} from "../EntityRef";
import {assert, IsExact} from "conditional-type-checks";
import {AnyRef} from "../AnyRef";

describe('EntityRef', () => {
	const DATA = {id: 1};
	const TYPE = 'USER' as const;

	it('creating', () => {
		const ref = EntityRef.create(TYPE, DATA);
		expect(ref)
			.toEqual(new EntityRef(TYPE, DATA));

		assert<IsExact<typeof ref,
			EntityRef<typeof TYPE, typeof DATA>>>(true);
	});

	describe('checking type', () => {
		it('success for ref created by EntityRef.create', () => {
			const ref = EntityRef.create(TYPE, DATA);
			const result = EntityRef.isOfType(TYPE, ref);
			expect(result)
				.toEqual(true);
		});

		it('type check', () => {
			const ref = {} as any;
			if (EntityRef.is(ref)) {
				assert<IsExact<typeof ref, EntityRef<any, any>>>(true);
			}
		});

		it('type check and type', () => {
			const ref = {} as any;
			if (EntityRef.isOfType(TYPE, ref)) {
				assert<IsExact<typeof ref, EntityRef<typeof TYPE, any>>>(true);
			}
		});

		it('fail for ref of other type', () => {
			const ref = EntityRef.create(TYPE, DATA);
			expect(EntityRef.isOfType('account', ref))
				.toEqual(false);
		});

		it('fail for ref with raw data', () => {
			expect(EntityRef.isOfType('user', DATA))
				.toEqual(false);
		});
	});

	describe('equals', () => {
		expect(new EntityRef('FOO', 1).equals(new EntityRef('FOO', 1))).toBe(true);
	});

	describe('isEqual', () => {
		it.each<[string, AnyRef, AnyRef]>([
			['different type', new EntityRef('FOO', 1), new EntityRef('BAR', 1)],
			['different data - primitives', new EntityRef('FOO', 1), new EntityRef('FOO', 2)],
			['different data - objects', new EntityRef('FOO', {id: 1}), new EntityRef('FOO', {id: 2})],
			['different data - objects 2', new EntityRef('FOO', 1), new EntityRef('FOO', {id: 2})],
			['different data - arrays', new EntityRef('FOO', [1]), new EntityRef('FOO', 1)],
			['different data - arrays 2', new EntityRef('FOO', [1]), new EntityRef('FOO', [2])],
		])('are not equal: %s', (name, a, b) => {
			expect(EntityRef.isEqual(a, b)).toBe(false);
		});

		const fooRef = new EntityRef('FOO', 1);
		it.each<[string, AnyRef, AnyRef]>([
			['same instance', fooRef, fooRef],
			['save data - primitives', new EntityRef('FOO', 1), new EntityRef('FOO', 1)],
			['same data - objects', new EntityRef('FOO', {id: 1}), new EntityRef('FOO', {id: 1})],
			['same data - arrays', new EntityRef('FOO', [1]), new EntityRef('FOO', [1])],
		])('are equal: %s', (name, a, b) => {
			expect(EntityRef.isEqual(a, b)).toBe(true);
		});
	});
});
