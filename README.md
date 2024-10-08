# Joystikk :joystick:

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
```javascript
import { Joystikk } from 'joystikk';

const onStart = () => console.log("on start");
const onMove = (angle, force) => console.log("on move", angle, force);
const onEnd = () => console.log("on end");

Joystikk({
    zone: document.getElementById("zone"),
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