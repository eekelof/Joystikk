# Joystikk :joystick:

[![npm](https://img.shields.io/npm/v/joystikk)](https://www.npmjs.com/package/joystikk)
[![npm](https://img.shields.io/npm/dm/joystikk)](https://www.npmjs.com/package/joystikk)
[![GitHub](https://img.shields.io/github/license/eekelof/joystikk)](https://github.com/git/git-scm.com/blob/main/MIT-LICENSE.txt)

## Features
- :joystick: Virtual joystick
- :hammer: Customizable
- :zap: Zero dependencies

## Usage
```bash
npm i joystikk
```

```javascript
import { Joystikk } from 'joystikk';

const onStart = () => console.log("on start");
const onMove = (angle, force) => console.log("on move", angle, force);
const onEnd = () => console.log("on end");

Joystikk({
    zone: document.getElementById("zone"),
    size: 300,
    pos: { left: '10%', top: '70%' },
    style: {
        restingOpacity: 0.1,
    },
    onStart,
    onMove,
    onEnd
});
```

### Options (default values)
```javascript
return {
    zone: document.body,
    dynamic: true,
    size: 200,
    pos: {
        left: '50%',
        top: '50%'
    },
    lock:{
        x: false,        
        y: false        
    },
    style: {
        base: {
            scale: 1,
            backgroundColor: '#fff2',
            border: '2px solid #fff8',
            boxShadow: 'none',
        },
        stick: {
            scale: 0.5,
            backgroundColor: '#fff2',
            border: '2px solid #fff8',
            boxShadow: 'none',
        },
        fadeInTime: 0.2,
        fadeOutTime: 0.5,
        dragTime: 0.05,
        restingOpacity: 0.3
    },
    onStart: () => { },
    onMove: () => { },
    onEnd: () => { }
};
```

## License
MIT