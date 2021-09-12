import { InjectionToken } from "../injector/injection-token"

export function stringify(item: any): string {
  if (!item) {
    return '<unknown>'
  }
  if (typeof item === 'symbol' || item instanceof InjectionToken) {
    return item.toString()
  }
  if (item.name) {
    return item.name
  }
  if (item.constructor && item.constructor.name) {
    return item.constructor.name
  }
  return item.toString()
}
