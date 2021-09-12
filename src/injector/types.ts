import { InjectionToken } from './injection-token'

/**
 * A type that has a constructor
 *
 * @public
 */
export interface Type<T> extends Function {
  new (...args: unknown[]): T
}

/**
 * An abstract class type
 *
 * @public
 */
export interface AbstractType<T> extends Function {
  prototype: T
}

/**
 *
 */
export type ProviderToken<T> =
  | Type<T>
  | AbstractType<T>
  | InjectionToken<T>
  | string
  | symbol
