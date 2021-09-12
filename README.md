# Mithril DI

This library implements a dependency injection mechanism for mithril js.

# How to

es6 import

```ts
import { DI } from 'mithril-di'
```

commonjs import

```ts
const { DI } = require('mithril-di')
```

## Basics

Use the `DI` function to wrap your component definition whenever a component should **provide** or **inject** data.

To make a component a provider of something, pass a `providers` array as part of the options argument (1st argument).
The `providers` syntax is the same as

```ts
const Parent = DI(
  // DI options
  {
    providers: [{ provide: 'greetings', useValue: 'Hello World' }],
  },
  // component definition
  () => {
    return {
      view: () => m(Child),
    }
  },
)
```

A component that is wrapped by the `DI` function will be given an additional `injector` attribute which then can be used to access provided data.

## Closure Components

The `injector` attribute can be consumed in all lifecycle methods.
However, for closure components one would most likely inject at the beginning of closure.

```ts
const Child = DI(({ attrs }) => {
  const text = attrs.injector.get('greetings')
  return {
    view: () => text, // -> Hello World
  }
})
```

## POJO Components

POJO components dont have a constructor, so the next best place to use the `injector` would be the `oninit` lifecycle method

```ts
const Child = DI({
  oninit: ({ attrs, state }) => {
    state.text = attrs.injector.get('greetings')
  },
  view: ({ state }) => {
    return state.text
  },
})
```

## Class Components

Class components may also be wrapped with the `DI` function. It looks a bit strange, but the `DI` behavior is consistent with the previous examples: `injector` is available in all lifecycle methods as well as in the `constructor`

```ts
const Child = DI(
  class {
    text: string
    constructor(n) {
      this.text = n.attrs.injector.get('greetings')
    }
    view() {
      return text
    }
  },
)
```

## Class Components (decorators)

The `DI` function also acts as a class decorator. Together with the `Inject` decorator this results in a cleaner syntax.

The main draw back is that the injection happens right before the `view` method. You can not use the injected data inside `oninit` but only inside `view` and `oncreate`.

```ts
import { DI, Inject } from 'mithril-di'

@DI()
class Child {
  @Inject('greetings')
  private text

  oninit() {
    console.log(this.text) // -> undefined
  }

  oncreate() {
    console.log(this.text) // -> "Hello World"
  }

  view() {
    console.log(this.text) // -> "Hello World"
    return this.text
  }
}
```

## Providers

### class provider

```ts
class MyService {
  constructor(injector: Injector) {}
}

DI(
  {
    providers: [
      {
        provide: MyService,
      },
    ],
  },
  (injector) => {
    injector.get(MyService)
    return {
      view: () => null,
    }
  },
)
```

### ClassProvider

```ts
class MyService {
  //
}

class AnotherService {
  constructor(injector: Injector) {}
}

DI(
  {
    providers: [
      {
        provide: MyService,
        useClass: AnotherService,
      },
    ],
  },
  (injector) => {
    injector.get(MyService) // -> instance of AnotherService
    return {
      view: () => null,
    }
  },
)
```

### value provider

```ts
class MyService {
  //
}

DI(
  {
    providers: [
      {
        provide: MyService,
        useValue: new MyService(),
      },
    ],
  },
  (injector) => {
    injector.get(MyService) //
    return {
      view: () => null,
    }
  },
)
```

### provider factory

```ts
class MyService {
  //
}

DI(
  {
    providers: [
      {
        provide: MyService,
        useFactory: (injector) => new MyService(injector),
      },
    ],
  },
  (injector) => {
    injector.get(MyService) //
    return {
      view: () => null,
    }
  },
)
```

### provider aliasing

```ts
class MyService1 {}

class MyService2 {}

DI(
  {
    providers: [
      { provide: MyService1 },
      {
        provide: MyService2,
        useExisting: MyService1,
      },
    ],
  },
  (injector) => {
    injector.get(MyService2) // -> instance of MyService1
    return {
      view: () => null,
    }
  },
)
```
