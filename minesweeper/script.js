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
    mineCounter: 0
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
    if (grid.gameOver) {
        if (game.mineCounter < game.mines) {
            loop1: for (let x = 0; x < game.size; x++) {
                for (let y = 0; y < game.size; y++) {
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
    console.log(grid.uncoveredCells);
    // - End -
    requestAnimationFrame(loop);
}

// -- Add Event Listeners
cnv.addEventListener('mousedown', function (event) {
    event.preventDefault();

    if (!grid.gameOver) {
        if (event.which === 1) {
            cnvRect = cnv.getBoundingClientRect();
            if (!grid.started) {
                grid.populateMines(cnvRect, mouse, event, game.mines);
            }
            checkMineClick(cnvRect, mouse, grid, event)
        } else if (event.which === 3) {
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