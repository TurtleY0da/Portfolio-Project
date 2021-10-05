// Image Zooming Script by Timothy V 

// Initialize Variables

// HTML Elements
let cnv = document.getElementById("zoomCanvas");

// Glbl Variables

let image = docGetID("exampleImage");

let mouse = {
    x:0,
    y:0
}

let shift = false;

// -- Canvas & Context setup
/** @type {CanvasRenderingContext2D} */
let ctx = cnv.getContext("2d");

ctx.imageSmoothingEnabled = false;
cnv.width = 1040;
cnv.height = 585;

// -- Main Loop --
requestAnimationFrame(loop);

function loop() {
    // - Update Variables -


    // - Draw -
    ctx.clearRect(0, 0, cnv.width, cnv.height);

    createImage(cnv.width, cnv.height, 0, 0, image, ctx);
    // - End -
    requestAnimationFrame(loop);
}

// -- Add Event Listeners
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);
cnv.addEventListener('mousemove', mouseMoveHandler)

// -- Functions --

// - Event Functions -

function keyDownHandler(event) {

    if (event.key === 'Shift') {
        shift = true;
    }
}

function keyUpHandler(event) {

    if (event.key === 'Shift') {
        shift = false;
    }
}


// - Functions -