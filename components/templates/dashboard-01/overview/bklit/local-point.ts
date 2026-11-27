import { localPointFromSvg } from "./scatter-svg";

export interface LocalPoint {
  x: number;
  y: number;
}

interface ClientPointLike {
  clientX: number;
  clientY: number;
}

interface TouchEventLike {
  changedTouches: ArrayLike<ClientPointLike>;
}

/** Native/React mouse, pointer, touch or focus event, or a `Touch`. */
export type LocalPointEvent =
  | Event
  | ClientPointLike
  | TouchEventLike
  | { nativeEvent: Event; target: EventTarget | null };

function isElement(value: unknown): value is Element {
  return typeof Element !== "undefined" && value instanceof Element;
}

function isEvent(
  value: unknown
): value is Event | { nativeEvent: Event; target: EventTarget | null } {
  if (typeof Event === "undefined" || !value) {
    return false;
  }
  return (
    value instanceof Event ||
    ("nativeEvent" in (value as object) &&
      (value as { nativeEvent: unknown }).nativeEvent instanceof Event)
  );
}

function clientCoords(event: LocalPointEvent): LocalPoint {
  if ("changedTouches" in event) {
    const touch = event.changedTouches[0];
    return touch ? { x: touch.clientX, y: touch.clientY } : { x: 0, y: 0 };
  }
  if ("clientX" in event) {
    return { x: event.clientX, y: event.clientY };
  }
  // Focus (and other coordinate-less) events: centre of the target.
  const target = (event as { target?: unknown }).target;
  if (
    target &&
    typeof target === "object" &&
    "getBoundingClientRect" in target
  ) {
    const rect = (target as Element).getBoundingClientRect();
    return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
  }
  return { x: 0, y: 0 };
}

function localPointFromNode(node: Element, event: LocalPointEvent): LocalPoint {
  const coords = clientCoords(event);

  if (node instanceof SVGElement) {
    const svg = node instanceof SVGSVGElement ? node : node.ownerSVGElement;
    const point = localPointFromSvg(svg, coords.x, coords.y);
    if (point) {
      return point;
    }
  }

  // HTML overlays are positioned in layout pixels, even in a scaled chart.
  const rect = node.getBoundingClientRect();
  const scaleX =
    node instanceof HTMLElement && rect.width ? node.offsetWidth / rect.width : 1;
  const scaleY =
    node instanceof HTMLElement && rect.height ? node.offsetHeight / rect.height : 1;
  return {
    x: (coords.x - rect.left) * scaleX - node.clientLeft,
    y: (coords.y - rect.top) * scaleY - node.clientTop,
  };
}

export function localPoint(event: LocalPointEvent): LocalPoint | null;
export function localPoint(
  node: Element | null | undefined,
  event: LocalPointEvent
): LocalPoint | null;
export function localPoint(
  nodeOrEvent: Element | LocalPointEvent | null | undefined,
  maybeEvent?: LocalPointEvent
): LocalPoint | null {
  if (isElement(nodeOrEvent) && maybeEvent) {
    return localPointFromNode(nodeOrEvent, maybeEvent);
  }
  if (isEvent(nodeOrEvent)) {
    const node = nodeOrEvent.target;
    if (isElement(node)) {
      return localPointFromNode(node, nodeOrEvent);
    }
  }
  return null;
}
