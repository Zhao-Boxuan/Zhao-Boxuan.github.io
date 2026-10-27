// Reserved integration surface for a later GSAP pass.
// Components expose data-motion attributes so animation logic can remain decoupled.
export const motionSelectors = {
  reveal: '[data-motion="reveal"]',
  project: '[data-motion="project"]',
  section: '[data-motion="section"]',
} as const;
