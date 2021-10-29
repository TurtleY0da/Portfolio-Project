// Platformer Script by Timothy V 

let cnv = docGetID("platformerCanvas");
let errorText = docGetID("errorText");

if (screen.width >= 1280 && screen.height >= 720) {
    // -- Initialize Variables --

    // HTML Elements
    let leftWalkImg = new Image();
    leftWalkImg.src = '../img/leftWalk.png';

    let rightWalkImg = new Image();
    rightWalkImg.src = '../img/rightWalk.png';

    let idleImg = new Image();
    idleImg.src = '../img/idle.png';

    let i = 0;

    // Glbl Variables

    let fullscreen = false;

    screenSize = Math.min(screen.width / 16, screen.height / 9);

    let screenCorner = {
        x: (screen.width - 16 * screenSize) / 2,
        y: (screen.height - 9 * screenSize) / 2
    }

    // -- Canvas & Context setup
    /** @type {CanvasRenderingContext2D} */
    let ctx = cnv.getContext("2d");

    // -- Main Loop --
    requestAnimationFrame(loop);

    function loop() {
        // - Update Variables -
        if (document.fullscreenElement === cnv) {
            cnv.width = screen.width;
            cnv.height = screen.height;
            fullscreen = true;
        } else {
            cnv.width = 16 * screenSize / 1.5;
            cnv.height = 9 * screenSize / 1.5;
            fullscreen = false;
        }

        // - Draw -
        if (fullscreen) {
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, cnv.width, cnv.height);
            ctx.clearRect(screenCorner.x, screenCorner.y, 16 * screenSize, 9 * screenSize)
        } else {
            ctx.clearRect(0, 0, cnv.width, cnv.height);
        }

        // ctx.drawImage(leftWalkImg, 512 * Math.floor(i / 4), 0, 512, 512, 0, 0, cnv.width / 60 * 9, cnv.height / 60 * 16);
        // ctx.drawImage(rightWalkImg, 512 * Math.floor(i / 4), 0, 512, 512, cnv.width / 60 * 9, 0, cnv.width / 60 * 9, cnv.height / 60 * 16);
        // ctx.drawImage(idleImg, 512 * Math.floor(i / 4), 0, 512, 512, (cnv.width / 60 * 9) * 2, 0, cnv.width / 60 * 9, cnv.height / 60 * 16);
        // i++;
        // if (i === 320) i = 0;

        // - End -
        requestAnimationFrame(loop);
    }
} else {
    cnv.style.display = 'none';
    errorText.style.display = 'block';
}
// -- Add Event Listeners
docGetID("test").addEventListener('mousedown', function () {
    cnv.requestFullscreen();
    cnv.focus();
});

// -- Functions --

// - Event Functions -

// - Functions -