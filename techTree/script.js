// Tech Tree Script by Timothy V 

// -- Initialize Variables --

// HTML Elements
let cnv = docGetID("treeCanvas");

// Glbl Variables
let neededWidth = 0;
let neededHeight = 0;
let margin = 20;

let topTreeElements =  new Array();

let prevtime = Date.now();

let screenSize = {
    width: screen.availWidth,
    height: screen.availHeight
}
let scroll = 0;

// -- Canvas & Context setup
/** @type {CanvasRenderingContext2D} */
let ctx = cnv.getContext("2d");

cnv.width = screenSize.width / 1.5;
cnv.height = screenSize.height / 1.5;

// -- Main Loop --
requestAnimationFrame(loop);

function loop() {
    // - Update Variables -
    const dt = Date.now() - prevtime;
    prevtime = Date.now();

    if (screen.availWidth !== screenSize.width || screenSize.availHeight !== screenSize.height) {
        screenSize = {
            width: screen.availWidth,
            height: screen.availHeight
        }
    }
    scroll = (scroll+dt/20)%1600;

    cnv.width = Math.max(screenSize.width/1.5, neededWidth);
    cnv.height = Math.max(screenSize.height/1.5, neededHeight);

    let vertGradDivide = Math.ceil(cnv.height/1600)+2;
    let verticalGradient = ctx.createLinearGradient(0, -1600+scroll, 0, -1600+vertGradDivide*1600+scroll);
    for(let i = 0; i < vertGradDivide; i++){
        verticalGradient.addColorStop(i/vertGradDivide,'#0033bb');
        verticalGradient.addColorStop((0.5+i)/vertGradDivide,'#003366');
    }
    let horzGradDivide = Math.ceil(cnv.width/1600)+2;
    let horizontalGradient = ctx.createLinearGradient(-1600+scroll, 0, -1600+horzGradDivide*1600+scroll, 0);
    for(let i = 0; i < horzGradDivide; i++){
        horizontalGradient.addColorStop(i/horzGradDivide,'#00bb33');
        horizontalGradient.addColorStop((0.5+i)/horzGradDivide,'#006633');
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