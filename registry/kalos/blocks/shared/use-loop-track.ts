"use client";

import { useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";

const motionQuery = "(prefers-reduced-motion: reduce)";

function observeMotion(update: () => void) {
  const media = matchMedia(motionQuery);
  media.addEventListener("change", update);
  return () => media.removeEventListener("change", update);
}

export function useStaticTrack() {
  return useSyncExternalStore(observeMotion, () => matchMedia(motionQuery).matches, () => false);
}

type TrackOptions = {
  axis: "x" | "y";
  velocity: number;
  start: number;
  pauseOnHover: boolean;
};

const wrap = (position: number, extent: number) => ((position % extent) + extent) % extent;

// Each track has one semantic set, a leading copy, and enough trailing copies to cover its viewport.
export function useLoopTrack({ axis, velocity, start, pauseOnHover }: TrackOptions) {
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const original = useRef<HTMLUListElement>(null);
  const [copies, setCopies] = useState(3);

  useLayoutEffect(() => {
    const view = viewport.current;
    const belt = track.current;
    const set = original.current;
    if (!view || !belt || !set) return;
    const horizontal = axis === "x";
    const region = horizontal ? view.closest<HTMLElement>("[data-loop-region]") ?? view : view;
    let extent = 0;
    let scale = 1;
    let position = 0;
    let speed = 0;
    let seek = 0;
    let hovered = matchMedia("(hover: hover)").matches && region.matches(":hover");
    let focused = false;
    let held = false;
    let blockClick = false;
    let drag: { id: number; point: number; last: number; travel: number } | null = null;
    let frame = 0;
    let lastFrame = 0;

    function paint() {
      if (!belt || !extent) return;
      const offset = -(extent + position);
      belt.style.transform = horizontal ? `translate3d(${offset}px,0,0)` : `translate3d(0,${offset}px,0)`;
    }

    function measure() {
      if (!view || !set) return;
      const viewBox = view.getBoundingClientRect();
      const setBox = set.getBoundingClientRect();
      const length = horizontal ? view.clientWidth : view.clientHeight;
      scale = (horizontal ? viewBox.width : viewBox.height) / (length || 1) || 1;
      const next = (horizontal ? setBox.width : setBox.height) / scale;
      if (next <= 0) return;
      position = next * (extent ? position / extent : start);
      extent = next;
      setCopies(Math.max(3, 2 + Math.ceil(length / extent)));
      paint();
    }

    function advance(time: number) {
      const dt = lastFrame ? Math.min(0.05, (time - lastFrame) / 1000) : 0;
      lastFrame = time;
      if (extent > 0 && !drag) {
        const paused = held || focused || (pauseOnHover && hovered);
        const target = paused ? 0 : velocity;
        const coasting = Math.abs(speed - target) > Math.max(120, Math.abs(velocity) * 2);
        const tau = coasting ? 0.55 : paused ? 0.32 : 0.7;
        speed += (target - speed) * (1 - Math.exp(-dt / tau));
        const nudge = Math.abs(seek) < 0.5 ? seek : seek * (1 - Math.exp(-dt / 0.12));
        seek -= nudge;
        position += speed * dt + nudge;
        if (!focused) position = wrap(position, extent);
      }
      paint();
      frame = requestAnimationFrame(advance);
    }

    const point = (event: PointerEvent) => horizontal ? event.clientX : event.clientY;
    const enter = (event: PointerEvent) => { if (event.pointerType !== "touch") hovered = true; };
    const leave = () => { hovered = false; };

    function down(event: PointerEvent) {
      if (event.button !== 0 || !event.isPrimary) return;
      blockClick = false;
      if (!horizontal && event.pointerType === "touch") {
        held = true;
        return;
      }
      drag = { id: event.pointerId, point: point(event), last: event.timeStamp, travel: 0 };
      speed = 0;
      seek = 0;
    }

    function move(event: PointerEvent) {
      if (!view || !drag || drag.id !== event.pointerId || !extent) return;
      const coordinate = point(event);
      const delta = (coordinate - drag.point) / scale;
      const dt = Math.max(1, event.timeStamp - drag.last) / 1000;
      drag.travel += Math.abs(delta);
      if (drag.travel > 4 && !view.hasPointerCapture(event.pointerId)) {
        view.setPointerCapture(event.pointerId);
        view.setAttribute("data-dragging", "");
      }
      position = wrap(position - delta, extent);
      speed = speed * 0.6 - (delta / dt) * 0.4;
      drag.point = coordinate;
      drag.last = event.timeStamp;
      paint();
    }

    function up(event: PointerEvent) {
      held = false;
      if (!drag || drag.id !== event.pointerId) return;
      blockClick = drag.travel > 4;
      speed = event.timeStamp - drag.last > 80 ? 0 : Math.max(-2400, Math.min(2400, speed));
      drag = null;
      view?.removeAttribute("data-dragging");
    }

    function click(event: MouseEvent) {
      if (blockClick && event.detail > 0) {
        event.preventDefault();
        event.stopPropagation();
      }
      blockClick = false;
    }

    function focus(event: FocusEvent) {
      const target = event.target;
      focused = target instanceof HTMLElement && target.matches(":focus-visible");
      if (!focused || !(target instanceof HTMLElement) || !set?.contains(target) || !view || !extent) return;
      const setBox = set.getBoundingClientRect();
      const itemBox = target.getBoundingClientRect();
      const itemStart = (horizontal ? itemBox.left - setBox.left : itemBox.top - setBox.top) / scale;
      const itemSize = (horizontal ? itemBox.width : itemBox.height) / scale;
      const windowSize = horizontal ? view.clientWidth : view.clientHeight;
      const inset = Math.min(horizontal ? 96 : 56, windowSize * (horizontal ? 0.15 : 0.12));
      // A visually identical wrap puts the focusable original nearest to the viewport.
      position += Math.round((itemStart - position - windowSize / 2) / extent) * extent;
      const visibleStart = itemStart - position;
      const visibleEnd = visibleStart + itemSize;
      if (visibleStart < inset || itemSize > windowSize - inset * 2) seek = visibleStart - inset;
      else if (visibleEnd > windowSize - inset) seek = visibleEnd - windowSize + inset;
      else seek = 0;
      speed = 0;
      paint();
    }

    const blur = (event: FocusEvent) => {
      if (!(event.relatedTarget instanceof Node && region.contains(event.relatedTarget))) focused = false;
    };

    function key(event: KeyboardEvent) {
      if (!horizontal || (event.key !== "ArrowLeft" && event.key !== "ArrowRight")) return;
      const step = event.key === "ArrowLeft" ? -1 : 1;
      if (event.target === region) {
        event.preventDefault();
        seek += step * 160;
      } else if (event.target instanceof HTMLAnchorElement && set?.contains(event.target)) {
        const links = Array.from(set.querySelectorAll<HTMLAnchorElement>("a[href]"));
        const next = links[links.indexOf(event.target) + step];
        if (next) {
          event.preventDefault();
          next.focus({ preventScroll: true });
        }
      }
    }

    const resize = new ResizeObserver(measure);
    resize.observe(view);
    resize.observe(set);
    measure();
    const intersection = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(frame);
      lastFrame = 0;
      if (entry.isIntersecting) frame = requestAnimationFrame(advance);
    });
    intersection.observe(view);

    const listeners = new AbortController();
    const options = { signal: listeners.signal };
    region.addEventListener("pointerenter", enter, options);
    region.addEventListener("pointerleave", leave, options);
    region.addEventListener("focusin", focus, options);
    region.addEventListener("focusout", blur, options);
    region.addEventListener("keydown", key, options);
    view.addEventListener("pointerdown", down, options);
    view.addEventListener("pointermove", move, options);
    view.addEventListener("lostpointercapture", up, options);
    view.addEventListener("click", click, { ...options, capture: true });
    window.addEventListener("pointerup", up, options);
    window.addEventListener("pointercancel", up, options);
    return () => {
      listeners.abort();
      resize.disconnect();
      intersection.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [axis, velocity, start, pauseOnHover]);

  return { viewport, track, original, copies };
}
