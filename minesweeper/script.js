// Minesweeper by Timothy V 

// -- Initialize Variables --

// HTML Elements
let cnv = document.getElementById("myCanvas");

// Glbl Variables
let mineImgEl = new Image(512, 512);
mineImgEl.src = '../img/mine.png';
let openSans = new FontFace('openSans', 'url("https://fonts.googleapis.com/css?family=Open+Sans&display=swap")');

// -- Canvas & Context setup
/** @type {CanvasRenderingContext2D} */
let ctx = cnv.getContext("2d");

cnv.width = 1040;
cnv.height = 585;

// -- Main Loop --
requestAnimationFrame(loop);

function loop() {
    // - Update Variables -


    // - Draw -
    ctx.fillStyle = '#011627'
    ctx.fillRect(0, 0, cnv.width, cnv.height);

    ctx.fillStyle = "white";
    ctx.font = "42px";
    ctx.fillText('Lorem Ipsum', 100, 100);

    // - End -
    requestAnimationFrame(loop);
}

// -- Add Event Listeners


// -- Functions --

// - Event Functions -

// - Functions -