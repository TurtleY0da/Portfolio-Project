// [Name] by Timothy V 

// Initialize Variables

// HTML Elements
let cnv = document.getElementById("gridCanvas");

// Glbl Variables

let grid = create80x45();

let mouse = {
    x: 0,
    y: 0
};

// -- Canvas & Context setup
/** @type {CanvasRenderingContext2D} */
let ctx = cnv.getContext("2d");

cnv.width = 1040;
cnv.height = 585;

// -- Main Loop --
requestAnimationFrame(loop);

let interval = setInterval(updateLoop, 0);

function loop() {

    // - Draw -

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, cnv.width, cnv.height);

    for (let x = 0; x < 80; x++) {
        for (let y = 0; y < 45; y++) {
            ctx.fillStyle = grid[x][y].type;
            ctx.fillRect(x * 13, y * 13, 13, 13);
        }
    }

    // - End -
    requestAnimationFrame(loop);
}

// -- Add Event Listeners
cnv.addEventListener('mousemove', mouseMoveHandler);

cnv.addEventListener('mousedown', mouseDownHandler);

// -- Functions --

// - Event Functions -
function mouseMoveHandler(event) {
    const cnvRect = cnv.getBoundingClientRect();

    mouse.x = 1 + event.clientX - cnvRect.left;
    mouse.y = 1 + event.clientY - cnvRect.top;
}

function mouseDownHandler() {
    let column = 0;
    let row = 0;

    for (let x = 0; x < 80; x++) {

        if (Math.abs((x * 13 + 6.5) - mouse.x) < Math.abs((column * 13 + 6.5) - mouse.x)) {
            column = x;
        }

    }

    for (let y = 0; y < 80; y++) {

        if (Math.abs((y * 13 + 6.5) - mouse.y) < Math.abs((row * 13 + 6.5) - mouse.y)) {
            row = y;
        }

    }

    grid[column][row].active = true;
}

// - Functions -

function updateLoop() {
    // - Update Variables -

    let column = 0;
    let row = 0;

    for (let x = 0; x < 80; x++) {

        if (Math.abs((x * 13 + 6.5) - mouse.x) < Math.abs((column * 13 + 6.5) - mouse.x)) {
            column = x;
        }

    }

    for (let y = 0; y < 80; y++) {

        if (Math.abs((y * 13 + 6.5) - mouse.y) < Math.abs((row * 13 + 6.5) - mouse.y)) {
            row = y;
        }

    }

    for (let x = 0; x < 80; x++) {
        for (let y = 0; y < 45; y++) {
            grid[x][y].type = 'lightgrey';
        }
    }

    grid[column][row].type = 'grey';

}