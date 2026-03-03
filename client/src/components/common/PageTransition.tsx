import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
    children: React.ReactNode;
}

/**
 * Wraps every route's content in a fade + slide-up transition.
 * Triggers on every route change.
 */
const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
    const location = useLocation();
    const [visible, setVisible] = useState(false);
    const prevKey = useRef(location.key);

    useEffect(() => {
        // When route changes, briefly hide then re-show
        if (prevKey.current !== location.key) {
            setVisible(false);
            prevKey.current = location.key;
            const t = setTimeout(() => setVisible(true), 30);
            return () => clearTimeout(t);
        } else {
            // Initial mount
            const t = setTimeout(() => setVisible(true), 60);
            return () => clearTimeout(t);
        }
    }, [location.key]);

    return (
        <div
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(14px)',
                transition: 'opacity 0.38s cubic-bezier(0.4,0,0.2,1), transform 0.38s cubic-bezier(0.4,0,0.2,1)',
                willChange: 'opacity, transform',
                minHeight: '100%',
            }}
        >
            {children}
        </div>
    );
};

export default PageTransition;
