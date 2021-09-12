import type { Injector } from "./injector"

export class InjectionToken<T> {

  public factory: (injector: Injector) => T

  constructor(protected description: string, options?: {
    factory: (injector: Injector) => T
  }) {
    this.factory = options?.factory
  }

  public toString(): string {
    return `InjectionToken ${this.description}`;
  }
}
