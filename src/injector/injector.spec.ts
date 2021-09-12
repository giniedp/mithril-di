import { Inject } from '..'
import { forwardRef } from '../forward-ref'
import { InjectionToken } from './injection-token'
import { Injector } from './injector'
import { classProvider, constructorProvider, existingProvider, factoryProvider, valueProvider } from './provider'

describe('Injector', () => {
  class Value {
    public arguments: ArrayLike<unknown>
    constructor(...args: Array<unknown>) {
      this.arguments = args
    }
  }

  class Value2 extends Value {}

  class Value3 {
    public arguments: ArrayLike<unknown>
    constructor(...args: Array<unknown>) {
      this.arguments = args
    }
  }

  describe('ValueProvider', () => {
    let token: InjectionToken<string>
    let injector: Injector
    beforeEach(() => {
      token = new InjectionToken('value')
      injector = Injector.create({
        providers: [valueProvider(token, 'the value')],
      })
    })

    it('injects provided value', () => {
      expect(injector.get(token)).toEqual('the value')
    })
  })

  describe('FactoryProvider', () => {
    let token: InjectionToken<Value>
    let injector: Injector
    const factory = (...args: Array<unknown>) => new Value(...args)
    beforeEach(() => {
      token = new InjectionToken('value')
      injector = Injector.create({
        providers: [factoryProvider(token, factory)],
      })
    })

    it('injects provided value', () => {
      expect(injector.get(token)).toBeInstanceOf(Value)
    })

    it('calls factory with injector', () => {
      const instance = injector.get(token)
      expect(instance.arguments[0]).toBe(injector)
    })
  })

  describe('StaticClassProvider', () => {
    let token: InjectionToken<Value>
    let injector: Injector

    beforeEach(() => {
      token = new InjectionToken('value')
      injector = Injector.create({
        providers: [classProvider(token, Value)],
      })
    })

    it('injects provided value', () => {
      expect(injector.get(token)).toBeInstanceOf(Value)
    })

    it('calls constructor with injector', () => {
      const instance = injector.get(token)
      expect(instance.arguments[0]).toBe(injector)
    })
  })

  describe('StaticClassProvider', () => {
    let token: InjectionToken<Value>
    let injector: Injector

    beforeEach(() => {
      token = new InjectionToken('value')
      injector = Injector.create({
        providers: [classProvider(token, Value2)],
      })
    })

    it('injects provided value', () => {
      expect(injector.get(token)).toBeInstanceOf(Value)
      expect(injector.get(token)).toBeInstanceOf(Value2)
    })

    it('calls constructor with injector', () => {
      const instance = injector.get(token)
      expect(instance.arguments[0]).toBe(injector)
    })
  })

  describe('ConstructorProvider', () => {
    let injector: Injector

    beforeEach(() => {
      injector = Injector.create({
        providers: [constructorProvider(Value)],
      })
    })

    it('injects provided value', () => {
      expect(injector.get(Value)).toBeInstanceOf(Value)
    })

    it('calls constructor with injector', () => {
      const instance = injector.get(Value)
      expect(instance.arguments[0]).toBe(injector)
    })

    it('injects dependencies before constructor is called', () => {
      class Service {
        @Inject(Value)
        injected: Value

        seenByConstructor: Value
        constructor() {
          this.seenByConstructor = this.injected
        }
      }

      injector = Injector.create({
        parent: injector,
        providers: [constructorProvider(Service)]
      })

      const instance = injector.get(Service)
      expect(instance).toBeInstanceOf(Service)
      expect(instance.injected).toBeInstanceOf(Value)
      expect(instance.injected).toBe(instance.seenByConstructor)
    })
  })

  describe('ExistingProvider', () => {
    let token: InjectionToken<Value>
    let injector: Injector

    beforeEach(() => {
      token = new InjectionToken('value')
      injector = Injector.create({
        providers: [classProvider(token, Value), existingProvider(Value3, token)],
      })
    })

    it('injects provided value', () => {
      expect(injector.get(Value3)).toBeInstanceOf(Value)
    })
  })

  describe('Provide with forward ref', () => {
    let injector: Injector

    beforeEach(() => {
      injector = Injector.create({
        providers: [
          {
            provide: forwardRef(() => Value3),
            useClass: Value
          },
          classProvider(forwardRef(() => Value3), Value),
        ],
      })
    })

    it('injects provided value', () => {
      expect(injector.get(Value3)).toBeInstanceOf(Value)
    })
  })

  describe('InjectionToken factory', () => {
    //
  })

  describe('Errors', () => {
    it('throws when loop is detected', () => {
      const token = new InjectionToken('my token')
      const injector = Injector.create({
        providers: [existingProvider(Value3, token), existingProvider(token, Value3)],
      })
      expect(() => {
        injector.get(Value3)
      }).toThrow()
    })

    it('throws when not provider was found', () => {
      const injector = Injector.create({
        providers: [],
      })
      expect(() => {
        injector.get(Value3)
      }).toThrow()
    })
  })

})
