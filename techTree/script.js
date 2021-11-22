// Tech Tree Script by Timothy V 

// -- Initialize Variables --

// HTML Elements
let cnv = docGetID("myCanvas");

// Glbl Variables
let neededWidth = 0;
let neededHeight = 0;
let margin = 20;

let screenSize = {
    width: screen.availWidth,
    height: screen.availHeight
}

// window.scrollX & scrollY
// Change colours
// X for red || Y for Blue
// (math.round(scrollVar/alternatePoint)%2 === 1) ? scrollVar : 0-scrollVar

// -- Canvas & Context setup
/** @type {CanvasRenderingContext2D} */
let ctx = cnv.getContext("2d", {alpha: false});

cnv.width = screenSize.width / 1.5;
cnv.height = screenSize.height / 1.5;

// -- Main Loop --
requestAnimationFrame(loop);

function loop() {
    // - Update Variables -

    if (screen.availWidth !== screenSize.width || screenSize.availHeight !== screenSize.height) {
        let screenSize = {
            width: screen.availWidth,
            height: screen.availHeight
        }
    }

    // - Draw -


    // - End -
    requestAnimationFrame(loop);
}

// -- Add Event Listeners


// -- Functions --

// - Event Functions -

// - Functions -