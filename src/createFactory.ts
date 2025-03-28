import {EntityRef} from "./EntityRef";
import * as is from 'predicates';

export function createFactory<TType extends string,
	TFactory extends (...args: any[]) => any,
	TExtraFactories extends Record<string, (...args: any[]) => ReturnType<TFactory>>>(
	type: TType,
	factory: TFactory,
	extraFactories?: TExtraFactories): Factory<TType, TFactory> &
	EnchantedFactories<ReturnType<Factory<TType, TFactory>>, TExtraFactories> {

	const mainFactory = EntityRef.create.bind(undefined, type);

	const f = (...args: any[]) => {
		return mainFactory(factory(...args));
	};

	f.typeName = type;
	f.is = (value: any) => {
		return EntityRef.isOfType(type, value);
	};
	f.fromData = mainFactory;

	if (extraFactories) {
		for (const [key, factory] of Object.entries(extraFactories)) {
			if (is.func(factory)) {
				(f as any)[key] = (...args: any[]) => {
					return mainFactory(factory(...args));
				}
			}
		}
	}

	return f as never;
}

export type EntityRefFactoryType<TFactory extends Factory<string, any>> = ReturnType<TFactory>;

export interface Factory<TType extends string, TFactory extends (...args: any[]) => any> {
	(...args: Parameters<TFactory>): EntityRef<TType, ReturnType<TFactory>>;

	/**
	 * Creates ref from pure data (without type)
	 */
	fromData(data: ReturnType<TFactory>): EntityRef<TType, ReturnType<TFactory>>;

	/**
	 * Checks if value is entity ref
	 */
	is(value: any): value is EntityRef<TType, ReturnType<TFactory>>;

	typeName: TType;
}

export type EnchantedFactories<TResult, T extends Record<string, (...args: any[]) => TResult>> = {
	[P in keyof T]: (...args: Parameters<T[P]>) => TResult
}
