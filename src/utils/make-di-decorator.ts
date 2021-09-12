/* eslint-disable prefer-rest-params */
import { default as m, ClassComponent } from "mithril"
import type { DIOptions } from "../di"
import { InjectProps, readInjectProps } from "../inject"
import type { Injector, InjectorContext } from "../injector"
import { Inline } from "./inline"

const injectorKey = Symbol('injector')

export function makeDiDecorator(ctx: InjectorContext, options?: DIOptions): ClassDecorator {
  return (target) => {

    const onremove = target.prototype.onremove as ClassComponent<unknown>['onremove']
    const view = target.prototype.view as ClassComponent<unknown>['view']

    target.prototype.onremove = function(this) {
      clearInjector(this)
      onremove?.apply(this, arguments)
    }
    target.prototype.view = function(this) {
      const injector = makeInjector(ctx, this, options, readInjectProps(target.prototype))
      const previous = ctx.replace(injector)
      let children: m.Children
      try {
        children = view?.apply(this, arguments)
      } catch(e) {
        console.error(e)
      }
      return [
        m.fragment({}, [children]),
        m(Inline, {
          view: () => {
            ctx.replace(previous)
          },
        }),
      ]
    }
    return target
  }
}

function makeInjector(ctx: InjectorContext, instance: { [injectorKey]: Injector }, options: DIOptions | null, props: InjectProps) {
  if (!instance[injectorKey]) {
    const providers = options?.providers
    const injector = providers ? ctx.create(providers) : ctx.current
    instance[injectorKey] = injector
    injectProperties(injector, instance, props)
  }
  return instance[injectorKey]
}

function clearInjector(instance: { [injectorKey]: Injector }) {
  instance[injectorKey] = null
}

function injectProperties(injector: Injector, target: any, props: InjectProps): void {
  if (props) {
    props.forEach((value, key) => {
      target[key] = injector.get(value.type)
    })
  }
}
