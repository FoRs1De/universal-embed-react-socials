import { useLayoutEffect, useRef, useState, type MutableRefObject } from 'react';

export const useLazyEmbed = (
  embedDisabled = false,
  lazy = false,
  boxRef?: MutableRefObject<HTMLDivElement | null>,
): { ref: MutableRefObject<HTMLDivElement | null>; disabled: boolean } => {
  const localRef = useRef<HTMLDivElement | null>(null);
  const ref = boxRef ?? localRef;
  const [visible, setVisible] = useState(!lazy);
  const [nodeRetry, setNodeRetry] = useState(0);

  useLayoutEffect(() => {
    if (!lazy || embedDisabled || visible) {
      return;
    }
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const node = ref.current;
    if (!node) {
      if (nodeRetry > 0) {
        setVisible(true);
        return;
      }
      const id = requestAnimationFrame(() => setNodeRetry(1));
      return () => cancelAnimationFrame(id);
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px', threshold: 0 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [embedDisabled, lazy, nodeRetry, visible]);

  return { ref, disabled: embedDisabled || (lazy && !visible) };
};
