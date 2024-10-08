export interface JoystikkOptions {
    zone: HTMLElement;
    size: number;
    pos: { left: string; top: string };
    style: {
        baseColor: string;
        stickColor: string;
        border: string;
        opacity: number;
        fadeInTime: number;
        fadeOutTime: number;
        smoothing: number;
    };
    onStart?: () => void;
    onMove?: (angle: number, force: number) => void;
    onEnd?: () => void;
}

export function Joystikk(options: JoystikkOptions) {
    const base = document.createElement('div');
    const stick = document.createElement('div');

    const commonStyle = (e: HTMLElement, scale: number) => {
        e.style.width = `${options.size * scale}px`;
        e.style.height = `${options.size * scale}px`;
        e.style.borderRadius = '50%';
        e.style.border = options.style.border;
        e.style.position = 'absolute';
        e.style.transform = 'translate(-50%, -50%)';
    };

    base.style.backgroundColor = options.style.baseColor;
    commonStyle(base, 1);
    base.style.left = options.pos.left;
    base.style.top = options.pos.top;
    base.style.opacity = options.style.opacity.toString();
    base.style.transition = `opacity ${options.style.fadeInTime}s`;

    stick.style.backgroundColor = options.style.stickColor;
    commonStyle(stick, 0.5);
    stick.style.left = `${options.size / 2}px`;
    stick.style.top = `${options.size / 2}px`;
    stick.style.transitionDuration = `${options.style.smoothing}s`;

    base.appendChild(stick);
    options.zone.appendChild(base);

    const origin = { x: 0, y: 0 };

    options.zone.addEventListener('touchstart', (e: TouchEvent) => {
        e.preventDefault();
        const touch = e.targetTouches[0];
        if (!touch)
            return;

        const bounds = options.zone.getBoundingClientRect();
        origin.x = touch.clientX;
        origin.y = touch.clientY;
        base.style.left = `${origin.x - bounds.left}px`;
        base.style.top = `${origin.y - bounds.top}px`;
        base.style.transition = `opacity ${options.style.fadeInTime}s`;
        base.style.opacity = '1';

        options.onStart?.();
    });

    options.zone.addEventListener('touchmove', (e: TouchEvent) => {
        e.preventDefault();
        const touch = e.targetTouches[0];
        if (!touch)
            return;

        const dx = touch.clientX - origin.x;
        const dy = origin.y - touch.clientY;
        const angle = Math.atan2(dy, dx);
        const dst = Math.min(options.size / 2, (dx ** 2 + dy ** 2) ** 0.5);
        const force = dst / (options.size / 2);

        const stickX = Math.cos(angle) * dst + options.size / 2;
        const stickY = -Math.sin(angle) * dst + options.size / 2;
        stick.style.left = `${stickX}px`;
        stick.style.top = `${stickY}px`;

        options.onMove?.(angle, force);
    });

    const onEnd = (e: TouchEvent) => {
        e.preventDefault();

        const stickX = options.size / 2;
        const stickY = options.size / 2;
        stick.style.left = `${stickX}px`;
        stick.style.top = `${stickY}px`;

        base.style.transition = `opacity ${options.style.fadeOutTime}s`;
        base.style.opacity = options.style.opacity.toString();
        base.style.left = options.pos.left;
        base.style.top = options.pos.top;

        options.onEnd?.();
    };
    options.zone.addEventListener('touchend', e => onEnd(e));
    options.zone.addEventListener('touchcancel', e => onEnd(e));
}