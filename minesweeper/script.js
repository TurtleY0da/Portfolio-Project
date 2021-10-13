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
let flagImgEl = new Image(512, 512);
flagImgEl.src = '../img/flag.png';

let game = {
    mines: 10,
    size: 8,
    mineCounter: 0,
    decorationRotation: 0
}

let mouse = {
    x: 0,
    y: 0,
    squareX: 0,
    squareY: 0
}

let openSans = new FontFace('openSans', 'url(./OpenSans-Light.ttf)');

let grid = new mineGrid(game.size);

let size = cnv.height / grid.size / 1.1;

// UpDown Margin 26.6
// LeftRight Margin 254.1

// -- Main Loop --
requestAnimationFrame(loop);

document.fonts.add(openSans);

function loop() {
    // - Update Variables -
    if (grid.gameState > 1) {
        if (game.mineCounter < game.mines) {
            loop1: for (let y = 0; y < game.size; y++) {
                for (let x = 0; x < game.size; x++) {
                    if (grid.grid[x][y].state < 0 && grid.grid[x][y].mine) {
                        grid.grid[x][y].state = 0;
                        break loop1;
                    }
                }
            }

        }
    }

    // - Draw -
    ctx.fillStyle = '#042847';
    ctx.fillRect(0, 0, cnv.width, cnv.height);

    if (grid.gameState > 1) {
        ctx.save();

        ctx.beginPath();
        ctx.rect(250.1, 22.6, 539.8, 539.8);
        ctx.clip();

        if (grid.gameState === 2) ctx.fillStyle = 'rgb(255,150,150)';
        if (grid.gameState === 3) ctx.fillStyle = 'rgb(150,255,150)';

        ctx.beginPath();
        ctx.arc(cnv.width/2, cnv.height/2, 400, 0, ((game.decorationRotation*4)*Math.PI/180));
        ctx.lineTo(cnv.width/2, cnv.height/2);
        ctx.fill();

        ctx.restore();

        if (game.decorationRotation < 90) game.decorationRotation++;
    }

    grid.grid.forEach(array => {

        array.forEach(element => {

            if (element.state < 0) {

                ctx.fillStyle = '#033057';
                ctx.fillRect(element.x * size + (cnv.width / 2 - grid.size * size / 2), element.y * size + (cnv.height / 2 - grid.size * size / 2), size, size);

                ctx.fillStyle = '#084174';
                ctx.beginPath();
                ctx.moveTo(element.x * size + (cnv.width / 2 - grid.size * size / 2), element.y * size + (cnv.height / 2 - grid.size * size / 2));
                ctx.lineTo(element.x * size + (cnv.width / 2 - grid.size * size / 2) + size, element.y * size + (cnv.height / 2 - grid.size * size / 2) + size);
                ctx.lineTo(element.x * size + (cnv.width / 2 - grid.size * size / 2) + size, element.y * size + (cnv.height / 2 - grid.size * size / 2));
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#06345c';
                ctx.fillRect(element.x * size + (cnv.width / 2 - grid.size * size / 2) + size / 10, element.y * size + (cnv.height / 2 - grid.size * size / 2) + size / 10, size - size / 10 * 2, size - size / 10 * 2);

                if (element.state === -2) {
                    ctx.drawImage(flagImgEl, element.x * size + (cnv.width / 2 - grid.size * size / 2) + size / 5, element.y * size + (cnv.height / 2 - grid.size * size / 2) + size / 5, size - size / 5 * 2, size - size / 5 * 2);
                }

            } else {

                ctx.fillStyle = '#36648b';
                if(element.mine) ctx.fillStyle = '#095faa';
                ctx.fillRect(element.x * size + (cnv.width / 2 - grid.size * size / 2) - 1, element.y * size + (cnv.height / 2 - grid.size * size / 2) - 1, size + 1, size + 1);

                if (element.state > 0 && !element.mine) {
                    ctx.fillStyle = 'white';
                    ctx.font = `${size/2.2}px openSans`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(element.state, 254.1 + (element.x + 1) * size - size / 2, 26.6 + (element.y + 1) * size - size / 2);
                } else if (element.state === 0 && element.mine) {
                    ctx.drawImage(mineImgEl, element.x * size + (cnv.width / 2 - grid.size * size / 2) + size / 5, element.y * size + (cnv.height / 2 - grid.size * size / 2) + size / 5, size - size / 5 * 2, size - size / 5 * 2);
                }

            }
        });
    });

    

    // - End -
    requestAnimationFrame(loop);
}

// -- Add Event Listeners
cnv.addEventListener('mousedown', function (event) {
    event.preventDefault();

    if (grid.gameState < 2) {
        if (event.button === 0) {
            cnvRect = cnv.getBoundingClientRect();
            if (grid.gameState === 0) {
                grid.populateMines(cnvRect, mouse, event, game.mines);
            }
            checkMineClick(cnvRect, mouse, grid, event);
            checkMineVictoryConditions(game, grid);
        } else if (event.button === 2) {
            cnvRect = cnv.getBoundingClientRect();
            placeFlag(cnvRect, mouse, grid, event);
        }
    }

});

cnv.oncontextmenu = function (event) {
    event.preventDefault();
}

// -- Functions --

// - Event Functions -

// - Functions -