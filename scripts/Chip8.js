const CHIP8_FONT = [
  0xF0, 0x90, 0x90, 0x90, 0xF0, //0
  0x20, 0x60, 0x20, 0x20, 0x70, //1
  0xF0, 0x10, 0xF0, 0x80, 0xF0, //2
  0xF0, 0x10, 0xF0, 0x10, 0xF0, //3
  0x90, 0x90, 0xF0, 0x10, 0x10, //4
  0xF0, 0x80, 0xF0, 0x10, 0xF0, //5
  0xF0, 0x80, 0xF0, 0x90, 0xF0, //6
  0xF0, 0x10, 0x20, 0x40, 0x40, //7
  0xF0, 0x90, 0xF0, 0x90, 0xF0, //8
  0xF0, 0x90, 0xF0, 0x10, 0xF0, //9
  0xF0, 0x90, 0xF0, 0x90, 0x90, //A
  0xE0, 0x90, 0xE0, 0x90, 0xE0, //B
  0xF0, 0x80, 0x80, 0x80, 0xF0, //C
  0xE0, 0x90, 0x90, 0x90, 0xE0, //D
  0xF0, 0x80, 0xF0, 0x80, 0xF0, //E
  0xF0, 0x80, 0xF0, 0x80, 0x80 //F
];

export class Chip8 {

  constructor(graphics, keyboard, timer) {
    this.graphics = graphics
    this.graphics.chip8 = this;

    this.timer = timer;
    this.timer.chip8 = this;

    this.keyboard = keyboard
    this.keyboard.chip8 = this;
    this.keyboard.init();

    this.pause = false;
    this.halt = false;

    this.pc = 0x0;
    this.currentPc = 0x0;

    this.instruction = 0x0000;

    this.memory = new Array(4096);

    this.V = new Array(16);
    this.I = 0x0000;

    this.stack = new Array(16);
    this.sp = 0x0000;

    this.delay = 0x00;
    this.sound = 0x00;

    this.regKey = 0;
    this.display = [];
    for (let i = 0; i < 8; i++) {
      this.display[i] = new Array(32);
    };

    this.X = 0;
    this.Y = 0;
    this.N = 0;
    this.NN = 0;
    this.NNN = 0;
  };

  loadRom = (rom) => {
    for (let i = 0; i < CHIP8_FONT.length; i++) {
      this.memory[i] = CHIP8_FONT[i];
    }

    for (let i = 0; i < rom.length; i++) {
      this.memory[0x200 + i] = rom[i];
    };

    this.pc = 0x200;
    this.currentPc = this.pc;
    this.timer.start();
  }

  reset = () => {
    this.pc = 0x200;
    this.currentPc = this.pc;

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 32; j++) {
        this.display[i][j] = 0;
      }
    }

    for(let i = 0; i < this.memory.length; i++) {
      this.memory[i] = 0;
    }
    this.I = 0;
    
    for(let i = 0; i < this.V.length; i++ ){
      this.V[i] = 0;
    }

    this.delay = 0;
    this.sound = 0;
  }

  clockCycle = () => {
    if (!this.pause) {
      this.instruction = (this.memory[this.pc] << 8) | (this.memory[this.pc + 1]);
      this.currentPc = this.pc;
      this.pc += 2;

      this.X = (this.instruction & 0x0F00) >> 8;
      this.Y = (this.instruction & 0x00F0) >> 4;
      this.N = (this.instruction & 0x000F);
      this.NN = (this.instruction & 0x00FF);
      this.NNN = (this.instruction & 0x0FFF);

      // console.log("PC: " + this.currentPc.toString(16) + " | " + "INSTRUCTION: "+ this.instruction.toString(16));

      this.decode();

    };

  };

  decode = () => {
    let opcode = this.instruction & 0xF000;

    switch (opcode) {
      case 0x0000:
        this.op0();
        break;
      case 0x1000:
        this.op1();
        break;
      case 0x2000:
        this.op2();
        break;
      case 0x3000:
        this.op3();
        break;
      case 0x4000:
        this.op4();
        break;
      case 0x5000:
        this.op5();
        break;
      case 0x6000:
        this.op6();
        break;
      case 0x7000:
        this.op7();
        break;
      case 0x8000:
        this.op8();
        break;
      case 0x9000:
        this.op9();
        break;
      case 0xA000:
        this.opA();
        break;
      case 0xB000:
        this.opB();
        break;
      case 0xC000:
        this.opC();
        break;
      case 0xD000:
        this.opD();
        break;
      case 0xE000:
        this.opE();
      case 0xF000:
        this.opF();
        break;
      default:
        break;
    }
  };

  op0 = () => {
    switch (this.NN) {
      // 00E0 - CLEARS SCREEN
      case 0xE0:
        for (let i = 0; i < 8; i++) {
          for (let j = 0; j < 32; j++) {
            this.display[i][j] = 0;
          }
        }
        // this.graphics.drawBuffer();
        break;

      // 00EE - Returns from a subroutine
      case 0xEE:
        this.sp -= 1;
        this.pc = this.stack[this.sp];
        break;

      default:
        break;
    }
  };

  // 1NNN - Jumps to address NNN
  op1 = () => {
    this.pc = this.NNN;
  };


  // 2NNN - Calls subroutine at NNN
  op2 = () => {
    this.stack[this.sp] = this.pc;
    this.sp++;
    this.pc = this.NNN;
  };

  // 3XNN - Skips the next instruction if VX equals NN
  op3 = () => {
    if (this.V[this.X] == this.NN)
      this.pc += 2;
  };


  // 4XNN - Skips the next instruction if VX doesn't equal NN
  op4 = () => {
    if (this.V[this.X] != this.NN)
      this.pc += 2;
  };

  // 5XY0 - Skips the next instruction if VX equals VY
  op5 = () => {
    if (this.V[this.X] == this.V[this.Y])
      this.pc += 2;
  };

  // 6XNN - Sets VX to NN
  op6 = () => {
    this.V[this.X] = this.NN;
  };

  // 7XNN - Adds NN to VX
  op7 = () => {
    this.V[this.X] = 0xFF& (this.V[this.X] + this.NN);
  };

  op8 = () => {
    switch (this.N) {
      // 8XY0 - Sets VX to the value of VY
      case 0x0:
        this.V[this.X] = this.V[this.Y];
        break;

      /*8XY1 - Sets VX to VX or VY*/
      case 0x1:
        this.V[this.X] = this.V[this.X] | this.V[this.Y];
        break;

      // 8XY2 - Sets VX to VX and VY
      case 0x2:
        this.V[this.X] = this.V[this.X] & this.V[this.Y];
        break;

      // 8XY3 - Sets VX to VX xor VY
      case 0x3:
        this.V[this.X] = this.V[this.X] ^ this.V[this.Y];
        break;

      /* 8XY4 - Adds VY to VX. VF is set to 1 when
      there's a carry, and to 0 when there isn't */
      case 0x4:
        let sum = this.V[this.X] + this.V[this.Y];
        this.V[0xF] = (sum > 0xFF) ? 0x1 : 0x0;
        this.V[this.X] = 0xFF& sum;
        break;

      /* 8XY5 - VY is subtracted from VX. VF is set to 0 when
      * there's a borrow, and 1 when there isn't*/
      case 0x5:
        this.V[0xF] = (this.V[this.X] > this.V[this.Y]) ? 0x1 : 0x0;
        this.V[this.X] = 0xFF & (this.V[this.X] - this.V[this.Y]);
        break;

      /* 8XY6 - Shifts VX right by one. VF is set
      * to the value of LSB of VX before the shift */
      case 0x6:
        this.V[0xF] = this.V[this.X] & 0x01;
        this.V[this.X] = 0xFF & (this.V[this.X] >> 1);
        break;

      /* 8XY7 - Sets VX to VY minus VX. VF is set to
      * 0 when there's a borrow, and 1 when there isn't */
      case 0x7:
        this.V[0xF] = (this.V[this.X] > this.V[this.Y]) ? 0x0 : 0x1;
        this.V[this.X] = 0xFF & (this.V[this.Y] - this.V[this.X]);
        break;

      /* 8XYE - Shifts VX left by one. VF is set to the
      * value of the MSB of VX before the shift */
      case 0xE:
        this.V[0xF] = this.V[this.X] & 0x80;
        this.V[this.X] = 0xFF & (this.V[this.X] << 1);
        break;

      default:
        break;
    }
  };

  // 9XY0 - Skips the next instruction if VX doesn't equal VY
  op9 = () => {
    if (this.V[this.X] != this.V[this.Y])
      this.pc += 2;
  };

  // ANNN - Sets I to the address NNN
  opA = () => {
    this.I = this.NNN;
  };


  // BNNN - Jumps to the address NNN plus V0
  opB = () => {
    this.pc = 0xFFFF & (this.NNN + this.V[0x0]);
  };

  /* CXNN - Sets VX to the result of a bitwise
  * and operation on a random number and NN */
  opC = () => {
    let rand = Math.floor(Math.random()* 0xFF);
    this.V[this.X] = this.NN & (rand & 0xFF);
  };


  pixelTest = (a, b) => {
    a = Math.abs(a % 64);
    b = Math.abs(b % 32);

    let ii = Math.floor(a / 8);
    let jj = (b % 32);
    let pixel = (this.display[ii][jj]) & (1 << (a % 8));
    if (pixel === 0)
      return false;
    else
      return true;
  };
  pixelXor = (a, b) => {
    a = Math.abs(a % 64);
    b = Math.abs(b % 32);

    let ii = Math.floor(a / 8);
    let jj = (b % 32);
    this.display[ii][jj] ^= (1 << (a % 8));
  };

  /* DXYN - Draws a sprite at coordinate (VX, VY) that has
  * a width of 8 pixels and a height of N pixels */
  opD = () => {
    this.V[0xF] = 0;

    let xx = this.V[this.X];
    let yy = this.V[this.Y];

    for (let i = 0; i < this.N; i++) {
      let spriteSlice = this.memory[this.I + i];

      for (let j = 0; j < 8; j++) {
        let shifted = spriteSlice & (0x80 >> j);
        if (shifted != 0x00) {
          if (this.pixelTest(xx + j, yy + i))
          this.V[0xF] = 1;
          this.pixelXor(xx + j, yy + i);

        }
      };
    };
    // this.graphics.drawBuffer();

  };


  keyTest = (k) => {
    let keystate = this.regKey & (1 << (k));
    if (keystate == 0)
      return false;
    else return true;
  };
  opE = () => {
    switch (this.NN) {

      // EXA1 - Skips the next instruction if the key stored in VX isn't pressed
      case 0xA1:
        if (!this.keyTest(this.V[this.X]))
          this.pc += 2;
        break;

      // EX9E - Skips the next instruction if the key stored in VX is pressed
      case 0x9E:
        if (this.keyTest(this.V[this.X]))
          this.pc += 2;
        break;

      default:
        break;
    }
  };
  opF = () => {

    switch (this.NN) {

      /* FX07 - Sets VX to the value of the delay timer */
      case 0x07:
        this.V[this.X] = 0xFF & this.delay;
        break;

      /* FX0A - A key press is awaited, and then stored in VX. (Blocking Operation.
      * All instruction halted until next key event */
      case 0x0A:
        // let wait = true;

        // while (wait) {
        //   for (let i = 0; i < 16; i++) {
        //     if(this.keyTest(i)) {
        //       this.V[this.X] = i;
        //       wait = false;
        //       return;
        //     };
        //   }
        // };
        break;

      /* FX15 - Sets the delay timer to VX */
      case 0x15:
        this.delay = 0xFF& this.V[this.X];
        break;

      /* FX18 - Sets the sound timer to VX */
      case 0x18:
        this.sound = 0xFF& this.V[this.X];
        break;

      /* FX1E - Adds VX to I */
      case 0x1E:
        this.I = 0xFFFF& (this.I + this.V[this.X]);
        break;

      /* FX29 - Sets I to the location of the
      * sprite for the character in VX */
      case 0x29:
        this.I = 0xFFFF & (this.V[this.X] * 5);
        break;

      /* FX33 - Stores the binary-coded decimal representation
      * of VX @ addr I, I+1, I+2 */
      case 0x33:
        let val = this.V[this.X];

        let hundreds = Math.floor(val / 100);
        let tens = Math.floor((val - 100 * Math.floor(val / 100)) / 10);
        let ones = Math.floor(val - (hundreds * 100 + tens * 10));

        this.memory[this.I] = hundreds & 0xFF;
        this.memory[this.I + 1] = tens & 0xFF;
        this.memory[this.I + 2] = ones & 0xFF;
        break;

      /* FX55 - Stores V0 to VX (including VX) in memory starting
      * at address I. I is increased by 1 for each value written. */
      case 0x55:
        for (let i = 0; i <= this.X; i++) {
          this.memory[this.I + i] = this.V[i];
        };
        // this.regI = 0xFFFF & (this.regI + (this.regX + 1));
        break;

      /* FX65 - Fills V0 to VX (including VX) with values from memory starting at
      * address I. I is increased by 1 for each value written. */
      case 0x65:
        for (let i = 0; i <= this.X; i++) {
          this.V[i] = this.memory[this.I + i];
        };
        // this.regI = 0xFFFF & (this.regI + (this.X + 1));
        break;

      default:
        break;
    }
  };

};
