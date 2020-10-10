import {createFactory} from "@src/createFactory";
import {assert, IsExact} from "conditional-type-checks";
import {EntityRef} from "@src/EntityRef";

describe('createFactory', () => {

    const TYPE = 'user' as const;
    const FACTORY = createFactory(TYPE, (id: number, name: string) => {
        return {id, name};
    });

    it('type', () => {
        expect(FACTORY.typeName)
            .toEqual(TYPE);
    });

    it('creating', () => {
        const ref = FACTORY(10, 'test');
        expect(ref)
            .toMatchObject({
                type: TYPE,
                id: 10,
                name: 'test'
            })
        assert<IsExact<Parameters<typeof FACTORY>, [number, string]>>(true);
        assert<IsExact<(typeof ref)['type'], 'user'>>(true);
        assert<IsExact<ReturnType<typeof FACTORY>,
            EntityRef.Enchanted<EntityRef<typeof TYPE> & { id: number, name: string }>>>(true);
    });

    it('creating from data', () => {
        const data = {id: 10, name: 'test'};
        const ref = FACTORY.fromData(data);
        expect(ref)
            .toMatchObject({
                ...data,
                type: TYPE,
            });

        assert<IsExact<Parameters<typeof FACTORY.fromData>, [{ id: number, name: string }]>>(true);
    });

    it('checking type', () => {
        const ref = FACTORY(10, 'foo');
        expect(FACTORY.is(ref))
            .toEqual(true);

        expect(FACTORY.is(EntityRef.create('different', {})))
            .toEqual(false);
    });

    it('type', () => {
        const ref = {} as any;
        if (FACTORY.is(ref)) {
            assert<IsExact<typeof ref, ReturnType<typeof FACTORY>>>(true);
        }
    });

    describe('adding extra factories', () => {
        it('success', () => {
            const data = {id: 10, name: 'dupa'}
            const factory = createFactory(TYPE, (id: number, name: string) => {
                return {id, name}
            }, {
                fromEntityFactory() {
                    return data;
                },
                testFactory(id: number) {
                    return data;
                }
            });


            expect(factory.fromEntityFactory())
                .toEqual(factory.fromData(data));

            expect(factory.testFactory(10))
                .toStrictEqual(factory.fromData(data));

            assert<IsExact<Parameters<typeof factory.fromEntityFactory>, []>>(true);
            assert<IsExact<ReturnType<typeof factory.fromEntityFactory>, ReturnType<typeof factory>>>(true);
            assert<IsExact<Parameters<typeof factory.testFactory>, [number]>>(true);
            assert<IsExact<ReturnType<typeof factory.testFactory>, ReturnType<typeof factory>>>(true);
        });


        it('omits non function values', () => {
            const factory = createFactory(TYPE, id => ({id}), {
                num: 1,
                str: 'foo',
                undef: undefined,
                // tslint:disable-next-line:no-null-keyword
                null: null
            } as any);

            expect(factory.num)
                .toBeUndefined();

            expect(factory.str)
                .toBeUndefined();
            expect('undef' in factory)
                .toBeFalsy();
            expect(factory.null)
                .toBeUndefined();
        });
    });
});