interface PartStyle {
    scale: number;
    backgroundColor: string;
    border: string;
    boxShadow: string;
}

export interface JoystikkOptions {
    zone?: HTMLElement;
    dynamic?: boolean;
    size?: number;
    pos?: { left: string; top: string };
    style?: {
        base?: Partial<PartStyle>;
        stick?: Partial<PartStyle>;
        fadeInTime?: number;
        fadeOutTime?: number;
        dragTime?: number;
        restingOpacity?: number;
    };
    onStart?: () => void;
    onMove?: (angle: number, force: number) => void;
    onEnd?: () => void;
}

type JoystikkSettings = Required<JoystikkOptions> & {
    style: Required<NonNullable<JoystikkOptions['style']>> & {
        base: Required<PartStyle>;
        stick: Required<PartStyle>;
    };
};

export function Joystikk(options: JoystikkOptions) {
    const settings = getSettings(options);
    const base = document.createElement('div');
    const stick = document.createElement('div');
    setStyle(settings, base, stick);

    base.appendChild(stick);
    settings.zone.appendChild(base);

    const origin = { x: 0, y: 0 };
    const onStart = (e: TouchEvent) => {
        e.preventDefault();
        const touch = e.targetTouches[0];
        if (!touch)
            return;

        const bounds = settings.zone.getBoundingClientRect();

        if (settings.dynamic) {
            origin.x = touch.clientX;
            origin.y = touch.clientY;
            base.style.left = `${origin.x - bounds.left}px`;
            base.style.top = `${origin.y - bounds.top}px`;
        }
        else {
            origin.x = bounds.left + bounds.width / 2;
            origin.y = bounds.top + bounds.height / 2;
        }

        base.style.transition = `opacity ${settings.style.fadeInTime}s`;
        base.style.opacity = '1';

        settings.onStart();
    };

    const onMove = (e: TouchEvent) => {
        e.preventDefault();
        const touch = e.targetTouches[0];
        if (!touch)
            return;

        const radius = settings.size / 2;
        const dx = touch.clientX - origin.x;
        const dy = origin.y - touch.clientY;
        const angle = Math.atan2(dy, dx);
        const dst = Math.min(radius, (dx ** 2 + dy ** 2) ** 0.5);
        const force = dst / radius;

        const stickX = Math.cos(angle) * dst + radius;
        const stickY = -Math.sin(angle) * dst + radius;
        stick.style.left = `${stickX}px`;
        stick.style.top = `${stickY}px`;

        settings.onMove(angle, force);
    };

    const onEnd = (e: TouchEvent) => {
        e.preventDefault();

        const radius = settings.size / 2;
        const stickX = radius;
        const stickY = radius;
        stick.style.left = `${stickX}px`;
        stick.style.top = `${stickY}px`;

        base.style.transition = `opacity ${settings.style.fadeOutTime}s`;
        base.style.opacity = settings.style.restingOpacity.toString();
        base.style.left = settings.pos.left;
        base.style.top = settings.pos.top;

        settings.onEnd();
    };

    settings.zone.addEventListener('touchstart', onStart);
    settings.zone.addEventListener('touchmove', onMove);
    settings.zone.addEventListener('touchend', e => onEnd(e));
    settings.zone.addEventListener('touchcancel', e => onEnd(e));
}

function setPartStyle(e: HTMLElement, style: PartStyle, size: number) {
    e.style.width = `${size * style.scale}px`;
    e.style.height = `${size * style.scale}px`;
    e.style.borderRadius = '50%';
    e.style.border = style.border;
    e.style.position = 'absolute';
    e.style.transform = 'translate(-50%, -50%)';
    e.style.backgroundColor = style.backgroundColor;
    e.style.boxShadow = style.boxShadow;
}

function setStyle(o: JoystikkSettings, base: HTMLElement, stick: HTMLElement) {
    base.style.left = o.pos.left;
    base.style.top = o.pos.top;
    base.style.opacity = o.style.restingOpacity.toString();
    base.style.transition = `opacity ${o.style.fadeInTime}s`;

    setPartStyle(base, o.style.base, o.size);
    setPartStyle(stick, o.style.stick, o.size);

    const radius = o.size / 2;
    stick.style.left = `${radius}px`;
    stick.style.top = `${radius}px`;
    stick.style.transitionDuration = `${o.style.dragTime}s`;
}

function getSettings(options: JoystikkOptions): JoystikkSettings {
    const stickStyle = {
        scale: options.style?.stick?.scale ?? 0.5,
        backgroundColor: options.style?.stick?.backgroundColor ?? '#fff2',
        border: options.style?.stick?.border ?? '2px solid #fff8',
        boxShadow: options.style?.stick?.boxShadow ?? 'none',
    };
    const baseStyle = {
        scale: options.style?.base?.scale ?? 1,
        backgroundColor: options.style?.base?.backgroundColor ?? '#fff2',
        border: options.style?.base?.border ?? '2px solid #fff8',
        boxShadow: options.style?.base?.boxShadow ?? 'none',
    };
    return {
        zone: options.zone ?? document.body,
        dynamic: options.dynamic ?? true,
        size: options.size ?? 200,
        pos: options.pos ?? { left: '50%', top: '50%' },
        style: {
            base: baseStyle,
            stick: stickStyle,
            fadeInTime: options.style?.fadeInTime ?? 0.2,
            fadeOutTime: options.style?.fadeOutTime ?? 0.5,
            dragTime: options.style?.dragTime ?? 0.05,
            restingOpacity: options.style?.restingOpacity ?? 0.3
        },
        onStart: options.onStart ?? (() => { }),
        onMove: options.onMove ?? (() => { }),
        onEnd: options.onEnd ?? (() => { })
    };
}