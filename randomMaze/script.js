// Random Maze Generator by Timothy V 

// -- Initialize Variables --

// - HTML Elements -

// Canvas
let cnv = docGetID("mazeCanvas");

// Inputs
let inputs = {
    widthEl: docGetID("mazeWidthIn"), // Maze Width
    heightEl: docGetID("mazeHeightIn"), // Maze Height
    speedEl: docGetID("genSpeedIn"), // Iteration Time
    showWidgetsEl: docGetID("showWidgetsBox"), // Show widgets Yes/No
    solveMazeEl: docGetID("solveMazeBox"), // Solve the maze Yes/No
    generateBtnEl: docGetID("generateBtn") // Generate the maze
};

// - Global Variables -

// Objects

let gridSize = {
    width: 16, // Maze width
    height: 9 // Maze height
};

let iterator = {
    cycle: 0, // Cycle number
    speed: 2 // Iteration Time
};

let solutionDraw = {
    closedSet: 0, // Counting number of closed nodes
    path: 0 // Counting number path nodes
};

let mazeSolver = {
    solve: false,
    solved: false,
};


// Variables

let margin = 18; // Maze Margin

let color = 'black'; // Background color

// Empty Arrays

let grid = new Array(); // Cell grid Array 

let squares = new Array(); // Widget squares Array

let maze = new Array(); // Cell grid and Maze walls converted to grid of nodes

// Empty Objects

let walls = new Object(); // Maze walls Object: Will contain 2 Arrays

let result = new Object(); // 

// -- Canvas & Context setup
/** @type {CanvasRenderingContext2D} */
let ctx = cnv.getContext("2d");

generate(); // Generate first maze on page load

// -- Main Loops --
interval = setInterval(genLoop, 1); // Maze generation loop (Not framerate dependant);

requestAnimationFrame(drawLoop); // Drawing loop (Framerate dependant)

function drawLoop() {
    // - Draw -

    if (!mazeSolver.solved) { // If the maze HAS NOT been solved

        drawGrid(cnv, ctx, grid, margin, color); // Call function from ../global-scripts/lib.js
        drawWalls(ctx, walls, margin); // Call function from ../global-scripts/lib.js

        if (inputs.showWidgetsEl.checked) { // Draw widgets

            squares = calculateSquares(grid); // Call function from ../global-scripts/lib.js

            ctx.fillStyle = 'rgb(0,10,255)'; // Set fill color to blue

            squares.forEach(element => { // For each element in the widgets array: 

                ctx.fillRect(element.x * 20 + margin + 2, element.y * 20 + margin + 2, 6, 6); // Draw a square on every cell with the most common set

            });

            ctx.fillStyle = 'white'; // Set the fill color to white
            ctx.fillText(`Common ID: ${squares[0].set}`, 2, 10) // Display value of most common set in the top left corner

        }

    } else { // If the maze HAS been solved

        if (solutionDraw.closedSet === 0 && solutionDraw.path === 0) { // If just beginning to draw maze solution:

            color = 'white'; // Set fill color to white

            drawGrid(cnv, ctx, grid, margin, color); // Call function from ../global-scripts/lib.js
            drawWalls(ctx, walls, margin); // Call function from ../global-scripts/lib.js

        }
        for (let i = 0; i < 3; i++) {
            if (solutionDraw.closedSet !== result.closedSet.length) { // If it has not drawn all of the orange tiles:

                if (solutionDraw.closedSet === 0) { // If at the beginning of the path

                    ctx.fillStyle = '#00FF00' // Set the fill color to green

                } else if (solutionDraw.closedSet === result.closedSet.length - 1) { // If at the end of the path

                    ctx.fillStyle = '#FF0000' // Set the fill color to red

                } else { // If drawing any other tile

                    ctx.fillStyle = 'orange' // Set the fill color to orange 

                }

                ctx.fillRect(result.closedSet[solutionDraw.closedSet].x * 10 + margin, result.closedSet[solutionDraw.closedSet].y * 10 + margin, 10, 10); // Draw the tile at the location given by the array

                solutionDraw.closedSet++; // Iterate
            } else if (solutionDraw.path !== result.path.length) { // If done drawing tiles, but not solution line:

                ctx.lineWidth = 2; // Set the line width to 2 pixels
                ctx.lineCap = "round"; // Set the cap of the line to be rounded
                ctx.strokeStyle = '#12756b'; // Set the line color to cyan

                if (solutionDraw.path === 0) { // If at the beginning of the path

                    ctx.beginPath();

                    // Create a line from the starting tile to the first tile of the solution array
                    ctx.moveTo(maze[0][maze[0].length - 1].x * 10 + margin + 5, maze[0][maze[0].length - 1].y * 10 + margin + 5);
                    ctx.lineTo(result.path[solutionDraw.path].x * 10 + margin + 5, result.path[solutionDraw.path].y * 10 + margin + 5);

                    ctx.stroke(); // Draw the line

                } else { // If not at the beginning path

                    ctx.beginPath();

                    // Create a line from the previous tile to the current one
                    ctx.moveTo(result.path[solutionDraw.path - 1].x * 10 + margin + 5, result.path[solutionDraw.path - 1].y * 10 + margin + 5);
                    ctx.lineTo(result.path[solutionDraw.path].x * 10 + margin + 5, result.path[solutionDraw.path].y * 10 + margin + 5);

                    ctx.stroke(); // Draw the line
                }

                solutionDraw.path++; // Iterate
            }
        }
    }
    // - End -
    requestAnimationFrame(drawLoop); // Call this loop
}

// -- Add Event Listeners

inputs.generateBtnEl.addEventListener('click', generate); // When the "Generate" button is pressed, generate a new maze

// -- Functions --

// - Event Functions -

// Generate Grid

function generate() { // Generate a new maze

    gridSize.width = (+inputs.widthEl.value); // Get the width value
    gridSize.height = (+inputs.heightEl.value); // Get the height value

    grid = generateGrid(gridSize.width, gridSize.height); // Call function from ../global-scripts/lib.js

    walls = generateWalls(grid); // Call function from ../global-scripts/lib.js

    // (Re)Set values
    mazeSolver.solve = inputs.solveMazeEl.checked; // Solve the maze Yes/No
    mazeSolver.solved = false; // The maze is no longer solved

    iterator.speed = +inputs.speedEl.value; // How many cycles before iteration
    iterator.cycle = +inputs.speedEl.value; // Start by iterating imediately

    solutionDraw.closedSet = 0; // Reset iterator
    solutionDraw.path = 0; // Reset iterator

}

function genLoop() {
    // - Update Variables -

    iterator.cycle++; // Increase cycle value

    if (iterator.cycle >= iterator.speed) { // If cycle has passed iteration threshold:

        for (let v = 0; v < (5 - Math.round(iterator.speed / 10)) + 1; v++) { // Run more times the lower the iteration threshold is

            if (!checkCells(grid)) { // Call function from ../global-scripts/lib.js

                color = 'rgb(255,200,200)'; // Set the background fill color

                const wallDirectionRandom = Math.round(Math.random()); // Determine whether to delet a horizontal wall, or a vertical one

                if (wallDirectionRandom === 0) { // Delete a horizontal wall

                    const yCoord = Math.round(Math.random() * (walls.horizontalWalls.length - 1)); // Randomly choose a y coord
                    const xCoord = Math.round(Math.random() * (walls.horizontalWalls[yCoord].length - 1)); // Randomly choose an x coord

                    const wall = walls.horizontalWalls[yCoord][xCoord]; // Find the wall at the coords

                    const targetSet = grid[wall.rightCell.x][wall.rightCell.y].set; // Get set value of left cell
                    const resultSet = grid[wall.leftCell.x][wall.leftCell.y].set; // Get set value of right cell

                    if (targetSet !== resultSet) { // If they are not of the same set:

                        for (let x = 0; x < grid.length; x++) { // Loop over every horizontal wall

                            for (let y = 0; y < grid[0].length; y++) {

                                if (grid[x][y].set === targetSet) { // If the current cell has the targeted set:

                                    grid[x][y].set = resultSet; // Set it to the new set

                                }

                            }

                        }

                        walls.horizontalWalls[yCoord].splice(xCoord, 1); // Remove the wall

                        for (let n = 0; n < walls.horizontalWalls.length; n++) { // Loop over every wall array

                            if (walls.horizontalWalls[n].length === 0) { // If the current array is empty

                                walls.horizontalWalls.splice(n, 1); // Remove the array

                            }

                        }

                    }

                } else { // Delete a vertical wall

                    const xCoord = Math.round(Math.random() * (walls.verticalWalls.length - 1)); // Randomly choose a y coord
                    const yCoord = Math.round(Math.random() * (walls.verticalWalls[xCoord].length - 1)); // Randomly choose an x coord

                    const wall = walls.verticalWalls[xCoord][yCoord]; // Find the wall at the coords

                    const targetSet = grid[wall.belowCell.x][wall.belowCell.y].set; // Get set value of above cell
                    const resultSet = grid[wall.aboveCell.x][wall.aboveCell.y].set; // Get set value of below cell

                    if (targetSet !== resultSet) { // If they are not of the same set:

                        for (let x = 0; x < grid.length; x++) { // Loop over every vertical wall

                            for (let y = 0; y < grid[0].length; y++) {

                                if (grid[x][y].set === targetSet) { // If the current cell has the targeted set:

                                    grid[x][y].set = resultSet; // Set it to the new set

                                }

                            }

                        }

                        walls.verticalWalls[xCoord].splice(yCoord, 1); // Remove the wall

                        for (let n = 0; n < walls.verticalWalls.length; n++) { // Loop over every wall array

                            if (walls.verticalWalls[n].length === 0) { // If the current array is empty

                                walls.verticalWalls.splice(n, 1); // Remove the array

                            }

                        }

                    }

                }

            } else if (mazeSolver.solve && !mazeSolver.solved) { // If the maze has to be solved, but has not been solved yet

                mazeSolver.solved = true; // Set the value, so this doesn't repeat

                maze = convertToMaze(walls, gridSize); // Convert the cells and walls to a single grid of nodes

                result = findPath(maze[0][maze[0].length - 1], maze[maze.length - 1][0], maze); // Find the path from the bottom left to the top right
            } else { // If nothing has to be done

                color = 'white'; // Set the background color to white

            }
        }

        iterator.cycle = 0; // Iterate

    }
}