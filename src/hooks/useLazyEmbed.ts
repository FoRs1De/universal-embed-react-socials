import { useEffect, useRef, useState, type MutableRefObject } from 'react';

/** Assign the same node to a layout box ref and the lazy-load observer ref. */
export const mergeBoxRef =
  (boxRef: MutableRefObject<HTMLDivElement | null>, lazyRef: MutableRefObject<HTMLDivElement | null>) =>
  (node: HTMLDivElement | null) => {
    boxRef.current = node;
    lazyRef.current = node;
  };

/** When `lazy` is set, keep the embed unloaded until it is near the viewport. */
export const useLazyEmbed = (
  embedDisabled = false,
  lazy = false,
): { ref: MutableRefObject<HTMLDivElement | null>; disabled: boolean } => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(!lazy);

  useEffect(() => {
    if (!lazy || embedDisabled || visible) {
      return;
    }
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
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
  }, [embedDisabled, lazy, visible]);

  return { ref, disabled: embedDisabled || (lazy && !visible) };
};
