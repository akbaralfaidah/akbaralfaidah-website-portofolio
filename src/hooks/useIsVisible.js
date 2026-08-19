import { useState, useEffect, useRef } from 'react';

/**
 * Hook that tracks whether an element is visible in the viewport.
 * Returns a ref to attach to the element, a boolean state, and a ref for use in rAF loops.
 * 
 * The `isVisibleRef` is critical for animation loops — using the state value in 
 * useCallback dependencies would recreate the callback and break the rAF chain.
 */
export function useIsVisible(options = {}) {
  const elementRef = useRef(null);
  const isVisibleRef = useRef(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0, rootMargin: '200px', ...options }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { ref: elementRef, isVisible, isVisibleRef };
}
