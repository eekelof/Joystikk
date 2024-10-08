export interface JoystikkOptions {
    zone: HTMLElement;
    size: number;
    pos: { left: string; top: string };
    style: {
        stickColor: string;
        border: string;
        baseColor: string;
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
    const baseElement = document.createElement('div');
    const stickElement = document.createElement('div');

    const commonStyle = (e: HTMLElement, scale: number) => {
        e.style.width = `${options.size * scale}px`;
        e.style.height = `${options.size * scale}px`;
        e.style.borderRadius = '50%';
        e.style.border = options.style.border;
        e.style.position = 'absolute';
        e.style.transform = 'translate(-50%, -50%)';
    };

    baseElement.style.backgroundColor = options.style.baseColor;
    commonStyle(baseElement, 1);
    baseElement.style.left = options.pos.left;
    baseElement.style.top = options.pos.top;
    baseElement.style.opacity = options.style.opacity.toString();
    baseElement.style.transition = `opacity ${options.style.fadeInTime}s`;

    stickElement.style.backgroundColor = options.style.stickColor;
    commonStyle(stickElement, 0.5);
    stickElement.style.left = `${options.size / 2}px`;
    stickElement.style.top = `${options.size / 2}px`;
    stickElement.style.transitionDuration = `${options.style.smoothing}s`;

    baseElement.appendChild(stickElement);
    options.zone.appendChild(baseElement);

    const origin = { x: 0, y: 0 };

    options.zone.addEventListener('touchstart', (e: TouchEvent) => {
        e.preventDefault();
        const touch = e.targetTouches[0];
        if (!touch)
            return;

        const bounds = options.zone.getBoundingClientRect();
        origin.x = touch.clientX;
        origin.y = touch.clientY;
        baseElement.style.left = `${origin.x - bounds.left}px`;
        baseElement.style.top = `${origin.y - bounds.top}px`;
        baseElement.style.transition = `opacity ${options.style.fadeInTime}s`;
        baseElement.style.opacity = '1';

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
        stickElement.style.left = `${stickX}px`;
        stickElement.style.top = `${stickY}px`;

        options.onMove?.(angle, force);
    });

    const onEnd = (e: TouchEvent) => {
        e.preventDefault();

        const stickX = options.size / 2;
        const stickY = options.size / 2;
        stickElement.style.left = `${stickX}px`;
        stickElement.style.top = `${stickY}px`;

        baseElement.style.transition = `opacity ${options.style.fadeOutTime}s`;
        baseElement.style.opacity = options.style.opacity.toString();
        baseElement.style.left = options.pos.left;
        baseElement.style.top = options.pos.top;

        options.onEnd?.();
    };
    options.zone.addEventListener('touchend', e => onEnd(e));
    options.zone.addEventListener('touchcancel', e => onEnd(e));
}