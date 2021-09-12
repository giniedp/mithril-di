const forwardRefFn = Symbol('forwardRef')

/**
 * Allows to refer to references which are not yet defined.
 *
 * @public
 * @remarks
 * This works exactly as in the Angular framework {@link https://angular.io/api/core/forwardRef}
 *
 * @param fn - A function that returns the referenced symbol
 * @example
 * ```ts
 * class A {
 *   // references B before it is defined
 *   @Inject(forwardRef(() => B))
 *   bInstance
 * }
 * // this class is defined after it has been referenced
 * class B {}
 * ```
 */
export function forwardRef<T extends ForwardRef>(fn: T): T {
  const fr = fn as any
  fr[forwardRefFn] = forwardRef
  return fn
}

/**
 * Resolves a type that has been wrapped with {@link forwardRef}
 *
 * @param ref - The reference to resolve
 * @public
 */
export function resolveForwardRef<T>(ref: T | ForwardRef<T>): T {
  return isForwardRef(ref) ? ref() : ref
}

export type ForwardRef<T = unknown> = () => T

function isForwardRef<T = unknown>(fr: unknown): fr is ForwardRef<T> {
  return typeof fr === 'function' && (fr as any)[forwardRefFn] === forwardRef
}
