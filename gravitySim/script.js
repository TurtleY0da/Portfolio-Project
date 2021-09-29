// [Name] by Timothy V 

// Initialize Variables

// - HTML Element References -
let cnv = docGetID("gravityCanvas");

// - Global Variables -
let circle = {
    x:300,
    y:300,
    r:20,
    motionX:0,
    motionY:0
}

let button = {
    x:462,
    y:10,
    w:100,
    h:40,
    r:20,
    active: false
}

let followMouse = false;

// -- Canvas & Context setup
/** @type {CanvasRenderingContext2D} */
let ctx = cnv.getContext("2d");

cnv.width = 1024;
cnv.height = 576;

// -- Main Loop --
requestAnimationFrame(loop);

function loop() {
    // - Update Variables -


    // - Draw -

    // Draw Circle
    ctx.fillStyle = 'blue';
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.r, 0, Math.PI*2);
    ctx.fill();

    // Draw Button
    ctx.fillStyle = 'rgb(100,180,240)';
    ctx.roundRect(button.x,button.y,button.w,button.h,button.r);
    ctx.fill();

    if(button.active){
        ctx.strokeStyle = 'grey';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(507,19);
        ctx.lineTo(507,45);
        ctx.moveTo(521,19);
        ctx.lineTo(521,45);
        ctx.closePath();
        ctx.stroke();

        ctx.strokeStyle = 'white';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(505,17);
        ctx.lineTo(505,43);
        ctx.moveTo(519,17);
        ctx.lineTo(519,43);
        ctx.closePath();
        ctx.stroke();
    } else {
        ctx.fillStyle = 'grey';
        ctx.beginPath();
        ctx.moveTo(504,17);
        ctx.lineTo(504,47);
        ctx.lineTo(524,32);
        ctx.closePath();
        ctx.fill();
    
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.moveTo(502,15);
        ctx.lineTo(502,45);
        ctx.lineTo(522,30);
        ctx.closePath();
        ctx.fill();
    }

    // - End -
    requestAnimationFrame(loop);
}

// -- Add Event Listeners
cnv.addEventListener('mousedown',  function(e){
    if(checkButtonPress(e, button, cnv)){
        button.active = !button.active;
    }
});

// -- Functions --

// - Event Functions -

// - Functions -