import { useEffect, useRef } from "react";

export default function useTooltip(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current || !window.bootstrap) return;

    const tooltip = new window.bootstrap.Tooltip(ref.current, {
      placement: "top",
      trigger: "hover focus",
      ...options,
    });

    return () => tooltip.dispose();
  }, [options]);

  return ref;
}