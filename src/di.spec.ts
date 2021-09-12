import m, { ClassComponent, Vnode } from 'mithril'
import { DI, DIAttrs, Inject, InjectionToken, valueProvider } from '.'

const PARENT = new InjectionToken<string>('Parent')
const SELF = new InjectionToken<string>('Self')

const Parent = DI(
  {
    providers: [valueProvider(PARENT, 'parent value')],
  },
  () => {
    return {
      view: (node) => {
        return node.children
      },
    }
  },
)

describe('DI', () => {
  let el: Element
  beforeEach(() => {
    el = document.createElement('div')
    document.body.append(el)
  })
  afterEach(() => {
    m.mount(el, null)
    el.remove()
  })

  describe('Closure Component', () => {
    const Child = DI(
      {
        providers: [valueProvider(SELF, 'own value')],
      },
      ({ attrs: { injector } }) => {
        const parent = injector.get(PARENT)
        const self = injector.get(SELF)
        return {
          view: () => [parent, self],
        }
      },
    )

    it('injects own provided value', () => {
      m.mount(el, {
        view: () => m(Parent, {}, m(Child)),
      })
      expect(el.innerHTML).toContain('own value')
    })

    it('injects parent value', () => {
      m.mount(el, {
        view: () => m(Parent, {}, m(Child)),
      })
      expect(el.innerHTML).toContain('parent value')
    })
  })

  describe('POJO Component', () => {
    const Child = DI(
      {
        providers: [valueProvider(SELF, 'own value')],
      },
      {
        oninit: ({ attrs, state }) => {
          state.parent = attrs.injector.get(PARENT)
          state.self = attrs.injector.get(SELF)
        },
        view: ({ state }) => [state.parent, state.self],
      },
    )

    it('injects own provided value', () => {
      m.mount(el, {
        view: () => m(Parent, {}, m(Child)),
      })
      expect(el.innerHTML).toContain('own value')
    })

    it('injects parent value', () => {
      m.mount(el, {
        view: () => m(Parent, {}, m(Child)),
      })
      expect(el.innerHTML).toContain('parent value')
    })
  })

  describe('Class Component', () => {
    const Child = DI(
      {
        providers: [valueProvider(SELF, 'own value')],
      },
      class MyClass {
        public parent: string = null
        public self: string = null
        constructor({ attrs: { injector } }: Vnode<DIAttrs>) {
          this.parent = injector.get(PARENT)
          this.self = injector.get(SELF)
        }

        public view() {
          return [this.parent, this.self]
        }
      },
    )

    it('injects own provided value', () => {
      m.mount(el, {
        view: () => m(Parent, {}, m(Child)),
      })
      expect(el.innerHTML).toContain('own value')
    })

    it('injects parent value', () => {
      m.mount(el, {
        view: () => m(Parent, {}, m(Child)),
      })
      expect(el.innerHTML).toContain('parent value')
    })
  })

  describe('ClassComponent Decorator', () => {
    @DI({
      providers: [valueProvider(SELF, 'own value')],
    })
    class Child implements ClassComponent {
      @Inject(PARENT)
      public parent: string

      @Inject(SELF)
      public self: string

      public view() {
        return [this.parent, this.self]
      }
    }

    it('injects own provided value', () => {
      m.mount(el, {
        view: () => m(Parent, {}, m(Child)),
      })
      expect(el.innerHTML).toContain('own value')
    })

    it('injects parent value', () => {
      m.mount(el, {
        view: () => m(Parent, {}, m(Child)),
      })
      expect(el.innerHTML).toContain('parent value')
    })
  })

  describe('Array as provider options', () => {
    const Child = DI([
      valueProvider(SELF, 'own value')
    ], {
      oninit: ({ attrs, state }) => {
        state.parent = attrs.injector.get(PARENT)
        state.self = attrs.injector.get(SELF)
      },
      view: ({ state }) => [state.parent, state.self],
    })

    it('injects own provided value', () => {
      m.mount(el, {
        view: () => m(Parent, {}, m(Child)),
      })
      expect(el.innerHTML).toContain('own value')
    })

    it('injects parent value', () => {
      m.mount(el, {
        view: () => m(Parent, {}, m(Child)),
      })
      expect(el.innerHTML).toContain('parent value')
    })
  })

  describe('DI without provider', () => {
    const Child = DI({
      oninit: ({ attrs, state }) => {
        state.parent = attrs.injector.get(PARENT, '')
        state.self = attrs.injector.get(SELF, '')
      },
      view: ({ state }) => [state.parent, state.self],
    })

    it('injects own provided value', () => {
      m.mount(el, {
        view: () => m(Parent, {}, m(Child)),
      })
      expect(el.innerHTML).not.toContain('own value')
    })

    it('injects parent value', () => {
      m.mount(el, {
        view: () => m(Parent, {}, m(Child)),
      })
      expect(el.innerHTML).toContain('parent value')
    })
  })
})
