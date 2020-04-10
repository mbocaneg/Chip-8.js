import { Chip8 } from "./Chip8.js";
import { Keyboard } from "./Keyboard.js";
import { Graphics } from "./Graphics.js";
import { Timers } from "./Timers.js";

var c = document.getElementById("canvas");
var ctx = c.getContext("2d");

var kb = new Keyboard();
var gfx = new Graphics(ctx);
var tim = new Timers();

var c8 = new Chip8(gfx, kb, tim);

var exec;
var pool = new Array(5);

function run() {
    c8.clockCycle();
}

function fetchRom(rom) {
    let url = '../roms/' + rom;
    var arr;
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'arraybuffer';

    xhr.onload = function (e) {
        if (this.status == 200) {
            arr = new Uint8Array(this.response);
            c8.reset();
            c8.loadRom(arr);

            for (let i = 0; i < psc[rom]; i++) {
                pool[i] = setInterval(run, 1 / 1000);
            }
        }
    }

    xhr.open('GET', url, true);
    xhr.send();
}

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

$(function () {

    $(".dropdown-menu li a").click(function () {
        for (let i = 0; i < pool.length; i++) {
            clearInterval(pool[i]);
        }

        let selection = $(this).text();
        $(".btn:first-child").text(selection);
        $(".btn:first-child").val(selection);

        $(".instructions-header").text("Instructions");
        $(".keybinds").text(keybinds[selection]);

        fetchRom(selection);

    });

});


