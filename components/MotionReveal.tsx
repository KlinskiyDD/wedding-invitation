"use client";

import { useEffect } from "react";

const revealSelector = "[data-motion-reveal]";

export function MotionReveal() {
  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>(revealSelector),
    );

    if (!elements.length) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      elements.forEach((element) => {
        element.dataset.motionVisible = "true";
      });
      return;
    }

    elements.forEach((element) => {
      if (element.dataset.motionDelay) {
        element.style.setProperty(
          "--motion-delay",
          `${element.dataset.motionDelay}ms`,
        );
      }

      delete element.dataset.motionVisible;
    });

    document.documentElement.classList.add("motion-ready");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            target.dataset.motionVisible = "true";
          } else {
            delete target.dataset.motionVisible;
          }
        });
      },
      {
        rootMargin: "0px 0px -8% 0px",
        threshold: 0.12,
      },
    );

    elements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("motion-ready");
    };
  }, []);

  return null;
}
