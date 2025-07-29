// Utility functions that can be shared across modules

export const clamp = (value, min, max) => {
    return Math.max(min, Math.min(max, value));
};

export const lerp = (start, end, amount) => {
    return start + (end - start) * amount;
};

export const distance = (pos1, pos2) => {
    return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2));
};

export const direction = (from, to) => {
    const dist = distance(from, to);
    if (dist === 0) return { x: 0, y: 0 };
    return {
        x: (to.x - from.x) / dist,
        y: (to.y - from.y) / dist
    };
};

export const randomRange = (min, max) => {
    return Math.random() * (max - min) + min;
};

export const randomChoice = (array) => {
    return array[Math.floor(Math.random() * array.length)];
};

export const easeInOut = (t) => {
    return t < 0.5
        ? 2 * t * t
        : -1 + (4 - 2 * t) * t;
};

export const easeOut = (t) => {
    return 1 - Math.pow(1 - t, 3);
};

export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

export const throttle = (func, limit) => {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

export const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const isInViewport = (element) => {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
};

export const hexToRgba = (hex, alpha = 1) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${alpha})`
        : null;
};

export const rgbaToHex = (rgba) => {
    const parts = rgba.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
    if (!parts) return null;

    const r = parseInt(parts[1]).toString(16).padStart(2, '0');
    const g = parseInt(parts[2]).toString(16).padStart(2, '0');
    const b = parseInt(parts[3]).toString(16).padStart(2, '0');

    return `#${r}${g}${b}`;
};

export const createElement = (tag, className, innerHTML = '') => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (innerHTML) element.innerHTML = innerHTML;
    return element;
};

export const animateValue = (start, end, duration, onUpdate, onComplete) => {
    const startTime = Date.now();

    const update = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const value = lerp(start, end, easeOut(progress));

        onUpdate(value);

        if (progress < 1) {
            requestAnimationFrame(update);
        } else if (onComplete) {
            onComplete();
        }
    };

    update();
};