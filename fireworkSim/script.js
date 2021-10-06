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
    fireworkExtra: new Array()
};

let boolean = {
    launched: false
}

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
    ctx.fillStyle = 'rgb(0,10,30)';
    ctx.fillRect(0, 0, cnv.width, cnv.height);

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
            objects.fireworkMain.push(createFirework(cnv));
        });
    }
}