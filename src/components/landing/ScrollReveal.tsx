"use client";

import { useEffect, useRef, useState } from "react";

// ============================================================
// ScrollReveal — Wrapper que anima hijos al entrar al viewport
// Usa IntersectionObserver para triggers eficientes
// ============================================================

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // ms delay
  direction?: "up" | "down" | "left" | "right" | "none";
  duration?: number; // ms
  once?: boolean; // solo animación una vez (default true)
}

export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  duration = 600,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  const transforms: Record<string, string> = {
    up: "translateY(30px)",
    down: "translateY(-30px)",
    left: "translateX(30px)",
    right: "translateX(-30px)",
    none: "none",
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "none" : transforms[direction],
        transition: `opacity ${duration}ms ease-out ${delay}ms, transform ${duration}ms ease-out ${delay}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}

// ============================================================
// ScrollRevealGroup — Versión que aplica delays escalonados
// a cada hijo directo (para grids, listas, etc.)
// ============================================================

interface ScrollRevealGroupProps {
  children: React.ReactNode;
  className?: string;
  stagger?: number; // ms entre cada hijo
  direction?: "up" | "down" | "left" | "right" | "none";
}

export function ScrollRevealGroup({
  children,
  className = "",
  stagger = 100,
  direction = "up",
}: ScrollRevealGroupProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -30px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const transforms: Record<string, string> = {
    up: "translateY(24px)",
    down: "translateY(-24px)",
    left: "translateX(24px)",
    right: "translateX(-24px)",
    none: "none",
  };

  return (
    <div ref={ref} className={className}>
      {Array.isArray(children)
        ? children.map((child, i) => (
            <div
              key={i}
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "none" : transforms[direction],
                transition: `opacity 500ms ease-out ${i * stagger}ms, transform 500ms ease-out ${i * stagger}ms`,
              }}
            >
              {child}
            </div>
          ))
        : children}
    </div>
  );
}
