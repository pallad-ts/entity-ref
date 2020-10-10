import {EntityRef} from "@src/EntityRef";
import {assert, AssertTrue, IsExact} from "conditional-type-checks";

describe('EntityRef', () => {
    const DATA = {id: 1};
    const TYPE = 'user' as const;

    it('creating', () => {
        const ref = EntityRef.create(TYPE, DATA);
        expect(ref)
            .toMatchObject(DATA);

        assert<
            IsExact<
                typeof ref,
                EntityRef.Enchanted<EntityRef<typeof TYPE> & typeof DATA>
            >
        >(true);
    });

    describe('checking type', () => {
        it('success for ref created by EntityRef.create', () => {
            const ref = EntityRef.create(TYPE, DATA);
            const result = EntityRef.is('user', ref); 
            expect(result)
                .toEqual(true);
        });

        it('type check', () => {
            const ref = {} as any;
            if (EntityRef.is(TYPE, ref)) {
                assert<IsExact<typeof ref, EntityRef.Enchanted<EntityRef<typeof TYPE>>>>(true);
            }
        });

        it('fail for ref of other type', () => {
            const ref = EntityRef.create(TYPE, DATA);
            expect(EntityRef.is('account', ref))
                .toEqual(false);
        });

        it('fail for ref with raw data', () => {
            expect(EntityRef.is('user', DATA))
                .toEqual(false);
        });
    });
});