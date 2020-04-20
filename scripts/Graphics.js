/*

Class that handles Chip8 graphics calls. Whenever a Chip8 instance is 
created, that instance is bound to a Graphics object. Moreover, the 
Graphics object is also bound to the Chip8 instance itself.

The Chip8's graphics buffer is of resolution 32X64 bits. This is
scaled up 10 fold to 320X640.

*/

export class Graphics {

    // constructor takes in a canvas context as an argument
    constructor(ctx) {
        this.ctx = ctx;
        this.chip8 = {};

        // clear the canvas, and fill it black
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    };

    // function that is called whenever the Chip8 needs to
    // draw its graphics buffer
    drawBuffer = () => {

        // first clear the screen and fill it black
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        // Chip8 graphics buffer is a 32 X 64 2d array. Iterate through
        // this array, and clear a corresponding square in the canvas buffer
        // or set it(with color #f222ff).
        for (let y = 0; y < 32; y++) {
            for (let x = 0; x < 64; x++) {
                let color = (this.chip8.pixelTest(x, y)) ? '#f222ff' : 'black';
                this.ctx.fillStyle = color;
                this.ctx.fillRect(x * 10, y * 10, 10, 10);
            };
        };
    };
};