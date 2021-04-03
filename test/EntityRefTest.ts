import {EntityRef} from "@src/EntityRef";
import {assert, AssertTrue, IsExact} from "conditional-type-checks";

describe('EntityRef', () => {
	const DATA = {id: 1};
	const TYPE = 'user' as const;

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
});
