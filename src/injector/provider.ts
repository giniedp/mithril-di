import type { Injector } from "./injector"
import { ProviderToken, Type } from "./types"

export type ConstructorProvider<T = unknown> = {
  provide: Type<T>
}
export type ValueProvider<T = unknown> = {
  provide: ProviderToken<T>,
  useValue: T
}
export type FactoryProvider<T = unknown> = {
  provide: ProviderToken<T>,
  useFactory: FactoryFn<T>
}
export type ClassProvider<T = unknown> = {
  provide: ProviderToken<T>,
  useClass: Type<T>
}
export type ExistingProvider<T = unknown> = {
  provide: ProviderToken<T>,
  useExisting: ProviderToken<T>
}

export type StaticProvider = ValueProvider | ExistingProvider | ClassProvider | ConstructorProvider | FactoryProvider;

export type FactoryFn<T> = (injector: Injector) => T

export function factoryProvider<T>(token: ProviderToken<T>, fn: FactoryFn<T>): FactoryProvider<T> {
  return {
    provide: token,
    useFactory: fn
  }
}

export function valueProvider<T>(token: ProviderToken<T>, value: T): ValueProvider<T> {
  return {
    provide: token,
    useValue: value
  }
}

export function classProvider<T>(token: ProviderToken<T>, value: Type<T>): ClassProvider<T> {
  return {
    provide: token,
    useClass: value
  }
}

export function constructorProvider<T>(value: Type<T>): ConstructorProvider<T> {
  return {
    provide: value
  }
}

export function existingProvider<T>(diToken: ProviderToken<T>, value: ProviderToken<T>): ExistingProvider<T> {
  return {
    provide: diToken,
    useExisting: value
  }
}
