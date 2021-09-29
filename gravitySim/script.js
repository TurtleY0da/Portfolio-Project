// [Name] by Timothy V 

// Initialize Variables

// - HTML Element References -
let cnv = docGetID("gravityCanvas");

// - Global Variables -
// Shapes
let circle = {
    x: 124,
    y: 100,
    r: 20,
    motionX: -30,
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

// Other

let time = {
    lastUpdate: +Date.now(),
    now: 0
};

let tabFocused = true;
let followMouse = false;

// -- Canvas & Context setup
/** @type {CanvasRenderingContext2D} */
let ctx = cnv.getContext("2d");

cnv.width = 1024;
cnv.height = 576;

// -- Main Loop --
requestAnimationFrame(loop);

function loop() {
    // Calculate DeltaTime
    time.now = Date.now()
    const dt = time.now - time.lastUpdate;
    time.lastUpdate = time.now;
    if (tabFocused) {
        // - Update Variables -


        // If Playing
        if (button.active) {
            // Add Gravity
            circle.motionY += 0.98 * dt / 30;

            // Update Circle Position
            circle.y += circle.motionY;
            circle.x += circle.motionX;
        }

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

        circle.motionX = circle.motionX * 0.99;
        circle.motionY = circle.motionY * 0.99;

        // - Draw -
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
    }
    requestAnimationFrame(loop);
}

// -- Add Event Listeners
cnv.addEventListener('click', function (e) {
    if (checkButtonPress(e, button, cnv)) {
        button.active = !button.active;
    }
});

window.onfocus = function () {
    tabFocused = true;
};
window.onblur = function () {
    tabFocused = false;
};

// -- Functions --

// - Event Functions -

// - Functions -