// Grid Snapping Script by Timothy V 

// Initialize Variables

// HTML Elements
let cnv = document.getElementById("gridCanvas");

// Glbl Variables

let inputs = {
    colorEl: docGetID("colorIn"),
    eraseEl: docGetID("eraseBtn")
};

let mouse = {
    x: 0,
    y: 0,
    down: false
};

let grid = create80x45();

// -- Canvas & Context setup
/** @type {CanvasRenderingContext2D} */
let ctx = cnv.getContext("2d");

cnv.width = 1041;
cnv.height = 586;

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

            ctx.fillRect(x * 13 + 1, y * 13 + 1, 12, 12);
        }
    }

    // - End -
    requestAnimationFrame(loop);
}

// -- Add Event Listeners
cnv.addEventListener('mousemove', mouseMoveHandler);

cnv.addEventListener('mousedown', mouseDownHandler);
cnv.addEventListener('mouseup', mouseUpHandler);
cnv.addEventListener('mouseleave', mouseUpHandler);

inputs.eraseEl.addEventListener('mousedown', erase);

// -- Functions --

// - Event Functions -
function mouseMoveHandler(event) {
    const cnvRect = cnv.getBoundingClientRect();

    mouse.x = 1 + event.clientX - cnvRect.left;
    mouse.y = 1 + event.clientY - cnvRect.top;
}

function mouseDownHandler() {
    mouse.down = true;
}

function mouseUpHandler() {
    mouse.down = false;
}

function erase() {
    for (let x = 0; x < 80; x++) {
        for (let y = 0; y < 45; y++) {

            grid[x][y].active = false;

        }
    }
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
            if (!grid[x][y].active) {
                grid[x][y].type = 'lightgrey';
            }
        }
    }

    if (!grid[column][row].active) {
        grid[column][row].type = 'grey';
    }

    if (mouse.down) {
        grid[column][row].active = true;
        grid[column][row].type = inputs.colorEl.value;
    }

}