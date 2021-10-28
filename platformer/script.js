// Platformer Script by Timothy V 

let cnv = docGetID("platformerCanvas");
let errorText = docGetID("errorText");

if (screen.width >= 1280 && screen.height >= 720) {
    // -- Initialize Variables --

    // HTML Elements

    // Glbl Variables

    let fullscreen = false;

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
            cnv.width = 1040;
            cnv.height = 585;
        }

        // - Draw -
        if (fullscreen) {
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, cnv.width, cnv.height);
            ctx.clearRect(0, 0, Math.floor(screen.width / 1280), Math.floor(screen.height / 720))
        } else {
            ctx.clearRect(0, 0, cnv.width, cnv.height)
        }

        // - End -
        requestAnimationFrame(loop);
    }
} else {
    cnv.style.display = 'none';
    errorText.style.display = 'block';
}
// -- Add Event Listeners


// -- Functions --

// - Event Functions -

// - Functions -