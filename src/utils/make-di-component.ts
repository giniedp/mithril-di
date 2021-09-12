import { default as m, ComponentTypes, Vnode, ClosureComponent } from "mithril"
import type { DIOptions } from "../di"
import { Injector, InjectorContext } from "../injector"
import { Inline } from "./inline"

export function makeDiComponent<T>(ctx: InjectorContext, options: DIOptions, component: ComponentTypes<T>): ClosureComponent<T> {
  const providers = options?.providers || []
  return function DIComponent() {
    let injector: Injector
    return {
      onremove: () => {
        injector = null
      },
      view: (node: Vnode<T>) => {
        if (!injector) {
          injector = ctx.create(providers)
        }
        const previous = ctx.replace(injector)
        return [
          m(component, {
            ...node.attrs,
            injector,
          }, node.children),
          m(Inline, {
            view: () => {
              ctx.replace(previous)
            },
          }),
        ]
      },
    }
  }
}
