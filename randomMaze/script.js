// Random Maze Generator by Timothy V 

// -- Initialize Variables --

// - HTML Elements -

// Canvas
let cnv = docGetID("mazeCanvas");

// Inputs
let inputs = {
    widthEl: docGetID("mazeWidthIn"),
    heightEl: docGetID("mazeHeightIn"),
    speedEl: docGetID("genSpeedIn"),
    showWidgetsEl: docGetID("showWidgetsBox"),
    generateBtnEl: docGetID("generateBtn")
};

let gridSize = {
    width: 16,
    height: 9
}

let iterator = {
    cycle: 0,
    speed: 2
}

margin = 18;

let grid = new Array();

let circles = new Array();

let walls = {};

let go = false;

let color = 'black';

// - Glbl Variables -

// -- Canvas & Context setup
/** @type {CanvasRenderingContext2D} */
let ctx = cnv.getContext("2d");

generate();

// -- Main Loops --
interval = setInterval(genLoop, 1);

requestAnimationFrame(drawLoop);

function drawLoop() {
    // - Draw -

    drawGrid(cnv, ctx, grid, margin, color);

    if(inputs.showWidgetsEl.checked){
        circles = calculateCircles(grid);

    ctx.fillStyle = 'rgb(0,10,255)';
    circles.forEach(element => {
        ctx.fillRect(element.x * 20 + margin + 2, element.y * 20 + margin + 2, 6, 6)
    });
    ctx.fillStyle = 'white';
    ctx.fillText(`Common ID: ${circles[0].set}`,2,10)
    }

    drawWalls(ctx, walls, margin);

    // - End -
    requestAnimationFrame(drawLoop);
}

// -- Add Event Listeners

inputs.generateBtnEl.addEventListener('click', generate);

cnv.addEventListener('click', function () {
    go = true;
});

// -- Functions --

// - Event Functions -

// Generate Grid

function generate() {
    gridSize.width = (+inputs.widthEl.value);
    gridSize.height = (+inputs.heightEl.value);

    grid = generateGrid(gridSize.width, gridSize.height)

    walls = generateWalls(grid);

    drawGrid(cnv, ctx, grid, margin);
    drawWalls(ctx, walls, margin);



    iterator.speed = +inputs.speedEl.value;
    iterator.cycle = +inputs.speedEl.value;
}

function genLoop() {
    // - Update Variables -

    iterator.cycle++;
    if (iterator.cycle >= iterator.speed) {
        for (let v = 0; v < (5 - Math.round(+inputs.speedEl.value / 10)) + 1; v++) {

            if (!checkCells(grid)) {

                color = 'rgb(255,200,200)';

                const wallDirectionRandom = Math.round(Math.random());

                if (wallDirectionRandom === 0) {

                    const yCoord = Math.round(Math.random() * (walls.horizontalWalls.length - 1));
                    const xCoord = Math.round(Math.random() * (walls.horizontalWalls[yCoord].length - 1));

                    const wall = walls.horizontalWalls[yCoord][xCoord];

                    const targetSet = grid[wall.rightCell.x][wall.rightCell.y].set;
                    const resultSet = grid[wall.leftCell.x][wall.leftCell.y].set;

                    if (targetSet !== resultSet) {

                        for (let x = 0; x < grid.length; x++) {
                            for (let y = 0; y < grid[0].length; y++) {
                                if (grid[x][y].set === targetSet) {
                                    grid[x][y].set = resultSet;
                                }

                            }

                        }

                        walls.horizontalWalls[yCoord].splice(xCoord, 1);

                        for (let n = 0; n < walls.horizontalWalls.length; n++) {
                            if (walls.horizontalWalls[n].length === 0) {
                                walls.horizontalWalls.splice(n, 1);
                            }

                        }
                    }

                } else {
                    const xCoord = Math.round(Math.random() * (walls.verticalWalls.length - 1));
                    const yCoord = Math.round(Math.random() * (walls.verticalWalls[xCoord].length - 1));

                    const wall = walls.verticalWalls[xCoord][yCoord];

                    const targetSet = grid[wall.belowCell.x][wall.belowCell.y].set;
                    const resultSet = grid[wall.aboveCell.x][wall.aboveCell.y].set;

                    if (targetSet !== resultSet) {

                        for (let x = 0; x < grid.length; x++) {
                            for (let y = 0; y < grid[0].length; y++) {
                                if (grid[x][y].set === targetSet) {
                                    grid[x][y].set = resultSet;
                                }

                            }

                        }

                        walls.verticalWalls[xCoord].splice(yCoord, 1);

                        for (let n = 0; n < walls.verticalWalls.length; n++) {
                            if (walls.verticalWalls[n].length === 0) {
                                walls.verticalWalls.splice(n, 1);
                            }
                        }
                    }

                }
            } else {
                color = 'white';
            }
        }

        iterator.cycle = 0;
    }
}