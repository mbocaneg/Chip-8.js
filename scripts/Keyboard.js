export class Keyboard {
    constructor() {
        this.chip8 = {};
        this.keyboardState = 0;
    };

    init = () => {
        document.addEventListener('keydown', (e) => {
            switch (e.code) {
                case 'Digit1':
                    this.keySet(0x1);
                    break;
                case 'Digit2':
                    this.keySet(0x2);
                    break;
                case 'Digit3':
                    this.keySet(0x3);
                    break;
                case 'Digit4':
                    this.keySet(0xC);
                    break;

                case 'KeyQ':
                    this.keySet(0x4);
                    break;
                case 'KeyW':
                    this.keySet(0x5);
                    break;
                case 'KeyE':
                    this.keySet(0x6);
                    break;
                case 'KeyR':
                    this.keySet(0xD);
                    break;

                case 'KeyA':
                    this.keySet(0x7);
                    break;
                case 'KeyS':
                    this.keySet(0x8);
                    break;
                case 'KeyD':
                    this.keySet(0x9);
                    break;
                case 'KeyF':
                    this.keySet(0xE);
                    break;

                case 'KeyZ':
                    this.keySet(0xA);
                    break;
                case 'KeyX':
                    this.keySet(0x0);
                    break;
                case 'KeyC':
                    this.keySet(0xB);
                    break;
                case 'KeyV':
                    this.keySet(0xF);
                    break;

                default:
                    break;
            }
        });

        document.addEventListener('keyup', (e) => {

            switch (e.code) {
                case 'Digit1':
                    this.keyReset(0x1);
                    break;
                case 'Digit2':
                    this.keyReset(0x2);
                    break;
                case 'Digit3':
                    this.keyReset(0x3);
                    break;
                case 'Digit4':
                    this.keyReset(0xC);
                    break;

                case 'KeyQ':
                    this.keyReset(0x4);
                    break;
                case 'KeyW':
                    this.keyReset(0x5);
                    break;
                case 'KeyE':
                    this.keyReset(0x6);
                    break;
                case 'KeyR':
                    this.keyReset(0xD);
                    break;

                case 'KeyA':
                    this.keyReset(0x7);
                    break;
                case 'KeyS':
                    this.keyReset(0x8);
                    break;
                case 'KeyD':
                    this.keyReset(0x9);
                    break;
                case 'KeyF':
                    this.keyReset(0xE);
                    break;

                case 'KeyZ':
                    this.keyReset(0xA);
                    break;
                case 'KeyX':
                    this.keyReset(0x0);
                    break;
                case 'KeyC':
                    this.keyReset(0xB);
                    break;
                case 'KeyV':
                    this.keyReset(0xF);
                    break;

                default:
                    break;
            }
        });
    }

    keySet = (k) => {
        this.chip8.regKey |= (1 << (k));
    };

    keyReset = (k) => {
        this.chip8.regKey &= ~(1 << (k));
    };

};