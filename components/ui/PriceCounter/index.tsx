"use client";

import { useEffect, useRef, useState } from "react";
import { ANIMATION } from "@/constants";

type PriceCounterProps = {
  value: number;
};

export default function PriceCounter({ value }: PriceCounterProps) {
  const [display, setDisplay] = useState(value);
  const previousValue = useRef(value);

  useEffect(() => {
    const start = previousValue.current;
    const end = value;
    const duration = ANIMATION.priceCounterDurationMs;
    const startAt = performance.now();

    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min((now - startAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * eased;
      setDisplay(current);

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        previousValue.current = end;
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return <span>{display.toFixed(2)} TL</span>;
}
