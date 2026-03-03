import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * A thin gradient progress bar rendered at the very bottom of the navbar.
 * - Fills left→right as the user scrolls deeper into the page.
 * - Resets to 0 instantly whenever the route changes.
 * - Uses requestAnimationFrame for buttery-smooth 60fps interpolation.
 */
const ScrollProgress: React.FC = () => {
    const [progress, setProgress] = useState(0);
    const rafRef = useRef<number | null>(null);
    const currentRef = useRef(0);
    const location = useLocation();

    // ── Reset on route change ──────────────────────────────
    useEffect(() => {
        currentRef.current = 0;
        setProgress(0);
    }, [location.pathname]);

    // ── Smooth scroll tracking ─────────────────────────────
    useEffect(() => {
        const getScrollPercent = () => {
            const el = document.documentElement;
            const scrollTop = window.scrollY || el.scrollTop;
            const scrollHeight = el.scrollHeight - el.clientHeight;
            return scrollHeight <= 0 ? 0 : Math.min(100, (scrollTop / scrollHeight) * 100);
        };

        // Lerp towards target for smoothness
        const tick = () => {
            const target = getScrollPercent();
            const diff = target - currentRef.current;
            // Snap when very close, otherwise lerp
            if (Math.abs(diff) < 0.05) {
                currentRef.current = target;
            } else {
                currentRef.current += diff * 0.12;
            }
            setProgress(currentRef.current);
            rafRef.current = requestAnimationFrame(tick);
        };

        rafRef.current = requestAnimationFrame(tick);
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    return (
        <div
            style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: 'rgba(220,88,62,0.12)',
                overflow: 'hidden',
                zIndex: 60,
            }}
        >
            <div
                style={{
                    height: '100%',
                    width: `${progress}%`,
                    background: 'linear-gradient(90deg, var(--color-solidOne) 0%, var(--color-solid) 50%, var(--color-solidTwo) 100%)',
                    // No CSS transition – RAF handles the lerp
                    borderRadius: '0 2px 2px 0',
                    boxShadow: '0 0 8px rgba(220,88,62,0.6)',
                    willChange: 'width',
                }}
            />
        </div>
    );
};

export default ScrollProgress;
