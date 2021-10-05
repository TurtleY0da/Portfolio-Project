// Image Zooming Script by Timothy V 

// Initialize Variables

// HTML Elements
let cnv = document.getElementById("zoomCanvas");

// Glbl Variables

let image = {
    url: docGetID("exampleImage"),
    zoom: 1,
    prevZoom: 0.5,
    posX: 0,
    posY: 0,
    prevX: -20,
    prevY: 0,
    width: 1040,
    height: 585,
    zooming: 0,
    zoomSin: 1
}

let keyHeld = {
    shift: false,
    left: false,
    right: false,
    up: false,
    down: false
}

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
    if (keyHeld.left && keyHeld.right) {
        keyHeld.right = false;
        keyHeld.left = false;
    }
    if (keyHeld.up && keyHeld.down) {
        keyHeld.down = false;
        keyHeld.up = false;
    }

    if (image.zoom < 1) {
        image.zoom = 1;
    }
    if (image.zoom > 5) {
        image.zoom = 5;
    }

    if (image.zooming > 0) {
        image.zoomSin = Math.sin(image.zooming * (Math.PI / 180));
        if (image.prevZoom < image.zoom) {
            image.zoom = image.prevZoom + (image.zoomSin / 2);
        } else {
            image.zoom = image.prevZoom - (image.zoomSin / 2);
        }

        image.posX = 0 - (image.width / 2 - 1040 / 2);
        image.posY = 0 - (image.height / 2 - 585 / 2);

        image.zooming++;
        if (image.zooming >= 91) {
            image.zooming = 0;
        }
    } else {

    }

    if (image.prevX > 0) {
        image.prevX = 0;
    }

    if (image.zoomSin < 1) {
        image.zoomSin = 1;
    }
    if (image.zoomSin > 5) {
        image.zoomSin = 5;
    }

    image.width = cnv.width * image.zoom;
    image.height = cnv.height * image.zoom;

    if (image.posX > 0) {
        image.posX = 0;
    }
    if (image.posX+image.width < cnv.width) {
        image.posX
    }

    // - Draw -
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, cnv.width, cnv.height);

    ctx.drawImage(image.url, image.posX, image.posY, image.width, image.height);

    // - End -
    requestAnimationFrame(loop);
}

// -- Add Event Listeners
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

// -- Functions --

// - Event Functions -

function keyDownHandler(event) {

    if (event.key === 'Shift') {
        keyHeld.shift = true;
    } else if (event.key === 'ArrowRight') {
        keyHeld.right = true;
    } else if (event.key === 'ArrowLeft') {
        keyHeld.left = true;
    } else if (event.key === 'ArrowUp') {
        keyHeld.up = true;
    } else if (event.key === 'ArrowDown') {
        keyHeld.down = true;
    }

    if (!event.repeat) {
        if (event.key === '-' && image.zoom > 1) {
            if (image.zooming === 0) {
                image.zooming++;
                image.prevX = image.posX;
                image.prevY = image.posY;
                image.prevZoom = image.zoom;
                image.zoom -= 0.5;
            }

        } else if (event.key === '=' && image.zoom < 5) {
            if (image.zooming === 0) {
                image.zooming++;
                image.prevX = image.posX;
                image.prevY = image.posY;
                image.prevZoom = image.zoom;
                image.zoom += 0.5;
            }
        }
    }
}

function keyUpHandler(event) {

    if (event.key === 'Shift') {
        keyHeld.shift = false;
    } else if (event.key === 'ArrowRight') {
        keyHeld.right = false;
    } else if (event.key === 'ArrowLeft') {
        keyHeld.left = false;
    } else if (event.key === 'ArrowUp') {
        keyHeld.up = false;
    } else if (event.key === 'ArrowDown') {
        keyHeld.down = false;
    }
}


// - Functions -