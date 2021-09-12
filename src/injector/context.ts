import { Injector } from './injector'
import type { StaticProvider } from './provider'

export interface InjectorContext {
  /**
   * Gets the currently active injector
   */
  readonly current: Injector
  /**
   * Creates an injector with {@link current} as parent but only if providers are given.
   *
   * @param providers
   */
  create(providers: StaticProvider[]): Injector
  /**
   * Replaces the {@link current} injector with the given instance.
   * Returns the injector that was previously active
   *
   * @param injector
   */
  replace(injector: Injector): Injector
}

export function injectorContext(): InjectorContext {
  let current: Injector
  return {
    get current() {
      return current
    },
    create: (providers: StaticProvider[]) => {
      return Injector.create({
        parent: current,
        providers: providers,
      })
    },
    replace: (injector: Injector) => {
      const result = current
      current = injector
      return result
    },
  }
}
