import { ProviderToken } from './injector'

/**
 * A metadata object that is created when using {@link Inject} decorator on a property
 *
 * @public
 */
export interface InjectMetadata<T = unknown> {
  /**
   * The property name on which a type should be injected
   */
  property: string | symbol
  /**
   * The service lookup key
   */
  type: ProviderToken<T>
  /**
   * Options given to the Inject decorator
   */
  options: InjectOptions
}

/**
 * An object mapping property names to its inject metadata
 *
 * @public
 */
export type InjectProps = Map<string | symbol, InjectMetadata>

/**
 * Options that can be passed to the {@link Inject} decorator
 *
 * @public
 */
export interface InjectOptions {
  /**
   * Whether this injection is optional and should not raise an error if missing
   */
  optional?: boolean
}

const injectProps = Symbol('injectProps')

/**
 * @public
 */
export function readInjectProps(target: any): InjectProps | null {
  return target.constructor[injectProps]
}

function writeInjectProps(target: any, data: InjectProps) {
  target.constructor[injectProps] = data
}

/**
 * A decorator that adds metadata for dependency injection on a class property
 *
 * @public
 */
export function Inject<T>(type: ProviderToken<T>, options?: InjectOptions): PropertyDecorator {
  return (target: any, property?: string | symbol) => {
    const map: InjectProps = readInjectProps(target) || new Map()
    map.set(property, {
      type,
      property,
      options,
    })
    writeInjectProps(target, map)
  }
}
