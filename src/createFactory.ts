import {EntityRef} from "./EntityRef";
import * as is from 'predicates';

export function createFactory<TType,
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
		return EntityRef.is(type, value);
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

	return f as any;
}

export interface Factory<TType, TFactory extends (...args: any[]) => any> {
	(...args: Parameters<TFactory>): EntityRef.Enchanted<ReturnType<TFactory> & EntityRef<TType>>;

	/**
	 * Creates ref from pure data (without type)
	 */
	fromData(data: ReturnType<TFactory>): EntityRef.Enchanted<ReturnType<TFactory> & EntityRef<TType>>;

	/**
	 * Checks if value is entity ref
	 */
	is(value: any): value is EntityRef.Enchanted<ReturnType<TFactory> & EntityRef<TType>>;

	typeName: TType;
}

export type EnchantedFactories<TResult, T extends Record<string, (...args: any[]) => TResult>> = {
	[P in keyof T]: (...args: Parameters<T[P]>) => TResult
}
