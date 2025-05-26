import { useEffect, useRef, useState } from "react";

export const useDynamicInnerRadius = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [radius, setRadius] = useState(20);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        const dynamicRadius = Math.max(30, Math.min(80, width / 10));
        setRadius(dynamicRadius);
      }
    });

    if (ref.current) {
      resizeObserver.observe(ref.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  return { ref, radius };
};
