export class Graphics {
    constructor(ctx) {
        this.ctx = ctx;
        this.chip8 = {};

        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    };

    drawBuffer = () => {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        for (let y = 0; y < 32; y++) {
            for (let x = 0; x < 64; x++) {
                let color = (this.chip8.pixelTest(x, y)) ? '#f222ff' : 'black';
                this.ctx.fillStyle = color;
                this.ctx.fillRect(x * 10, y * 10, 10, 10);
            };
        };
    };
};