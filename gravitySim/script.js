// Basic Gravity Simulator by Timothy V 

// -- Initialize Variables --

// - HTML Element References -
let cnv = docGetID("gravityCanvas");

// - Global Variables -
// Shapes
let circle = {
    x: 0,
    y: 0,
    r: 20,
    motionX: 0,
    motionY: 0
};

let button = {
    x: 462,
    y: 10,
    w: 100,
    h: 40,
    r: 20,
    active: false
};

let indicator = {
    width: 0,
    height: 0,
    sin: 0,
    angle: 0,
    destX: 0,
    destY: 0
}

let inputs = {
    xPosInEl: docGetID("xPosIn"),
    yPosInEl: docGetID("yPosIn"),
    xMotionInEl: docGetID("xMotionIn"),
    yMotionInEl: docGetID("yMotionIn"),
}
// Other

let time = {
    lastUpdate: +Date.now(),
    now: 0
};

let mouse = {
    x: 0,
    y: 0
}

let lastValue = {
    xPos: 124,
    yPos: 100,
    xMotion: 10,
    yMotion: 5
}

let drag = 0.001;

let shiftDown = false;

// -- Canvas & Context setup
/** @type {CanvasRenderingContext2D} */
let ctx = cnv.getContext("2d");

cnv.width = 1024;
cnv.height = 576;

// -- Main Loop --
requestAnimationFrame(loop);

function loop() {
    // - Update Variables -

    // Calculate DeltaTime
    time.now = Date.now()
    const dt = time.now - time.lastUpdate;
    time.lastUpdate = time.now;

    // If Playing
    if (button.active) {
        // Add Gravity
        circle.motionY += 0.98 * dt / 30;

        // Check for walls
        if (circle.y > cnv.height - circle.r) {
            circle.motionY = -circle.motionY / 4;
            circle.motionX = circle.motionX / 1.2;
            circle.y = cnv.height - circle.r;
        }
        if (circle.y < 0 + circle.r) {
            circle.motionY = -circle.motionY / 4;
            circle.motionX = circle.motionX / 1.2;
            circle.y = 0 + circle.r;
        }
        if (circle.x > cnv.width - circle.r) {
            circle.motionY = circle.motionY / 1.5;
            circle.motionX = -circle.motionX / 3;
            circle.x = cnv.width - circle.r;
        }
        if (circle.x < 0 + circle.r) {
            circle.motionY = circle.motionY / 1.5;
            circle.motionX = -circle.motionX / 3;
            circle.x = 0 + circle.r;
        }
        // Add drag
        circle.motionX = circle.motionX * Math.exp(-drag * dt);
        circle.motionY = circle.motionY * Math.exp(-drag * dt);

        // Update Circle Position
        circle.y += Math.round(circle.motionY*(dt*0.1) * 100) / 100;
        circle.x += Math.round(circle.motionX*(dt*0.1) * 100) / 100;
    } else {
        // Calculate Indicator Direction
        // Probably more complex than this has to be
        indicator.width = +inputs.xMotionInEl.value;
        indicator.height = -(+inputs.yMotionInEl.value);

        indicator.sin = (indicator.height / (Math.sqrt(indicator.width ** 2 + indicator.height ** 2)));
        if (indicator.width < 0) {
            indicator.angle = Math.PI - (Math.asin(indicator.sin) + 2 * Math.PI);
        } else {
            indicator.angle = Math.asin(indicator.sin);
        }


        indicator.destX = circle.x + (circle.r * Math.cos(indicator.angle));
        indicator.destY = circle.y + (circle.r * Math.sin(indicator.angle));
        // Put circle in the middle, set motion to 0
        circle.x = +inputs.xPosInEl.value + 512;
        circle.y = 0 - (+inputs.yPosInEl.value + 288) + 576;
        circle.motionX = +inputs.xMotionInEl.value;
        circle.motionY = -(+inputs.yMotionInEl.value);
    }

    // - Draw -
    // Draw background
    ctx.fillStyle = 'rgb(235, 235, 235)';
    ctx.fillRect(0, 0, cnv.width, cnv.height);

    // Draw Circle
    ctx.fillStyle = 'blue';
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2);
    ctx.fill();

    // Draw Button
    ctx.fillStyle = 'rgb(100,180,240)';
    ctx.roundRect(button.x, button.y, button.w, button.h, button.r);
    ctx.fill();
    // Draw button symbol
    if (button.active) {
        ctx.strokeStyle = 'grey';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(507, 19);
        ctx.lineTo(507, 45);
        ctx.moveTo(521, 19);
        ctx.lineTo(521, 45);
        ctx.closePath();
        ctx.stroke();

        ctx.strokeStyle = 'white';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(505, 17);
        ctx.lineTo(505, 43);
        ctx.moveTo(519, 17);
        ctx.lineTo(519, 43);
        ctx.closePath();
        ctx.stroke();
    } else {
        ctx.fillStyle = 'grey';
        ctx.beginPath();
        ctx.moveTo(504, 17);
        ctx.lineTo(504, 47);
        ctx.lineTo(524, 32);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.moveTo(502, 15);
        ctx.lineTo(502, 45);
        ctx.lineTo(522, 30);
        ctx.closePath();
        ctx.fill();
    }
    // If the button is not active, draw the direction indicator
    if (!button.active) {
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(circle.x, circle.y);
        ctx.lineTo(indicator.destX, indicator.destY);
        ctx.stroke();
    }
    // Draw mouse coordinates
    ctx.fillStyle = 'rgb(180,180,180)';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText(`[${mouse.x - cnv.width/2}, ${-(mouse.y - cnv.height/2)}]`, 0, 10);
    requestAnimationFrame(loop);
}

// -- Add Event Listeners
cnv.addEventListener('click', function (e) {
    // If canvas button pressed
    if (checkButtonPress(e, button, cnv)) {
        // Toggle button state
        button.active = !button.active;
    }
});

cnv.addEventListener('mousemove', function (event) {
    // Get mouse position
    mouse = getMousePos(event, cnv);
});

// Check for shift key
document.addEventListener('keydown', function(event){
    if(event.key === 'Shift'){
        shiftDown = true;
    }
});

document.addEventListener('keyup', function(event){
    if(event.key === 'Shift'){
        shiftDown = false;
    }
});

inputs.xPosInEl.addEventListener('input', function () {
    // Increase / Decrease (direction) value by 1 / 5 (no shift held, shift held)
    inputs.xPosInEl.value = +inputs.xPosInEl.value + checkShift(shiftDown, +inputs.xPosInEl.value, lastValue.xPos);
    // Constrain values
    if(+inputs.xPosInEl.value < -462){
        inputs.xPosInEl.value = -462;
    } else if(+inputs.xPosInEl.value > 462){
        inputs.xPosInEl.value = 462;
    }
    lastValue.xPos = +inputs.xPosInEl.value;
});

inputs.yPosInEl.addEventListener('input', function () {
    // Increase / Decrease (direction) value by 1 / 5 (no shift held, shift held)
    inputs.yPosInEl.value = +inputs.yPosInEl.value + checkShift(shiftDown, +inputs.yPosInEl.value, lastValue.yPos);
    // Constrain values
    if(+inputs.yPosInEl.value < -238){
        inputs.yPosInEl.value = -238;
    } else if(+inputs.yPosInEl.value > 238){
        inputs.yPosInEl.value = 238;
    }
    lastValue.yPos = +inputs.yPosInEl.value;
});

inputs.xMotionInEl.addEventListener('input', function () {
    // Increase / Decrease (direction) value by 1 / 5 (no shift held, shift held)
    inputs.xMotionInEl.value = +inputs.xMotionInEl.value + checkShift(shiftDown, +inputs.xMotionInEl.value, lastValue.xMotion);
    // Constrain values
    if(+inputs.xMotionInEl.value < -50){
        inputs.xMotionInEl.value = -50;
    } else if(+inputs.xMotionInEl.value > 50){
        inputs.xMotionInEl.value = 50;
    }
    lastValue.xMotion = +inputs.xMotionInEl.value;
});

inputs.yMotionInEl.addEventListener('input', function () {
    // Increase / Decrease (direction) value by 1 / 5 (no shift held, shift held)
    inputs.yMotionInEl.value = +inputs.yMotionInEl.value + checkShift(shiftDown, +inputs.yMotionInEl.value, lastValue.yMotion);
    // Constrain values
    if(+inputs.yMotionInEl.value < -50){
        inputs.yMotionInEl.value = -50;
    } else if(+inputs.yMotionInEl.value > 50){
        inputs.yMotionInEl.value = 50;
    }
    lastValue.yMotion = +inputs.yMotionInEl.value;
});

// On window refocus, reload the page
// This is my cut corners way of avoiding a bug to do with the physics, and unfocusing the tab.
window.onfocus = function () {
    location.replace('../gravitySim/');
};