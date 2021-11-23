// Tech Tree Script by Timothy V 

// -- Initialize Variables --

// HTML Elements
let cnv = docGetID("treeCanvas");

// Glbl Variables
let neededWidth = 0;
let neededHeight = 0;
let margin = 20;

let screenSize = {
    width: screen.availWidth,
    height: screen.availHeight
}

// Add scrolling/responsiveness to the background

// [].reduce((a, b) => a + b, 0) Sum of Array

// -- Canvas & Context setup
/** @type {CanvasRenderingContext2D} */
let ctx = cnv.getContext("2d");

cnv.width = screenSize.width / 1.5;
cnv.height = screenSize.height / 1.5;

// -- Main Loop --
requestAnimationFrame(loop);

function loop() {
    // - Update Variables -

    if (screen.availWidth !== screenSize.width || screenSize.availHeight !== screenSize.height) {
        screenSize = {
            width: screen.availWidth,
            height: screen.availHeight
        }
    }

    cnv.width = Math.max(screenSize.width/1.5, neededWidth);
    cnv.height = Math.max(screenSize.height/1.5, neededHeight);

    let vertGradDivide = Math.ceil(cnv.height/1600)+1;
    let verticalGradient = ctx.createLinearGradient(0, 0, 0, vertGradDivide*1600);
    for(let i = 0; i < vertGradDivide; i++){
        verticalGradient.addColorStop(i/vertGradDivide,'#0000bb');
        verticalGradient.addColorStop((0.5+i)/vertGradDivide,'#000066');
    }
    let horzGradDivide = Math.ceil(cnv.width/1600)+1;
    let horizontalGradient = ctx.createLinearGradient(0, 0, horzGradDivide*1600, 0);
    for(let i = 0; i < horzGradDivide; i++){
        horizontalGradient.addColorStop(i/horzGradDivide,'#00bb00');
        horizontalGradient.addColorStop((0.5+i)/horzGradDivide,'#006600');
    }

    // - Draw -
    ctx.clearRect(0, 0, cnv.width, cnv.height);
    ctx.save();
    ctx.fillStyle = verticalGradient;
    ctx.fillRect(0,0,cnv.width,cnv.height);
    ctx.globalCompositeOperation = 'screen'
    ctx.fillStyle = horizontalGradient;
    ctx.fillRect(0,0,cnv.width,cnv.height);
    ctx.restore();

    // - End -
    requestAnimationFrame(loop);
}

// -- Add Event Listeners
cnv.oncontextmenu = function(e) {
    e.preventDefault();
}

// -- Functions --

// - Event Functions -

// - Functions -