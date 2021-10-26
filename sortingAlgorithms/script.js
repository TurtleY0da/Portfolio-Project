// Sorting Algorithm Exeriment by Timothy V 

// -- Initialize Variables --

// HTML Elements
let cnv = docGetID("myCanvas");

// Glbl Variables
// Item: {array:[], activeItem: 0}
let sorterChart = new sortingChart(100, [{array:[], activeItem: 0}, {array:[], activeItem: 0}, {array:[], activeItem: 0, secondaryItems: [0,0]}]);

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
    ctx.clearRect(0, 0, cnv.width, cnv.height);
    ctx.lineWidth = (1000/sorterChart.randomArray.length)-((1000/sorterChart.randomArray.length)/10);

    sorterChart.draw(ctx);

    // - End -
    requestAnimationFrame(loop);
}

// -- Add Event Listeners


// -- Functions --

// - Event Functions -

// - Functions -