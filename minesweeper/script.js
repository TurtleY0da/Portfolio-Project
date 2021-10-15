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

let time = {
    now: 0,
    prev: Date.now(),
    deltaTime: 0,
}

let counter = {
    startTime: 0,
    now: 0,
    milliseconds: '000',
    seconds: '00',
    minutes: '0'
}

let mainMenu = [new parentMenu('Easy', 270, 173, 500, 80, 173, ['8x8', '9x9', '10x10'], [startGame, startGame, startGame], [
    [8, 10],
    [9, 10],
    [10, 10]
]), new parentMenu('Medium', 270, 252.5, 500, 80, 173, ['14x14', '15x15', '16x16'], [startGame, startGame, startGame], [
    [14, 40],
    [15, 40],
    [16, 40]
]), new parentMenu('Hard', 270, 332, 500, 80, 173, ['19x19', '20x20', '21x21'], [startGame, startGame, startGame], [
    [19, 99],
    [20, 99],
    [21, 99]
])];

let showMenu = true;

let openSans = new FontFace('openSans', 'url(../fonts/OpenSans-Light.ttf)');

let grid = new mineGrid(game.size);
grid.gameState = 4;

let size = cnv.height / grid.size / 1.1;

// -- Main Loop --
requestAnimationFrame(loop);

document.fonts.add(openSans);

function loop() {
    // - Update Variables -
    time.now = Date.now();
    time.deltaTime = time.now - time.prev;
    time.prev = Date.now();
    counter.now = Date.now() - counter.startTime;

    if (grid.gameState === 1) {
        counter.milliseconds = JSON.stringify(counter.now % 1000);
        counter.seconds = JSON.stringify(Math.floor(counter.now / 1000) % 60);
        counter.minutes = JSON.stringify(Math.floor(counter.now / 60000));
    }

    if (grid.gameState > 1 && grid.gameState !== 4) {
        if (game.mineCounter < game.mines) {
            loop1: for (let y = 0; y < game.size; y++) {
                for (let x = 0; x < game.size; x++) {
                    if (grid.grid[x][y].state < 0 && grid.grid[x][y].mine) {
                        grid.grid[x][y].state = 0;
                        break loop1;
                    }
                }
            }
            game.mineCounter++;
        }
    }

    // - Draw -
    ctx.fillStyle = '#042847';
    ctx.fillRect(0, 0, cnv.width, cnv.height);


    if (grid.gameState > 1 && grid.gameState !== 4) {
        ctx.save();

        ctx.beginPath();
        ctx.rect(250.1, 22.6, 539.8, 539.8);
        ctx.clip();

        if (grid.gameState === 2) ctx.fillStyle = 'rgb(255,150,150)';
        if (grid.gameState === 3) ctx.fillStyle = 'rgb(150,255,150)';

        ctx.beginPath();
        ctx.arc(cnv.width / 2, cnv.height / 2, 400, 0, (game.decorationRotation * Math.PI / 180));
        ctx.lineTo(cnv.width / 2, cnv.height / 2);
        ctx.fill();

        ctx.restore();

        game.decorationRotation = game.mineCounter / game.mines * 360;
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
                if (element.mine) ctx.fillStyle = '#095faa';

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

    ctx.fillStyle = 'white';
    ctx.font = `48px openSans`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'hanging';
    ctx.fillText(`${counter.minutes}:${(counter.seconds.length === 1) ? '0' + counter.seconds : counter.seconds}:${counter.milliseconds.slice(0,-1)}`, 4, 0);

    cnv.style = 'cursor: default;'
    if (showMenu) {
        mainMenu.forEach(element => {
            element.updateVariables(time.deltaTime);

            element.draw(ctx, '#33DD77', mainMenu);

            if (element.hover) {
                cnv.style = 'cursor: pointer;'
            } else {
                element.children.forEach(child => {
                    if (child.hover) {
                        cnv.style = 'cursor: pointer;'
                    }
                });
            }
        });
    }

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
                counter.startTime = Date.now();
                grid.populateMines(cnvRect, mouse, event, game.mines);
            }
            checkMineClick(cnvRect, mouse, grid, event);
            checkMineVictoryConditions(game, grid);

        } else if (event.button === 2) {

            if(grid.gameState === 1){
                cnvRect = cnv.getBoundingClientRect();
                placeFlag(cnvRect, mouse, grid, event);
            }

        }

    } else if (!showMenu) {

        if (event.button === 0) showMenu = true;

    } else if (showMenu) {

        if (event.button === 0){
            mainMenu.forEach(element => {
                if (element.hover && !element.active) {
                    element.active = true;
                } else if (!element.hover || element.active) {
                    element.active = false;
                    element.children.forEach(child => {
                        if (child.hover) {
                            child.click();
                        }
                    });
                }
            });
        }

    }

});

cnv.addEventListener('mousemove', function (event) {
    cnvRect = cnv.getBoundingClientRect();

    mainMenu.forEach(element => {
        element.checkMouse(mouse, event, cnvRect);
    });

});

cnv.oncontextmenu = function (event) {
    event.preventDefault();
}

// -- Functions --

// - Event Functions -

// - Functions -

function startGame(parameters) {
    showMenu = false;
    game = {
        mines: parameters[1],
        size: parameters[0],
        mineCounter: 0,
        decorationRotation: 0
    }
    grid = new mineGrid(game.size);
    size = cnv.height / grid.size / 1.1;

}