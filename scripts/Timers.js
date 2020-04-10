var exec;
var sound;

export class Timers {
    constructor(){
        this.chip8 = {};
        this.isPlaying = false;

        this.a = new AudioContext();
        this.oscillator = null;
        this.u = this.a.createGain()
    }
    start = () => {
        clearInterval(exec);
        clearInterval(sound);

        exec = setInterval(() => {
            if(this.chip8.delay > 0)
                this.chip8.delay -= 1;
            if(this.chip8.sound > 0)
                this.chip8.sound -= 1;
        this.chip8.graphics.drawBuffer();
        }, 1000/30);

        sound = setInterval(() => {
            if(this.chip8.sound > 0 && !this.isPlaying){
                this.isPlaying = true;
                this.beepStart();
            }
            else if(this.chip8.sound === 0 && this.isPlaying){
                this.beepStop();
                this.isPlaying = false;
            }
        }, 1000/60);
    };

    beepStart = () => {
        this.oscillator = this.a.createOscillator()
        this.oscillator.connect(this.u)
        this.oscillator.frequency.value=400
        this.oscillator.type="square"
        this.u.connect(this.a.destination)
        this.u.gain.value=10*0.01
        this.oscillator.start();
    };

    beepStop = () => {
        this.oscillator.stop();
        this.oscillator.disconnect(0);
        this.oscillator = null;
    };
};