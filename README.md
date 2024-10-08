# Joystikk

[![npm](https://img.shields.io/npm/v/joystikk)](https://www.npmjs.com/package/joystikk)
[![npm](https://img.shields.io/npm/dm/joystikk)](https://www.npmjs.com/package/joystikk)
[![GitHub](https://img.shields.io/github/license/eekelof/joystikk)](https://github.com/git/git-scm.com/blob/main/MIT-LICENSE.txt)

Virtual joystick for mobile apps

## Features
- :joystick: Simple virtual joystick
- :hammer: Customizable style
- :zap: Zero dependencies

## Installation
```bash
npm i joystikk
```

## Usage
```typescript
import { Joystick } from 'joystick';

const onStart = () => console.log("on start");
const onMove = (angle: number, force: number) => console.log("on move", angle, force);
const onEnd = () => console.log("on end");

Joystick({
    zone: document.getElementById("joystickZone"),
    size: 192,
    pos: { left: '10%', top: '70%' },
    style: {
        stickColor: "#fff2",
        border: "2px solid #fff8",
        baseColor: "#fff2",
        opacity: 0.3,
        fadeInTime: 0.2,
        fadeOutTime: 0.5,
        smoothing: 0.05,
    },
    onStart,
    onMove,
    onEnd
});
```

## License
MIT