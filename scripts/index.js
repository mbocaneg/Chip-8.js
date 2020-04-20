import { Chip8 } from "./Chip8.js";
import { Keyboard } from "./Keyboard.js";
import { Graphics } from "./Graphics.js";
import { Timers } from "./Timers.js";

// identify the canvas object in the DOM and get its context
var c = document.getElementById("canvas");
var ctx = c.getContext("2d");

// Instantiate the Keyboard, Graphics, and Timer objects needed
// by the Chip8 core
var kb = new Keyboard();
var gfx = new Graphics(ctx);
var tim = new Timers();

// Instantiate the Chip8 core, injecting into it the Keyboard, 
// Graphics, and Timer objects
var c8 = new Chip8(gfx, kb, tim);

// WARNING: THIS IS A HACKY SOLUTION!!! 
// declare an array of 5 objects, which will hold up to 5
// setInterval instances. The purpose of these instances
// is to "overclock" the Chip8 core so that it executes 
// much faster. 
var pool = new Array(5);

// run function that is meant to be run by a setInterval instance.
// All this function does if clock the Chip8 instance
function run() {
    c8.clockCycle();
}

// function that fetches a rom from the ../roms directory. This
// is done by issuing an XMLHttpRequest of response type 'arraybuffer', 
// as the roms themselves are in binary format
function fetchRom(rom) {
    let url = '../roms/' + rom;
    var arr;
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'arraybuffer';

    xhr.onload = function (e) {
        if (this.status == 200) {
            arr = new Uint8Array(this.response);

            // whenver a new rom is loaded, first reset the Chip8 core
            c8.reset();

            // load the fetched rom
            c8.loadRom(arr);

            // psc dictionary holds keyvalue pairs that binds a rom
            // name to a prescaler integer value. The prescale value 
            // represents how fast the Chip8 core should the "clocked".
            // Create a number of setInterval instances equal to this 
            // psc value
            for (let i = 0; i < psc[rom]; i++) {
                pool[i] = setInterval(run, 1 / 1000);
            }
        }
    }

    xhr.open('GET', url, true);
    xhr.send();
}

// Dictionary that maps a rom name to its keymaps. This is displayed onto
// the DOM to instruct the user how to play the game.
let keybinds = {
    "INVADERS": "w to start. q=right  w=fire  e=left",
    "PONG": "Player1 1=up q=down  |  Player2 4=up r=down",
    "PONG2": "Player1 1=up q=down  |  Player2 4=up r=down",
    "TETRIS": "w=left  e=right  q=rotate  a=down",
    "BRIX": "q=left  e=right",
    "MAZE": "Graphics demo, not a game",
    "MISSILE": "s=fire",
    "UFO": "q=shoot-left  w=shoot-up  e=shoot-right",
    "WIPEOFF": "q=left   e=right",
    "BLINKY": "3=up  e=down  a=left  s=right"
};

// Dictionary that binds a rom name to a prescaler value. This value dictates
// how fast the rom should be run.
let psc = {
    "INVADERS": 4,
    "PONG": 2,
    "PONG2": 2,
    "TETRIS": 4,
    "BRIX": 2,
    "MAZE": 8,
    "MISSILE": 2,
    "UFO": 3,
    "WIPEOFF": 2,
    "BLINKY": 3
}

// JQuery function that handles the dropdown menu on the DOM that
// displays ROM names.
$(function () {

    // Whenever a new rom is chosen, clear the pool of setInterval instances
    $(".dropdown-menu li a").click(function () {
        for (let i = 0; i < pool.length; i++) {
            clearInterval(pool[i]);
        }

        // variable that holds the name of the currently selected ROM.
        let selection = $(this).text();
        $(".btn:first-child").text(selection);
        $(".btn:first-child").val(selection);

        // display the keybinds for the selected ROM
        $(".instructions-header").text("Instructions");
        $(".keybinds").text(keybinds[selection]);

        // fetch the ROM and start the CHIP8 core
        fetchRom(selection);

    });

});


