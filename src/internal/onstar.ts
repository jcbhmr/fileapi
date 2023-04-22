/**
 * Defines a `.onevent` property like `.onchange` depending on the name passed
 * as the argument.
 *
 * An event handler IDL attribute is an IDL attribute for a specific event
 * handler. The name of the IDL attribute is the same as the name of the event
 * handler.
 *
 * @see https://gist.github.com/jcbhmr/a124f49fe1de9c8485d70421e0031611
 * @see https://html.spec.whatwg.org/multipage/webappapis.html#event-handler-idl-attributes
 */
function onstar<T extends typeof EventTarget>(class_: T, name: string): void {
  name = "" + name;

  const handler = new WeakMap<any, ((event: Event) => any) | null>();

  Object.defineProperty(class_.prototype, "on" + name, {
    get(this: T["prototype"]): ((event: Event) => any) | null {
      // The getter of an event handler IDL attribute with name name, when called, must run these steps:

      // 1. Let eventTarget be the result of determining the target of an event handler given this object and name.
      const eventTarget = this ?? globalThis;

      // 2. If eventTarget is null, then return null.
      if (eventTarget == null) {
        return null;
      }

      // 3. Return the result of getting the current value of the event handler given eventTarget and name.
      if (!handler.has(this)) {
        handler.set(this, null);
      }
      return handler.get(this)!;
    },
    set(this: T["prototype"], value: ((event: Event) => any) | null): void {
      if (!(typeof value === "function" || typeof value === "object")) {
        value = null;
      }

      // The setter of an event handler IDL attribute with name name, when called, must run these steps:

      // 1. Let eventTarget be the result of determining the target of an event handler given this object and name.
      const eventTarget = this ?? globalThis;

      // 2. If eventTarget is null, then return.
      if (eventTarget == null) {
        return;
      }

      // 3. If the given value is null, then deactivate an event handler given eventTarget and name.
      if (value == null) {
        if (handler.has(this)) {
          eventTarget.removeEventListener(name, handler.get(this)!);
          handler.delete(this);
        }
      }

      // 4. Otherwise:
      else {
        // 1. Let handlerMap be eventTarget's event handler map.
        // 2. Let eventHandler be handlerMap[name].
        // 3. Set eventHandler's value to the given value.
        // 4. Activate an event handler given eventTarget and name.
        eventTarget.addEventListener(name, value);
        handler.set(this, value);
      }
    },
    configurable: true,
  });
}

export default onstar;
