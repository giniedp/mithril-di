/* eslint-disable prefer-rest-params */

import { ClosureComponent, ComponentTypes } from 'mithril'
import { Injector, injectorContext, ProviderToken, StaticProvider } from './injector'
import { makeDiComponent } from './utils/make-di-component'
import { makeDiDecorator } from './utils/make-di-decorator'

export interface DIOptions {
  providers: StaticProvider[]
}

export interface DIAttrs {
  injector: Injector
}

export type DIComponentType<A, S> = ComponentTypes<A & DIAttrs, S>

export function DI(options?: DIOptions): ClassDecorator
export function DI<A, S = any>(component: DIComponentType<A, S>): ClosureComponent<A>
export function DI<A, S = any>(options: DIOptions, component: DIComponentType<A, S>): ClosureComponent<A>
export function DI<A, S = any>(options: StaticProvider[], component: DIComponentType<A, S>): ClosureComponent<A>
export function DI(): unknown {
  if (!arguments.length || (arguments.length === 1 && 'providers' in arguments[0])) {
    return makeDiDecorator(DI.ctx, arguments[0])
  }

  let options: DIOptions
  let component: ComponentTypes
  if (arguments.length === 2) {
    if (Array.isArray(arguments[0])) {
      options = { providers: arguments[0] }
      component = arguments[1]
    } else {
      options = arguments[0]
      component = arguments[1]
    }
  } else if (arguments.length === 1) {
    component = arguments[0]
  } else {
    throw new Error('invalid arguments')
  }
  return makeDiComponent(DI.ctx, options, component)
}

DI.ctx = injectorContext()
DI.inject = function inject<T>(token: ProviderToken<T>): T {
  return DI.ctx.current?.get(token)
}
