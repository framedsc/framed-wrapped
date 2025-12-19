import React, { ReactNode, useEffect } from "react";

export const LoadWrapper = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const animatedElements = new WeakSet<Element>();

    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries.filter(
          (entry) => entry.isIntersecting && !animatedElements.has(entry.target)
        );

        intersecting.sort(
          (a, b) =>
            a.target.getBoundingClientRect().top -
            b.target.getBoundingClientRect().top
        );

        intersecting.forEach((entry, index) => {
          const target = entry.target;
          animatedElements.add(target);
          observer.unobserve(target);

          setTimeout(() => {
            target.classList.remove("opacity-0");
            target.classList.remove("-translate-y-10");
          }, index * 200);
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -30% 0px", // Trigger when element is 30% up from bottom
        threshold: 0.1,
      }
    );

    requestAnimationFrame(() => {
      const allLoadElements = document.querySelectorAll(".load");
      allLoadElements.forEach((el) => observer.observe(el));
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return <>{children}</>;
};
