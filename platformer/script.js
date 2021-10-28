// Platformer Script by Timothy V 

let cnv = docGetID("platformerCanvas");
let errorText = docGetID("errorText");

if (screen.width >= 1280 && screen.height >= 720) {
    // -- Initialize Variables --

    // HTML Elements

    // Glbl Variables

    // -- Canvas & Context setup
    /** @type {CanvasRenderingContext2D} */
    let ctx = cnv.getContext("2d");

    cnv.width = 100;
    cnv.height = 100;

    // -- Main Loop --
    requestAnimationFrame(loop);

    function loop() {
        // - Update Variables -


        // - Draw -


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