// Firework Script by Timothy V 

// -- Initialize Variables --

// HTML Elements
let cnv = docGetID("fireworkCanvas");

// Glbl Variables

let inputs = {
    launchEl: docGetID("launchBtn"),
    delayEl: docGetID("delayIn"),
    colorEl: docGetID("colorIn"),
    randomColorEL: docGetID("randomColorBox"),
    styleEl: docGetID("fireworkSelect"),
    randomStyleEL: docGetID("randomStyleBox"),
};

let objects = {
    fireworkMain: new Array(),
    fireworkExplosion: new Array(),
    fireworkTrail: new Array()
};

let color = {
    r: 255,
    g: 0,
    b: 0
}

let boolean = {
    launched: false
};

let time = {
    now: 0,
    prevTime: Date.now()
};

let drag = 0.001;
let style = 0;

// -- Canvas & Context setup
/** @type {CanvasRenderingContext2D} */
let ctx = cnv.getContext("2d");

cnv.width = 1040;
cnv.height = 585;

// -- Main Loop --
requestAnimationFrame(loop);

function loop() {
    // - Update Variables -
    time.now = Date.now();
    const dt = time.now - time.prevTime;
    time.prevTime = Date.now();
    // Set random colors, if random color box ticked
    if (inputs.randomColorEL.checked) {
        inputs.colorEl.disabled = true;
        color.r = Math.round(Math.random()*200+55);
        color.g = Math.round(Math.random()*200+55);
        color.b = Math.round(Math.random()*200+55);
    } else {
        inputs.colorEl.disabled = false;
    }
    // Set random style if random styles ticked
    if (inputs.randomStyleEL.checked) {
        inputs.styleEl.disabled = true;
        style = Math.round(Math.random()*(inputs.styleEl.length-1));
    } else {
        inputs.styleEl.disabled = false;
        style = +inputs.styleEl.value;
    }
    // Update main fireworks
    let indexA = 0;
    objects.fireworkMain.forEach(element => {
        // Create a new trail particle
        objects.fireworkTrail.push(new trail(element));
        // Update positions and values
        element.update(dt, drag);
        // If moving downwards, explode
        if (element.motionY > 1) {
            // Play sound
            let audioObj = new Audio('./explosion.mp3');
            
            audioObj.addEventListener('canplaythrough', function () {
                audioObj.play();
                createExplosion(objects.fireworkExplosion, element, style);
            });
            // Delete the main firework
            objects.fireworkMain.splice(indexA, 1);

        }

        indexA++;
    });
    // Update firework trails
    let indexB = 0;
    objects.fireworkTrail.forEach(element => {
        // Update positions and values
        element.update(dt);
        // If small enough
        if (element.size <= 1) {
            // Delete the trail
            objects.fireworkTrail.splice(indexB, 1);
        }

        indexB++;
    });
    // Update explosion particles
    let indexC = 0;
    objects.fireworkExplosion.forEach(element => {
        // Update positions and values
        element.update(dt, drag);
        // If small enough
        if (element.size <= 1) {
            // Delete the particle
            objects.fireworkExplosion.splice(indexC, 1);
        }

        indexC++;
    });



    // - Draw -
    // Draw background
    ctx.fillStyle = 'rgb(0,10,30)';
    ctx.fillRect(0, 0, cnv.width + 2, cnv.height + 2);
    ctx.shadowBlur = 0;
    // Draw each firework
    objects.fireworkMain.forEach(element => {
        ctx.fillStyle = element.color;
        ctx.beginPath();
        ctx.arc(element.x, element.y, 1, 0, 2 * Math.PI);
        ctx.fill();
    });
    // Draw each trail particle
    objects.fireworkTrail.forEach(element => {
        ctx.fillStyle = element.color;
        ctx.shadowColor = element.color;
        ctx.shadowBlur = element.size;
        ctx.beginPath();
        ctx.arc(element.x, element.y, element.size / 2, 0, 2 * Math.PI);
        ctx.fill();
    });
    // Draw each explosion particle
    objects.fireworkExplosion.forEach(element => {
        ctx.fillStyle = element.color;
        ctx.shadowColor = element.color;
        ctx.shadowBlur = element.size;
        ctx.beginPath();
        ctx.arc(element.x, element.y, element.size / 2, 0, 2 * Math.PI);
        ctx.fill();
    });

    // - End -
    requestAnimationFrame(loop);
}

// -- Add Event Listeners
inputs.launchEl.addEventListener('click', launch);
inputs.colorEl.addEventListener('input', setRGB);

// -- Functions --

// - Event Functions -
// Launch a firework
function launch() {
    // If the the time between launches has been exceded
    if (!boolean.launched) {
        // Start the timer
        boolean.launched = true;
        resetLaunched();
        
        let audioObj = new Audio('./launch.mp3');

        audioObj.addEventListener('canplaythrough', function () {
            // Play the launch sound
            audioObj.play();
            // Create a new firework
            objects.fireworkMain.push(new firework(cnv, `rgb(${color.r},${color.g},${color.b})`));
        });
    }
}
// Wait until timer to reset
async function resetLaunched() {
    // Wait until timer, then allow another firework
    let delay = +inputs.delayEl.value
    await timer(delay);
    boolean.launched = false;
}
// Set the current rgb value
function setRGB(event) {
    color.r = parseInt(event.srcElement.value.slice(1, -4), 16);
    color.g = parseInt(event.srcElement.value.slice(3, -2), 16);
    color.b = parseInt(event.srcElement.value.slice(5), 16)
}