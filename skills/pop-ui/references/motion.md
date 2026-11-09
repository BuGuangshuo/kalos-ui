# Motion recipes

These are customization recipes, not a bundled animation API. Reuse the project's motion library where one exists. CSS transitions and Vue `<Transition>` / `<TransitionGroup>` are enough for many effects; use `motion/react` in a React project only when its behavior warrants that dependency.

- **Save feedback:** idle → loading → saved/error. Disable repeat submission, set `aria-busy`, await the real operation, and announce the outcome. A demo timeout must not replace actual persistence in a production flow.
- **List changes:** stable item keys, enter/exit fade and 8–12px translation, and a short layout transition. Vue can use `<TransitionGroup>`; React can use the existing motion library's presence/layout mechanism.
- **Icon feedback:** rotate a bell around its top with a decreasing sequence (0, -16, 12, -8, 0 degrees). Run on a user action and restore its position; avoid mandatory continuous motion.
- **Panels and forms:** preserve trigger focus, Escape, labels, and validation semantics supplied by the underlying primitive. Animate content wrappers instead of replacing its accessibility structure.

Start with 160–240ms ease-out transitions, or a spring around stiffness 400 and damping 28 where supported. Small press feedback may use scale .97. Keep long-running loops paused offscreen. Respect `prefers-reduced-motion`: remove decorative movement and preserve immediate state feedback. Avoid `transition: all`; animate transform/opacity where possible.
