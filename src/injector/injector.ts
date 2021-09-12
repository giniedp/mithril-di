
import { resolveForwardRef } from "../forward-ref"
import { readInjectProps } from "../inject"
import { stringify } from "../utils/errors"
import { InjectionToken } from "./injection-token"
import type { StaticProvider } from "./provider"
import { ProviderToken, Type } from "./types"

interface ResolveContext<T> {
  token: ProviderToken<T>
  result?: T
  chain: Array<ProviderToken<T>>
}

export interface InjectorOptions {
  parent?: Injector,
  providers: Array<StaticProvider>
}

export class Injector {

  private parent: Injector
  private providers: Array<StaticProvider>
  private data = new Map<unknown, unknown>()

  public constructor(options?: InjectorOptions) {
    this.parent = options?.parent
    this.providers = options?.providers || []
  }

  public static create(options: InjectorOptions): Injector {
    return new Injector(options)
  }

  public get<T>(key: ProviderToken<T>, notFoundValue?: T): T {
    key = resolveForwardRef(key)
    const result = this.data.get(key)
    if (result != null) {
      return result as T
    }
    const ctx: ResolveContext<T> = {
      token: key,
      chain: []
    }

    this.resolve(ctx)

    if (ctx.result !== undefined) {
      return this.set(key, ctx.result)
    }

    if (this.parent) {
      ctx.result = this.parent.get(ctx.token, notFoundValue)
      if (ctx.result !== undefined) {
        return ctx.result
      }
    }

    if (key instanceof InjectionToken && key.factory) {
      ctx.result = key.factory(this)
      if (ctx.result !== undefined) {
        return this.set(key, ctx.result)
      }
    }

    if (notFoundValue !== undefined) {
      return notFoundValue
    } else {
      throw new Error(`no provider found for ${stringify(key)}`)
    }
  }

  private set<T>(key: ProviderToken<T>, value:T ): T {
    this.data.set(key, value)
    return value
  }

  protected resolve<T>(ctx: ResolveContext<T>): void {
    let retry = false
    const checked: any[] = []
    do {
      retry = false
      for (const provider of this.providers) {
        if (resolveForwardRef(provider.provide) !== ctx.token) {
          continue
        }
        if ('useValue' in provider) {
          ctx.result = provider.useValue as T
          return
        }
        if ('useFactory' in provider) {
          ctx.result = provider.useFactory(this) as T
          return
        }
        if ('useClass' in provider) {
          ctx.result = this.createInstance<T>(provider.useClass as Type<T>)
          return
        }
        if ('useExisting' in provider) {
          if (checked.includes(provider.useExisting)) {
            throw new Error(`alias loop detected: ${checked.map(stringify).join(' -> ')} -> ${stringify(provider.useExisting)}`)
          }
          retry = true
          checked.push(ctx.token)
          ctx.token = provider.useExisting as ProviderToken<T>
          break
        }
        ctx.result = this.createInstance<T>(provider.provide as Type<T>)
        return
      }
    } while(retry)
  }

  protected createInstance<T>(type: Type<T>): T {
    const props = readInjectProps(type.prototype)
    if (props) {
      const result = Object.create(type.prototype)
      props.forEach((value, key) => {
        result[key] = this.get(value.type)
      })
      type.apply(result, [this])
      return result
    } else {
      return new type(this)
    }
  }
}
