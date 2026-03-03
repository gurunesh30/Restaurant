import React, { useEffect, useRef, useState } from 'react';

interface Options {
    threshold?: number;
    rootMargin?: string;
    once?: boolean; // if true, stops observing after first intersection
}

/**
 * Returns [ref, isVisible].
 * Attach `ref` to any DOM element to know when it enters the viewport.
 */
export function useIntersection<T extends HTMLElement = HTMLDivElement>(
    options: Options = {}
): [React.RefObject<T>, boolean] {
    const { threshold = 0.12, rootMargin = '0px', once = true } = options;
    const ref = useRef<T>(null!);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    if (once) observer.disconnect();
                } else if (!once) {
                    setVisible(false);
                }
            },
            { threshold, rootMargin }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold, rootMargin, once]);

    return [ref, visible];
}
