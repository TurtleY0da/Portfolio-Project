// Firework Script by Timothy V 

// -- Initialize Variables --

// HTML Elements
let cnv = document.getElementById("fireworkCanvas");

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

    if (inputs.randomColorEL.checked) {
        inputs.colorEl.disabled = true;
        color.r = Math.round(Math.random()*200+55);
        color.g = Math.round(Math.random()*200+55);
        color.b = Math.round(Math.random()*200+55);
    } else {
        inputs.colorEl.disabled = false;
    }

    if (inputs.randomStyleEL.checked) {
        inputs.styleEl.disabled = true;
        style = Math.round(Math.random()*(inputs.styleEl.length-1));
    } else {
        inputs.styleEl.disabled = false;
        style = +inputs.styleEl.value;
    }

    let indexA = 0;
    objects.fireworkMain.forEach(element => {
        objects.fireworkTrail.push(new trail(element));
        element.update(dt, drag);

        if (element.motionY > 1) {

            let audioObj = new Audio('./explosion.mp3');

            audioObj.addEventListener('canplaythrough', function () {
                audioObj.play();
                createExplosion(objects.fireworkExplosion, element, style);
            });

            objects.fireworkMain.splice(indexA, 1);

        }

        indexA++;
    });

    let indexB = 0;
    objects.fireworkTrail.forEach(element => {
        element.update(dt);

        if (element.size <= 1) {
            objects.fireworkTrail.splice(indexB, 1);
        }

        indexB++;
    });

    let indexC = 0;
    objects.fireworkExplosion.forEach(element => {
        element.update(dt, drag);

        if (element.size <= 1) {
            objects.fireworkExplosion.splice(indexC, 1);
        }

        indexC++;
    });



    // - Draw -
    ctx.fillStyle = 'rgb(0,10,30)';
    ctx.fillRect(0, 0, cnv.width + 2, cnv.height + 2);
    ctx.shadowBlur = 0;

    objects.fireworkMain.forEach(element => {
        ctx.fillStyle = element.color;
        ctx.beginPath();
        ctx.arc(element.x, element.y, 1, 0, 2 * Math.PI);
        ctx.fill();
    });
    objects.fireworkTrail.forEach(element => {
        ctx.fillStyle = element.color;
        ctx.shadowColor = element.color;
        ctx.shadowBlur = element.size;
        ctx.beginPath();
        ctx.arc(element.x, element.y, element.size / 2, 0, 2 * Math.PI);
        ctx.fill();
    });
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
function launch() {
    if (!boolean.launched) {

        boolean.launched = true;
        resetLaunched();

        let audioObj = new Audio('./launch.mp3');

        audioObj.addEventListener('canplaythrough', function () {
            audioObj.play();
            objects.fireworkMain.push(new firework(cnv, `rgb(${color.r},${color.g},${color.b})`));
        });
    }
}

async function resetLaunched() {

    let delay = +inputs.delayEl.value
    await timer(delay);
    boolean.launched = false;
}

function setRGB(event) {
    color.r = parseInt(event.srcElement.value.slice(1, -4), 16);
    color.g = parseInt(event.srcElement.value.slice(3, -2), 16);
    color.b = parseInt(event.srcElement.value.slice(5), 16)
}