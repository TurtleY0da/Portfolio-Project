// Minesweeper by Timothy V 

// -- Initialize Variables --

// HTML Elements
let cnv = docGetID("minesweeperCanvas");

// -- Canvas & Context setup
/** @type {CanvasRenderingContext2D} */
let ctx = cnv.getContext("2d");

cnv.width = 1040;
cnv.height = 585;

// Glbl Variables
let mineImgEl = new Image(512, 512);
mineImgEl.src = '../img/mine.png';

let mouse = {
    x: 0,
    y: 0,
    squareX: 0,
    squareY: 0
}

let openSans = new FontFace('openSans', 'url(./OpenSans-Light.ttf)');

let grid = new mineGrid(20);

let size = cnv.height / grid.size / 1.1;

// UpDown Margin 26.6
// LeftRight Margin 254.1

// -- Main Loop --
requestAnimationFrame(loop);

document.fonts.add(openSans);

function loop() {
    // - Update Variables -


    // - Draw -
    ctx.fillStyle = '#011627';
    ctx.fillRect(0, 0, cnv.width, cnv.height);

    grid.grid.forEach(array => {
        array.forEach(element => {
            // ctx.fillStyle = 'lightblue';
            // if(element.mine) ctx.fillStyle = 'red';
            // ctx.fillRect(element.x*size+(cnv.width/2-grid.size*size/2),element.y*size+(cnv.height/2-grid.size*size/2), size-1, size-1);
            if (element.state === -1) {
                ctx.fillStyle = '#010f1b';
                ctx.fillRect(element.x * size + (cnv.width / 2 - grid.size * size / 2), element.y * size + (cnv.height / 2 - grid.size * size / 2), size, size);

                ctx.fillStyle = '#021d33';
                ctx.beginPath();
                ctx.moveTo(element.x * size + (cnv.width / 2 - grid.size * size / 2), element.y * size + (cnv.height / 2 - grid.size * size / 2));
                ctx.lineTo(element.x * size + (cnv.width / 2 - grid.size * size / 2) + size, element.y * size + (cnv.height / 2 - grid.size * size / 2) + size);
                ctx.lineTo(element.x * size + (cnv.width / 2 - grid.size * size / 2) + size, element.y * size + (cnv.height / 2 - grid.size * size / 2));
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#011627';
                ctx.fillRect(element.x * size + (cnv.width / 2 - grid.size * size / 2) + size / 10, element.y * size + (cnv.height / 2 - grid.size * size / 2) + size / 10, size - size / 10 * 2, size - size / 10 * 2);

            } else {

                ctx.fillStyle = '#021e35';
                ctx.fillRect(element.x * size + (cnv.width / 2 - grid.size * size / 2) - 1, element.y * size + (cnv.height / 2 - grid.size * size / 2) - 1, size + 1, size + 1);

                if (element.state > 0) {
                    ctx.fillStyle = 'white';
                    ctx.font =  `${size/2.2}px openSans`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(element.state, 254.1 + (element.x + 1) * size - size / 2, 26.6 + (element.y + 1) * size - size / 2);
                }

            }
            // ctx.fillStyle = 'white';
            // if(element.state === -1) ctx.fillStyle = 'lightblue';
            // if(element.state > 0) ctx.fillStyle = 'green';
            // if(element.mine) ctx.fillStyle = 'red';
            // ctx.font = "30px openSans";
            // ctx.textAlign = 'center';
            // ctx.textBaseline = 'middle';
            // ctx.fillText(element.state, 254.1+(element.x+1)*size-size/2, 26.6+(element.y+1)*size-size/2);
        });
    });

    // - End -
    requestAnimationFrame(loop);
}

// -- Add Event Listeners
cnv.addEventListener('mousedown', function (event) {
    cnvRect = cnv.getBoundingClientRect();
    if(!grid.started){
        grid.populateMines(cnvRect, mouse, event, 30);
    }
    checkMineClick(cnvRect, mouse, grid, event);
});

// -- Functions --

// - Event Functions -

// - Functions -