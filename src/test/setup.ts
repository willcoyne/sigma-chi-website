import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

// vitest.config.js doesn't enable `test.globals`, so @testing-library/react's
// own auto-cleanup (which only registers itself when it finds a global
// `afterEach`) never kicks in. Without this, each test's rendered DOM leaks
// into the next test in the same file, which surfaces as bogus "found
// multiple elements" errors. Register cleanup explicitly instead.
afterEach(() => {
  cleanup();
});

// jsdom doesn't implement these browser APIs, but the app relies on them
// (ScrollToTop calls window.scrollTo; framer-motion's `whileInView`/Reveal
// components use IntersectionObserver/ResizeObserver). Stub them so
// rendering the real app tree doesn't crash or spam "not implemented" logs.
window.scrollTo = () => {};

class MockObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

if (typeof window.IntersectionObserver === "undefined") {
  // @ts-expect-error - MockObserver is an intentionally partial stand-in for the real IntersectionObserver
  window.IntersectionObserver = MockObserver;
  // @ts-expect-error - MockObserver is an intentionally partial stand-in for the real IntersectionObserver
  globalThis.IntersectionObserver = MockObserver;
}

if (typeof window.ResizeObserver === "undefined") {
  window.ResizeObserver = MockObserver;
  globalThis.ResizeObserver = MockObserver;
}

if (typeof window.matchMedia === "undefined") {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }) as MediaQueryList;
}

// jsdom's generated HTMLFormElement binding doesn't implement the WebIDL
// named-getter that every real browser provides, where a form's controls
// are readable as bare properties (e.g. `form.email` for
// `<input name="email">`) — only `form.elements.namedItem(...)` works.
// ContactForm's submit handler (and any future form) relies on that
// real-browser shorthand. Fix it by giving every <form> a prototype that
// falls back to `elements.namedItem(prop)` for any property jsdom doesn't
// already know about. This has to be done by swapping the *prototype* of
// each form (rather than wrapping the element itself in a Proxy) because
// jsdom's internal event-target bookkeeping is tied to the exact object
// identity `document.createElement` returns — a wrapper wouldn't be the
// object `event.target` resolves to during a real submit event.
const HTMLFormElementProto = Object.getPrototypeOf(document.createElement("form"));
const formProtoWithNamedAccess = new Proxy(HTMLFormElementProto, {
  get(target, prop, receiver) {
    // Look up `elements` via Reflect (not `receiver.elements`) to avoid
    // recursing back into this same trap.
    if (typeof prop === "string" && prop !== "elements") {
      const elements = Reflect.get(target, "elements", receiver);
      const namedControl = elements && elements.namedItem(prop);
      if (namedControl) return namedControl;
    }
    return Reflect.get(target, prop, receiver);
  },
});

const nativeCreateElement = document.createElement.bind(document);
document.createElement = function createElementWithNamedFormAccess(
  tagName: string,
  options?: ElementCreationOptions
): HTMLElement {
  const element = nativeCreateElement(tagName, options);
  if (typeof tagName === "string" && tagName.toLowerCase() === "form") {
    Object.setPrototypeOf(element, formProtoWithNamedAccess);
  }
  return element;
} as typeof document.createElement;
