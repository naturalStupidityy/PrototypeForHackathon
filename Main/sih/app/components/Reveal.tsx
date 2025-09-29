"use client";

import { PropsWithChildren, useEffect, useRef, useState, HTMLAttributes } from "react";

type RevealProps = PropsWithChildren<
  {
    as?: keyof JSX.IntrinsicElements;
    delayMs?: number;
    className?: string;
    href?: string;
  } & HTMLAttributes<HTMLElement>
>;

export function Reveal({ as = "div", delayMs = 0, className, children, href, ...rest }: RevealProps) {
  const Comp = as as any;
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current as Element | null;
    if (!node) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setTimeout(() => setVisible(true), delayMs);
            obs.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [delayMs]);

  return (
    <Comp
      ref={ref as any}
      href={href}
      className={[
        "transition-all duration-700 will-change-transform",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        className || "",
      ].join(" ")}
      {...rest}
    >
      {children}
    </Comp>
  );
}


