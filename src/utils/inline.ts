import { ClosureComponent, Component } from "mithril"

export const Inline: ClosureComponent<{ view: Component['view'] }> = () => {
  return {
    view: (node) => node.attrs.view(node),
  }
}
