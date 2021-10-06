6 // -- Global Functions --

// - Async Pause -
const timer = ms => new Promise(res => setTimeout(res, ms));

// - Helpers -
function docGetID(id) {
    return document.getElementById(id);
}

function docGetClass(className) {
    return document.getElementsByClassName(className);
}

// - Dropdown Menu -
function dropdownToggle(toggle, array) {
    toggle = !toggle;
    if (toggle === true) {
        for (let n = 0; n < array.length; n++) {
            array[n].classList.add("smallDropdown");
        }
    }
    if (toggle === false) {
        for (let n = 0; n < array.length; n++) {
            array[n].classList.remove("smallDropdown");
        }
    }
    return toggle;
}

// - Replace ID & innerHTML -
function replaceHTML(searchID, resultHTML) {
    docGetID(searchID).innerHTML = resultHTML;
    return docGetID(searchID);
}

// - Mouse handlers -
function getMousePos(event, canvas) {
    let canvasOffset = canvas.getBoundingClientRect();
    let mouse = {
        x: 0,
        y: 0
    }
    event.preventDefault();
    mouse.x = 1 + (Math.round(+event.clientX - canvasOffset.left));
    mouse.y = 1 + (Math.round(+event.clientY - canvasOffset.top));
    return mouse;
}

// - Go to Home Page -
function gotoHome() {
    location.replace("../mainPage/")
}

// - Rounded Rectangle -
CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius) {
    if (width < 2 * radius) radius = width / 2;
    if (height < 2 * radius) radius = height / 2;
    this.beginPath();
    this.moveTo(x + radius, y);
    this.arcTo(x + width, y, x + width, y + height, radius);
    this.arcTo(x + width, y + height, x, y + height, radius);
    this.arcTo(x, y + height, x, y, radius);
    this.arcTo(x, y, x + width, y, radius);
    this.closePath();
    return this;
}

// - Create an Image -
function createImage(source, canvas2dContext, canvas) {

    let width = canvas.width + (source.zoom * (canvas.width / canvas.height))
    let height = canvas.height + source.zoom;

    let coords = {
        x: 0 - (source.x / canvas.width) * (width - canvas.width),
        y: 0 - (source.y / canvas.height) * (height - canvas.height)
    };

    canvas2dContext.drawImage(source.url, coords.x, coords.y, width, height);
}

// -- Local Functions --

// - Gravity Sim -

function checkButtonPress(event, button, canvas) {
    !event.preventDefault();
    mousePos = getMousePos(event, canvas);
    if (mousePos.x > button.x && mousePos.y > button.y && mousePos.x < button.x + button.w && mousePos.y < button.y + button.h) {
        return true;
    } else {
        return false;
    }
}

function checkShift(shiftBool, newValue, oldValue) {
    if (shiftBool) {
        if (newValue > oldValue) {
            return 4;
        } else if (newValue < oldValue) {
            return -4;
        } else {
            return 0;
        }
    } else {
        return 0;
    }
}

// - Maze Generator -

// Generate Grid Array
function generateGrid(gridWidth, gridHeight) {
    let grid = new Array()
    let set = 0;
    for (let x = 0; x < gridWidth; x++) {
        grid.push(new Array());
        for (let y = 0; y < gridHeight; y++) {
            grid[x].push(new Object({
                set: set,
                x: x,
                y: y
            }));
            set++;
        }
    }
    return grid;
}

// Draw Grid

function drawGrid(canvas, canvasContext, gridArray, margin, backgroundColor) {
    canvas.width = (gridArray.length * 20 - 10) + margin * 2;
    canvas.height = (gridArray[0].length * 20 - 10) + margin * 2;

    canvasContext.fillStyle = 'black';
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);
    canvasContext.fillStyle = backgroundColor;
    canvasContext.fillRect(margin, margin, canvas.width - margin * 2, canvas.height - margin * 2);

    canvasContext.fillStyle = backgroundColor;
    for (let x = 0; x < gridArray.length; x++) {
        for (let y = 0; y < gridArray[0].length; y++) {
            canvasContext.fillRect((x * 20) + margin, (y * 20) + margin, 10, 10);
        }
    }
    canvasContext.fillStyle = 'black';
    for (let x = 0; x < gridArray.length - 1; x++) {
        for (let y = 0; y < gridArray[0].length - 1; y++) {
            canvasContext.fillRect((x * 20) + 10 + margin, (y * 20) + 10 + margin, 10, 10);
        }
    }
}

// Generate Wall Array

function generateWalls(gridArray) {
    let horizontalWalls = new Array();
    let verticalWalls = new Array();

    // Generate Horizontal Walls
    for (let y = 0; y < (gridArray[0].length); y++) {
        horizontalWalls.push(new Array());
        for (let x = 0; x < (gridArray.length - 1); x++) {
            horizontalWalls[y].push(new Object({
                leftCell: gridArray[x][y],
                rightCell: (gridArray[x + 1][y])
            }));
        }
    }
    for (let x = 0; x < (gridArray.length); x++) {
        verticalWalls.push(new Array());
        for (let y = 0; y < (gridArray[0].length - 1); y++) {
            verticalWalls[x].push(new Object({
                aboveCell: gridArray[x][y],
                belowCell: (gridArray[x][y + 1])
            }));
        }
    }
    let walls = {
        horizontalWalls: horizontalWalls,
        verticalWalls: verticalWalls
    };
    return walls;
}

// Draw Walls

function drawWalls(canvasContext, wallsObject, margin) {

    canvasContext.fillStyle = 'black';
    for (let y = 0; y < wallsObject.horizontalWalls.length; y++) {
        for (let x = 0; x < wallsObject.horizontalWalls[y].length; x++) {
            canvasContext.fillRect((wallsObject.horizontalWalls[y][x].leftCell.x * 20 + 10) + margin, (wallsObject.horizontalWalls[y][x].leftCell.y * 20) + margin, 10, 10);
        }
    }
    for (let x = 0; x < wallsObject.verticalWalls.length; x++) {
        for (let y = 0; y < wallsObject.verticalWalls[x].length; y++) {
            canvasContext.fillRect((wallsObject.verticalWalls[x][y].aboveCell.x * 20) + margin, (wallsObject.verticalWalls[x][y].aboveCell.y * 20 + 10) + margin, 10, 10);
        }
    }
}

// Check for disconnected Cells

function checkCells(gridArray) {
    let cellCheck = gridArray[0][0].set
    for (let x = 0; x < gridArray.length; x++) {
        for (let y = 0; y < gridArray[0].length; y++) {
            if (cellCheck != gridArray[x][y].set) return false;
        }
    }
    return true;
}

// Calculate Decorative Squares

function calculateSquares(gridArray) {
    let sets = new Object();
    for (let x = 0; x < gridArray.length; x++) {
        for (let y = 0; y < gridArray[0].length; y++) {
            if (sets[gridArray[x][y].set] !== undefined) {
                sets[gridArray[x][y].set] = sets[gridArray[x][y].set] + 1;
            } else {
                sets[gridArray[x][y].set] = 1;
            }

        }
    }

    const setsArray = Object.values(sets);
    const setsKey = Object.keys(sets);
    const maxNum = Math.max(...setsArray);
    const maxNumArrayIndex = setsArray.indexOf(maxNum);
    const propertyValue = +setsKey[maxNumArrayIndex]

    let result = new Array();

    for (let x = 0; x < gridArray.length; x++) {
        for (let y = 0; y < gridArray[0].length; y++) {
            if (gridArray[x][y].set === propertyValue) {
                result.push(gridArray[x][y]);
            }
        }
    }
    return result;
}

// Convert cells and walls to maze
function convertToMaze(wallsObject, gridSize) {
    let mazeArray = new Array();

    for (let x = 0; x < (gridSize.width * 2) - 1; x++) {
        mazeArray.push(new Array());
        for (let y = 0; y < (gridSize.height * 2) - 1; y++) {
            mazeArray[x].push(new Object({
                x: x,
                y: y,
                gCost: 0,
                hCost: 0,
                fCost: 0,
                type: undefined,
                parent: undefined
            }));

            if (x % 2 === 0 && y % 2 === 0) {
                mazeArray[x][y].type = 'emptyCell';
            }

            if (x % 2 === 1 && y % 2 === 1) {
                mazeArray[x][y].type = 'wall';
            }

            if (x % 2 === 1 && y % 2 === 0) {
                check_horizontal_walls: for (let arrayY = 0; arrayY < wallsObject.horizontalWalls.length; arrayY++) {
                    for (let arrayX = 0; arrayX < wallsObject.horizontalWalls[arrayY].length; arrayX++) {
                        if (wallsObject.horizontalWalls[arrayY][arrayX].leftCell.x * 2 + 1 === x && wallsObject.horizontalWalls[arrayY][arrayX].leftCell.y * 2 === y) {
                            mazeArray[x][y].type = 'wall'
                            break check_horizontal_walls;
                        }
                    }
                }
            }

            if (x % 2 === 0 && y % 2 === 1) {
                check_vertical_walls: for (let arrayX = 0; arrayX < wallsObject.verticalWalls.length; arrayX++) {
                    for (let arrayY = 0; arrayY < wallsObject.verticalWalls[arrayX].length; arrayY++) {
                        if (wallsObject.verticalWalls[arrayX][arrayY].aboveCell.x * 2 === x && wallsObject.verticalWalls[arrayX][arrayY].aboveCell.y * 2 + 1 === y) {
                            mazeArray[x][y].type = 'wall'
                            break check_vertical_walls;
                        }
                    }
                }
            }

            if (mazeArray[x][y].type === undefined) {
                mazeArray[x][y].type = 'emptyCell';
            }

            if (x === gridSize.width * 2 - 2 && y === 0) {
                mazeArray[x][y].type = 'exitCell';
            }

            if (x === 0 && y === gridSize.height * 2 - 2) {
                mazeArray[x][y].type = 'entranceCell';
            }

        }
    }
    return mazeArray;
}

// Find a path to the end
function findPath(startingNode, targetNode, mazeGrid) {
    let openSet = new Array();
    let closedSet = new Array();

    startingNode.hCost = getDistance(startingNode, targetNode);
    startingNode.fCost = startingNode.gCost + startingNode.hCost;

    openSet.push(startingNode);
    while (openSet.length > 0) {
        let node = openSet[0]
        let index = 0;

        for (let n = 1; n < openSet.length; n++) {
            if (openSet[n].fCost <= node.fCost) {
                if (openSet[n].hCost < node.hCost) {
                    node = openSet[n];
                    index = n;
                }
            }
        }

        openSet.splice(index, 1);
        closedSet.push(node);

        if (node === targetNode) {
            let path = retracePath(startingNode, targetNode);
            let result = {
                path: path,
                closedSet: closedSet,
            }
            return result;
        }

        for (const neighbour of getNeighbours(mazeGrid, node)) {
            if (neighbour.type === 'wall' || closedSet.includes(neighbour)) continue;

            let newGCost = node.gCost + getDistance(node, neighbour);
            if (newGCost < neighbour.gCost || !openSet.includes(neighbour)) {
                neighbour.gCost = newGCost;
                neighbour.hCost = getDistance(neighbour, targetNode);
                neighbour.parent = node;

                if (!openSet.includes(neighbour)) openSet.push(neighbour);
            }
        }
    }
}

// Retrace Final Path
function retracePath(startingNode, targetNode) {
    let path = new Array();
    let currentNode = targetNode;

    while (currentNode != startingNode) {
        path.push(currentNode);
        currentNode = currentNode.parent;
    }

    path.reverse();
    return path;
}

// Get distance to a cell
function getDistance(startingNode, targetNode) {
    const dstX = Math.abs(startingNode.x - targetNode.x);
    const dstY = Math.abs(startingNode.y - targetNode.y);

    if (dstX > dstY) return 14 * dstY + 10 * (dstX - dstY);

    return 14 * dstX + 10 * (dstY - dstX);
}

// Get neighbours of cell
function getNeighbours(mazeGrid, node) {
    let neighbours = new Array();

    for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
            if (x === 0 && y === 0) continue;
            if (Math.abs(x) === 1 && Math.abs(y) === 1) continue;

            let checkX = node.x + x;
            let checkY = node.y + y;

            if (checkX >= 0 && checkX < mazeGrid.length && checkY >= 0 && checkY < mazeGrid[0].length) {
                neighbours.push(mazeGrid[checkX][checkY]);
            }
        }
    }
    return neighbours;
}

// - Grid snapping -

// Generate 80 x 45 grid
function create80x45() {

    let array = new Array();

    for (let x = 0; x < 80; x++) {

        array.push(new Array());

        for (let y = 0; y < 45; y++) {

            array[x].push(new Object({
                x: x,
                y: y,
                type: 'white',
                active: false
            }));

        }

    }

    return array;

}

// - Fireworks -

// Create a firework

function createFirework(canvas) {
    let firework = {
        x: canvas.width / 2,
        y: canvas.height + 10,
        motionX: (Math.random()*4)-2,
        motionY: -13+(Math.random()*4)-2
    }
    return firework;
}