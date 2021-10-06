// Firework Script by Timothy V 

// Initialize Variables

// HTML Elements
let cnv = document.getElementById("fireworkCanvas");

// Glbl Variables

let inputs = {
    launchEl: docGetID("launchBtn")
}

let objects = {
    fireworkMain: new Array(),
    fireworkExplosion: new Array(),
    fireworkTrail: new Array()
};

let boolean = {
    launched: false
};

let time = {
    now: 0,
    prevTime: Date.now()
};

let drag = 0.001;

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

    let indexA = 0;
    objects.fireworkMain.forEach(element => {
        objects.fireworkTrail.push(new particle(element));
        element.update(dt, drag);

        if (element.motionY > 4) {

            let audioObj = new Audio('./explosion.mp3');

            audioObj.addEventListener('canplaythrough', function () {
                audioObj.play();

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



    // - Draw -
    ctx.fillStyle = 'rgb(0,10,30)';
    ctx.fillRect(0, 0, cnv.width, cnv.height);

    objects.fireworkMain.forEach(element => {
        ctx.fillStyle = element.color;
        ctx.beginPath();
        ctx.arc(element.x, element.y, 5, 0, 2 * Math.PI);
        ctx.fill();
    });
    objects.fireworkTrail.forEach(element => {
        ctx.fillStyle = element.color;
        ctx.beginPath();
        ctx.arc(element.x, element.y, element.size/2, 0, 2 * Math.PI);
        ctx.fill();
    });

    // - End -
    requestAnimationFrame(loop);
}

// -- Add Event Listeners
inputs.launchEl.addEventListener('click', launch);

// -- Functions --

// - Event Functions -
function launch() {
    if (!Array.isArray(objects.fireworkMain) || objects.fireworkMain.length === 0) {

        boolean.launched = true;

        let audioObj = new Audio('./launch.mp3');

        audioObj.addEventListener('canplaythrough', function () {
            audioObj.play();
            objects.fireworkMain.push(new firework(cnv, 'rgb(255,20,0)'));
        });
    }
}