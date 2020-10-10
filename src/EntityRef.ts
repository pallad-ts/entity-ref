import * as isPred from 'predicates';

const INSTANCE_SYMBOL = Symbol('entity_ref_instance');

export interface EntityRef<TType> {
    readonly type: TType;
}

export namespace EntityRef {
    export type RestParameters<T> = Omit<T, 'type' | typeof INSTANCE_SYMBOL>;

    export type Enchanted<T> = T & { [INSTANCE_SYMBOL]: true };

    /**
     * Checks if provided value is entity ref of given type
     */
    export function is<T extends EntityRef<TType>, TType>(type: TType, value: any): value is Enchanted<T> {
        return isPred.object(value) && value[INSTANCE_SYMBOL] === true && value.type === type;
    }

    /**
     * Creates entity ref
     */
    export function create<T extends object, TType>(type: TType, data: T): Enchanted<EntityRef<TType> & T> {
        return Object.freeze({
            ...data,
            type,
            [INSTANCE_SYMBOL]: true
        });
    }
}