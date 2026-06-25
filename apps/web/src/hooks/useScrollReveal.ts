import { useEffect } from "react";

export function useScrollReveal(
  selector = ".scene-reveal, .reveal-on-scroll",
  rootMargin = "0px 0px -10% 0px",
  deps: readonly unknown[] = [],
) {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>(selector));
    if (!elements.length) return;
    elements.forEach((element) => element.classList.add("reveal-on-scroll"));

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || !("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { rootMargin, threshold: 0.08 });

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [rootMargin, selector, ...deps]);
}
