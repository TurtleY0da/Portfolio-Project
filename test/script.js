// [Name] by Timothy V 

// -- Initialize Variables --

// HTML Elements
let cnv = docGetID("myCanvas");

// Glbl Variables
let staticPoly = [new PVector(500, 100), new PVector(300, 450), new PVector(150, 300), new PVector(250, 120)];
let movingPoly = [new PVector(50, 160), new PVector(85, 130), new PVector(75, 100), new PVector(65, 110), new PVector(65, 100), new PVector(35, 130), new PVector(50, 135)];

// -- Canvas & Context setup
/** @type {CanvasRenderingContext2D} */
let ctx = cnv.getContext("2d");

cnv.width = 1040;
cnv.height = 585;

// -- Main Loop --
requestAnimationFrame(loop);

function loop(){
    // - Update Variables -


    // - Draw -
    ctx.clearRect(0,0,cnv.width,cnv.height);
    ctx.lineWidth = 3;
    // polyPoly(staticPoly, movingPoly)
    // polyLine(staticPoly, movingPoly[0].x, movingPoly[0].y, movingPoly[1].x, movingPoly[1].y)
    // lineLine(staticPoly[2].x, staticPoly[2].y, staticPoly[3].x, staticPoly[3].y, movingPoly[0].x, movingPoly[0].y, movingPoly[1].x, movingPoly[1].y)
    if(polyPoly(staticPoly, movingPoly)) ctx.strokeStyle = 'red';
    else ctx.strokeStyle = 'black';
    
    ctx.beginPath();
    ctx.moveTo(staticPoly[0].x, staticPoly[0].y);
    for(let i = 1; i < staticPoly.length; i++){
        ctx.lineTo(staticPoly[i].x, staticPoly[i].y);
    }
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(movingPoly[0].x, movingPoly[0].y);
    for(let i = 1; i < movingPoly.length; i++){
        ctx.lineTo(movingPoly[i].x, movingPoly[i].y);
    }
    ctx.closePath();
    ctx.stroke();
}

// -- Add Event Listeners
document.addEventListener('mousemove', function(event) {
    let cnvRect = cnv.getBoundingClientRect();

    let difference = new PVector(Math.round(event.clientX - cnvRect.left), Math.round(event.clientY - cnvRect.top));
    difference.sub(movingPoly[0]);
    for(let i = 0; i < movingPoly.length; i++){
        movingPoly[i].add(difference);
    }

    loop();
});

// -- Functions --

// - Event Functions -

// - Functions -