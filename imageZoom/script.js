// Image Zooming Script by Timothy V 

// -- Initialize Variables --

// HTML Elements
let cnv = docGetID("zoomCanvas");

// Glbl Variables

let image = {
    url: docGetID("exampleImage"),
    zoom: 0,
    zoomVal: 0,
    zoomSin: 0,
    zooming: 1,
    prevZooming: 0,
    prevZoom: 0,
    x: 520,
    y: 293
};

let controls = {
    shift: false,
    up: false,
    down: false,
    left: false,
    right: false
};

// -- Canvas & Context setup
/** @type {CanvasRenderingContext2D} */
let ctx = cnv.getContext("2d");

ctx.imageSmoothingEnabled = false;
cnv.width = 1040;
cnv.height = 585;

createImage(image, ctx, cnv);

// -- Main Loop --
requestAnimationFrame(loop);

function loop() {
    // - Update Variables -
    if (image.zoomVal > 0) {
        image.zoomVal++;
        image.zoomSin = ((Math.sin((image.zoomVal * 2 - 90) * (Math.PI / 180))) + 1) / 2;

        if (image.prevZooming < image.zooming) {
            image.zoom = image.prevZoom + 250*image.zoomSin;
        } else {
            image.zoom = image.prevZoom - 250*image.zoomSin;
        }

        if (image.zoomVal >= 90) {
            image.zoomVal = 0;
        }

    }

    if(!controls.shift){
        if(controls.up && image.y > 0){
            image.y -= 6/image.zooming;
        }
        if(controls.down && image.y < 585){
            image.y += 6/image.zooming;
        }
    
        if(controls.left && image.x > 0){
            image.x -= 6/image.zooming;
        }
        if(controls.right && image.x < 1040){
            image.x += 6/image.zooming;
        }
    } else {
        if(controls.up && image.y > 0){
            image.y -= 12/image.zooming;
        }
        if(controls.down && image.y < 585){
            image.y += 12/image.zooming;
        }
    
        if(controls.left && image.x > 0){
            image.x -= 12/image.zooming;
        }
        if(controls.right && image.x < 1040){
            image.x += 12/image.zooming;
        }
    }

    if(image.zoom === 0){
        image.x = 520;
        image.y = 293
    }

    // - Draw -

    createImage(image, ctx, cnv);

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
        controls.shift = true;
    }
    if (image.zoomVal < 1) {

        if (event.key === 'ArrowUp') {
            controls.up = true;
        } else if (event.key === 'ArrowDown') {
            controls.down = true;
        } else if (event.key === 'ArrowLeft') {
            controls.left = true;
        } else if (event.key === 'ArrowRight') {
            controls.right = true;
        }

        if (!event.repeat) {
            if (event.key === '-') {
                if (image.zooming - 1 > 0) {
                    image.prevZooming = image.zooming;
                    image.prevZoom = image.zoom;
                    image.zoomVal++;
                    image.zooming--;
                }
            } else if (event.key === '=') {
                image.prevZooming = image.zooming;
                image.prevZoom = image.zoom;
                image.zoomVal++;
                image.zooming++;
            }
        }
    }
}

function keyUpHandler(event) {

    if (event.key === 'Shift') {
        controls.shift = false;
    } else if (event.key === 'ArrowUp') {
        controls.up = false;
    } else if (event.key === 'ArrowDown') {
        controls.down = false;
    } else if (event.key === 'ArrowLeft') {
        controls.left = false;
    } else if (event.key === 'ArrowRight') {
        controls.right = false;
    }
}