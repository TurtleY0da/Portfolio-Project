//#region -- Global Functions --

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

// - Add button -
function addDropdownButton(string) {
    let menuEl = docGetID("dropdownList");
    const listEL = document.createElement('li');
    let buttonEl = document.createElement('div');

    buttonEl.append(string);

    buttonEl.classList.add("dropdownButton");
    buttonEl.classList.add("smallDropdown");
    buttonEl.setAttribute("unselectable", 'on');
    buttonEl.setAttribute("onselectstart", 'return false;');
    buttonEl.setAttribute("onmousedown", 'return false;');

    listEL.append(buttonEl);

    menuEl.append(listEL);

    return buttonEl;
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

// - Insertion Sort -
function insertionSort(array) {
    let result = [...array];

    for (let a = 1; a < result.length; a++) {

        let key = result[a];

        let b = a - 1;

        while (b >= 0 && key < result[b]) {
            result[b + 1] = result[b];
            b--;
        }
        result[b + 1] = key;
    }
    return result;
}

// - Merge Two Arrays -
function mergeArrays(leftArray, rightArray) {
    let result = new Array();

    while (leftArray.length && rightArray.length) {

        if (leftArray[0] < rightArray[0]) {
            result.push(leftArray.shift());
        } else {
            result.push(rightArray.shift());
        }
    }

    return [...result, ...leftArray, ...rightArray];
}

// - Merge Sort -
function mergeSort(array) {

    if (array.length < 2) return array;

    let split = Math.floor(array.length / 2);

    const leftArray = array.splice(0, split);

    return mergeArrays(mergeSort(leftArray), mergeSort(array));
}

// - Swap Array Items In Place -
function swapItems(array, indexA, indexB) {
    let temp = array[indexA];
    array[indexA] = array[indexB];
    array[indexB] = temp;
}

// - Quick Sort Partition Sort -
function quickSortPartition(array, left, right) {
    let pivot = array[Math.floor((left + right) / 2)];
    let leftCursor = left;
    let rightCursor = right;

    while (leftCursor <= rightCursor) {

        while (array[leftCursor] < pivot) {
            leftCursor++;
        }
        while (array[rightCursor] > pivot) {
            rightCursor--;
        }

        if (leftCursor <= rightCursor) {
            swapItems(array, leftCursor, rightCursor);
            leftCursor++;
            rightCursor--;
        }

    }
    return leftCursor;
}

// - Quick Sort -
function quickSort(array, left, right) {

    if (array.length < 2) return array;

    let index = quickSortPartition(array, left, right);

    if (left < index - 1) {
        quickSort(array, left, index - 1);
    }

    if (right > index) {
        quickSort(array, index, right);
    }

    return array;
}

//#endregion

//#region -- Local Functions --

//#region - Gravity Sim -

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
//#endregion

//#region - Maze Generator -

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
//#endregion

//#region - Grid snapping -

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
//#endregion

//#region - Fireworks -

// Firework class

class firework {
    x;
    y;
    motionX;
    motionY;
    heat;
    baseColor;
    color;

    constructor(canvas, color) {

        this.x = canvas.width / 2 + (Math.random() * 800 - 400);
        this.y = canvas.height + 10;
        this.motionX = (Math.random() * 4) - 2;
        this.motionY = -20 + (Math.random() * 6) - 3;
        this.heat = 230 + (Math.random() * 50) - 25;
        this.baseColor = color;
        this.color = 'rgb(255,255,255)';

    }
    update(deltaTime, drag) {
        this.motionY += 0.98 * deltaTime / 30;
        this.heat = this.heat / 1.05;

        let helperArray = this.baseColor.slice(4, -1).split(',');
        this.color = `rgb(${Math.min(255, +helperArray[0]+this.heat)},${Math.min(255, +helperArray[1]+this.heat)},${Math.min(255, +helperArray[2]+this.heat)})`;

        // Add drag
        this.motionX = this.motionX * Math.exp(-drag * deltaTime);
        this.motionY = this.motionY * Math.exp(-drag * deltaTime);

        this.y += Math.round(this.motionY * (deltaTime * 0.1) * 100) / 100;
        this.x += Math.round(this.motionX * (deltaTime * 0.1) * 100) / 100;
    }
}

// Firework trail class

class trail {
    x;
    y;
    motionX;
    motionY;
    color;
    size;

    constructor(firework) {

        this.x = firework.x;
        this.y = firework.y;
        this.motionX = -firework.motionX * 0.5;
        this.motionY = -firework.motionY * 0.5;
        this.color = firework.color;
        this.size = Math.max(0.01, firework.heat / 15 * 2);

    }
    update(deltaTime) {
        this.motionY += 0.98 * deltaTime / 600;
        this.size -= deltaTime / 50

        this.y += Math.round(this.motionY * 100) / 100;
        this.x += Math.round(this.motionX * 100) / 100;
    }
}

// Firework explosion class

class explosion {
    x;
    y;
    motionX;
    motionY;
    color;
    size;
    decayTime;

    constructor(firework, direction, magnitude, decayTime) {

        if (JSON.stringify(Math.sin(direction * (Math.PI / 180))).slice(-4) === 'e-16') {
            this.motionX = -magnitude;
            this.motionY = 0;
        } else if (['e-16', 'e-17'].includes(JSON.stringify(Math.cos(direction * (Math.PI / 180))).slice(-4))) {
            if (direction < 0) {
                this.motionX = 0;
                this.motionY = -magnitude;
            } else {
                this.motionX = 0;
                this.motionY = magnitude;
            }
        } else {
            this.motionX = magnitude * Math.cos(direction * (Math.PI / 180));
            this.motionY = magnitude * Math.sin(direction * (Math.PI / 180));
        }

        this.x = firework.x;
        this.y = firework.y;
        this.color = firework.color;
        this.size = 4;

        this.decayTime = decayTime;
    }

    update(deltaTime, drag) {
        // this.motionY += 0.98 * deltaTime / 30;
        this.size -= deltaTime / this.decayTime

        // Add drag
        this.motionX = this.motionX * Math.exp(-drag * deltaTime);
        this.motionY = this.motionY * Math.exp(-drag * deltaTime);

        this.y += Math.round(this.motionY * (deltaTime * 0.1) * 100) / 100;
        this.x += Math.round(this.motionX * (deltaTime * 0.1) * 100) / 100;
    }
}

// Create an explosion

async function createExplosion(fireworkExplosionArray, firework, explosionStyle) {
    switch (explosionStyle) {
        case 0:
            for (let n = -90; n < 90; n++) {
                fireworkExplosionArray.push(new explosion(firework, n * 2 + (Math.random() * 2 - 1), 6 + (Math.random() * 6 - 5.9), 80));
            }
            await timer(30);
            for (let n = -45; n < 45; n++) {
                fireworkExplosionArray.push(new explosion(firework, n * 4 + (Math.random() * 2 - 1), 4 + (Math.random() * 4 - 3.9), 80));
            }
            break;
        case 1:
            for (let n = -120; n < -60; n++) {
                fireworkExplosionArray.push(new explosion(firework, n + (Math.random() * 2 - 1), 6 + (Math.random() * 6 - 5.9), 80));
            }
            await timer(30);
            for (let n = -105; n < -85; n++) {
                fireworkExplosionArray.push(new explosion(firework, n + (Math.random() * 2 - 1), 4 + (Math.random() * 4 - 3.9), 80));
            }
            break;
        case 2:
            for (let n = -45; n < 45; n++) {
                fireworkExplosionArray.push(new explosion(firework, n * 4 + (Math.random() * 2 - 1), 6 + (Math.random() * 6 - 5.9), 80));
            }
            await timer(30);
            for (let n = -45; n < 45; n++) {
                fireworkExplosionArray.push(new explosion(firework, n * 4 + (Math.random() * 2 - 1), 4 + (Math.random() * 4 - 3.9), 80));
            }
            firework.color = 'rgb(230,230,230)'
            for (let n = -45; n < 45; n++) {
                fireworkExplosionArray.push(new explosion(firework, n * 4 + (Math.random() * 2 - 1), 8 + (Math.random() * 1 - 0.9), 80));
            }
            break;
        case 3:
            for (let n = -15; n < 15; n++) {
                fireworkExplosionArray.push(new explosion(firework, n * 6 + 180 + (Math.random() * 2 - 1), 6 + (Math.random() * 2 - 1.9), 80));
                fireworkExplosionArray.push(new explosion(firework, n * -6 + (Math.random() * 2 - 1), 6 + (Math.random() * 2 - 1.9), 80));
                fireworkExplosionArray.push(new explosion(firework, n * 6 + 183 + (Math.random() * 2 - 1), 6 + (Math.random() * 2 - 1.9), 80));
                fireworkExplosionArray.push(new explosion(firework, n * -6 + 3 + (Math.random() * 2 - 1), 6 + (Math.random() * 2 - 1.9), 80));
                await timer(0.2);
            }
    }
}
//#endregion

//#region - Minesweeper -

// Menu superclass
class menu {
    name;
    hover = false;
    active = false;
    transform = {
        posX: 0,
        posY: 0,
        width: 0,
        height: 0
    };
    decorations = {
        hoverOverlay: 0
    };

    constructor(name, posX, posY, width, height) {
        if (name) this.name = name;
        if (posX) this.transform.posX = posX;
        if (posY) this.transform.posY = posY;
        if (width) this.transform.width = width;
        if (height) this.transform.height = height;
    }

    modifyTransform(posX, posY, width, height) {
        if (posX) this.transform.posX = posX;
        if (posY) this.transform.posY = posY;
        if (width) this.transform.width = width;
        if (height) this.transform.height = height;
    }

    checkMouse(mouseObject, event, canvasBoundingBox) {
        mouseObject.x = event.clientX - canvasBoundingBox.left;
        mouseObject.y = event.clientY - canvasBoundingBox.top;

        if (mouseObject.x > this.transform.posX && mouseObject.y > this.transform.posY && mouseObject.x < this.transform.posX + this.transform.width && mouseObject.y < this.transform.posY + this.transform.height) {
            this.hover = true;
        } else {
            this.hover = false;
        }
    }

    draw(ctx, color) {
        ctx.fillStyle = color;
        ctx.fillRect(this.transform.posX, this.transform.posY, this.transform.width, this.transform.height);

        ctx.fillStyle = 'white';
        ctx.font = `${((this.transform.height - this.transform.height/6)/2.2)}px openSans`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.name, this.transform.posX + this.transform.width / 2, this.transform.posY + this.transform.height / 2);

        ctx.save();
        ctx.fillStyle = 'black';
        ctx.globalAlpha = `${this.decorations.hoverOverlay}`;
        ctx.fillRect(this.transform.posX, this.transform.posY, this.transform.width, this.transform.height);
        ctx.restore();

    }

    updateVariables(deltaTime) {
        if (this.hover && this.decorations.hoverOverlay < 0.3) {
            this.decorations.hoverOverlay += 0.004 * deltaTime;
        } else if (!this.hover && this.decorations.hoverOverlay > 0) {
            this.decorations.hoverOverlay -= 0.004 * deltaTime;
        }
        if (this.decorations.hoverOverlay < 0) {
            this.decorations.hoverOverlay = 0;
        }
        if (this.decorations.hoverOverlay > 0.3) {
            this.decorations.hoverOverlay = 0.3;
        }
    }
}

class parentMenu extends menu {
    children = new Array();
    trueWidth;

    constructor(name, posX, posY, width, height, startingY, childNames, childCallbacks, childParameters) {
        super(name, posX, posY, width, height);
        this.trueWidth = width;

        if (Array.isArray(childNames) && Array.isArray(childCallbacks) && Array.isArray(childParameters)) {
            if (childNames.length === childCallbacks.length && childNames.length === childParameters.length) {
                for (let n = 0; n < childNames.length; n++) {
                    this.children.push(new childMenu(childNames[n], this.transform.posX + this.transform.width / 2 + 10, startingY + this.transform.height * n, this.transform.width / 2 - 10, this.transform.height, childCallbacks[n], childParameters[n]));
                }
            }
        }
    }

    checkMouse(mouseObject, event, canvasBoundingBox) {
        super.checkMouse(mouseObject, event, canvasBoundingBox);

        if (this.active) {
            this.children.forEach(child => {
                child.checkMouse(mouseObject, event, canvasBoundingBox);
            });
        }

    }

    draw(ctx, color, menuArray) {
        this.transform.width = this.trueWidth;
        if (Array.isArray(menuArray)) {
            menuArray.forEach(element => {
                if (element.active) this.transform.width = this.trueWidth / 2;
            });
        }

        super.draw(ctx, color);

        if (this.active) {
            this.children.forEach(child => {
                child.draw(ctx, color);
            });
        }

    }

    updateVariables(deltaTime) {
        super.updateVariables(deltaTime);

        if (this.active) {
            this.children.forEach(child => {
                child.updateVariables(deltaTime);
            });
        }

    }
}

class childMenu extends menu {
    callback;
    callbackParams;

    constructor(name, posX, posY, width, height, callback, parameters) {
        super(name, posX, posY, width, height);

        this.callback = callback;
        this.callbackParams = parameters;
    }
    click() {
        this.callback(this.callbackParams);
        this.hover = false;
    }
}

// Grid of tiles
class mineGrid {
    uncoveredCells = 0;
    size;
    grid = new Array();
    clickedSquare;
    gameState = 0;

    constructor(size) {
        this.size = size;

        for (let x = 0; x < this.size; x++) {
            this.grid.push(new Array());
            for (let y = 0; y < this.size; y++) {
                this.grid[x].push(new mineCell(x, y));
            }
        }
    }
    populateMines(canvasBoundingBox, mouseObject, event, minesNum) {
        mouseObject.x = event.clientX - canvasBoundingBox.left;
        mouseObject.y = event.clientY - canvasBoundingBox.top;

        if (mouseObject.x > 254.1 && mouseObject.x < 785.9 && mouseObject.y > 26.6 && mouseObject.y < 558.4) {

            this.gameState = 1;

            mouseObject.squareX = (mouseObject.x - 254.1) / 531.8;
            mouseObject.squareY = (mouseObject.y - 26.6) / 531.8;

            this.clickedSquare = {
                x: Math.floor(mouseObject.squareX * this.size),
                y: Math.floor(mouseObject.squareY * this.size)
            };

            for (let n = 0; n < minesNum; n++) {
                let canPlace = true;

                let coords = {
                    x: Math.round(Math.random() * (this.size - 1)),
                    y: Math.round(Math.random() * (this.size - 1))
                }

                for (let a = -1; a <= 1; a++) {
                    for (let b = -1; b <= 1; b++) {
                        if (coords.x === this.clickedSquare.x + a && coords.y === this.clickedSquare.y + b) canPlace = false;
                    }
                }

                if (this.grid[coords.x][coords.y].mine === false && canPlace) {

                    this.grid[coords.x][coords.y].mine = true;

                } else {
                    n--;
                }
            }
        }



    }

}

// A single tile
class mineCell {
    x;
    y;
    mine = false;
    state = -1;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    checkCell(mineGrid) {
        mineGrid.uncoveredCells++;
        this.state = 0;

        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                if (y === 0 && x === 0 || this.x + x < 0 || this.x + x >= mineGrid.size || this.y + y < 0 || this.y + y >= mineGrid.size) continue;

                if (mineGrid.grid[this.x + x][this.y + y].mine) this.state++;
            }
        }

        if (this.state === 0) {
            for (let x = -1; x <= 1; x++) {
                for (let y = -1; y <= 1; y++) {
                    if (y === 0 && x === 0 || this.x + x < 0 || this.x + x >= mineGrid.size || this.y + y < 0 || this.y + y >= mineGrid.size) continue;

                    if (mineGrid.grid[this.x + x][this.y + y].state === -1) mineGrid.grid[this.x + x][this.y + y].checkCell(mineGrid);
                }
            }
        }
    }
    swapFlag() {
        if (this.state === -1) {
            this.state = -2;
        } else if (this.state === -2) {
            this.state = -1;
        }
    }
}

// Check a click on a tile
function checkMineClick(canvasBoundingBox, mouseObject, mineGrid, event) {
    mouseObject.x = event.clientX - canvasBoundingBox.left;
    mouseObject.y = event.clientY - canvasBoundingBox.top;

    if (mouseObject.x > 254.1 && mouseObject.x < 785.9 && mouseObject.y > 26.6 && mouseObject.y < 558.4) {

        mouseObject.squareX = (mouseObject.x - 254.1) / 531.8;
        mouseObject.squareY = (mouseObject.y - 26.6) / 531.8;

        let clickedSquare = mineGrid.grid[Math.floor(mouseObject.squareX * mineGrid.size)][Math.floor(mouseObject.squareY * mineGrid.size)];

        if (clickedSquare.state !== -1) return;
        if (clickedSquare.mine) {
            mineGrid.gameState = 2;
            return;
        }

        mineGrid.grid[clickedSquare.x][clickedSquare.y].checkCell(mineGrid);
    }
}

// Place a flag
function placeFlag(canvasBoundingBox, mouseObject, mineGrid, event) {
    mouseObject.x = event.clientX - canvasBoundingBox.left;
    mouseObject.y = event.clientY - canvasBoundingBox.top;

    if (mouseObject.x > 254.1 && mouseObject.x < 785.9 && mouseObject.y > 26.6 && mouseObject.y < 558.4) {

        mouseObject.squareX = (mouseObject.x - 254.1) / 531.8;
        mouseObject.squareY = (mouseObject.y - 26.6) / 531.8;

        let clickedSquare = mineGrid.grid[Math.floor(mouseObject.squareX * mineGrid.size)][Math.floor(mouseObject.squareY * mineGrid.size)];

        if (clickedSquare.state > -1) return;

        mineGrid.grid[clickedSquare.x][clickedSquare.y].swapFlag();

    }
}

// Check for victory
function checkMineVictoryConditions(gameSetup, mineGrid) {
    if (gameSetup.size ** 2 - gameSetup.mines <= mineGrid.uncoveredCells) {
        mineGrid.gameState = 3;
    }
}

//#endregion

//#region - To Do List -

// Create a new item
function createToDoItem(description, date) {
    results = new Array();
    results.push(description, date)
    return results;
}

function refreshArray(itemsArray) {
    let storageKeys = new Array();

    let repeat = (localStorage.length > itemsArray.length) ? localStorage.length : itemsArray.length

    for (let n = 0; n < repeat; n++) {

        storageKeys.push(localStorage.key(n));

        if (localStorage[`${storageKeys[n]}`] === undefined) {
            itemsArray.splice(n, 1);
            continue;
        }

        if (typeof itemsArray[n] === 'object') {

            if (itemsArray[n].name !== storageKeys[n] || itemsArray[n].desc !== JSON.parse(localStorage[`${storageKeys[n]}`])[0] || itemsArray[n].date !== JSON.parse(localStorage[`${storageKeys[n]}`])[1]) {

                itemsArray[n] = (new Object({
                    name: storageKeys[n],
                    desc: JSON.parse(localStorage[`${storageKeys[n]}`])[0],
                    date: JSON.parse(localStorage[`${storageKeys[n]}`])[1],
                    priority: parseInt(JSON.parse(localStorage[`${storageKeys[n]}`])[2])
                }));

            }

        } else {

            itemsArray[n] = (new Object({
                name: storageKeys[n],
                desc: JSON.parse(localStorage[`${storageKeys[n]}`])[0],
                date: JSON.parse(localStorage[`${storageKeys[n]}`])[1],
                priority: parseInt(JSON.parse(localStorage[`${storageKeys[n]}`])[2])
            }));
        }

    }
}

function orderArray(itemsArrayOrdered, sortList) {
    let tempArray = JSON.parse(JSON.stringify(itemsArrayOrdered));

    if (sortList.value === 'date') {
        tempArray.sort(function comparefn(a, b) {
            new Date(a.date) - new Date(b.date)
        });
    }
    if (sortList.value === 'importance') {
        tempArray.sort(function comparefn(a, b) {
            a.priority - b.priority
        });
    }

    return tempArray;
}

function sort(a, b) {
    return new Date(a.date) - new Date(b.date);
}

function createElements(sorter, orderedItemsArray, outputEl) {
    switch (sorter) {
        case 'date':
            let currentDate = new Date();

            let dateHeaders = [
                [
                    'Late',
                    `${currentDate.getFullYear()}-${currentDate.getMonth()+1}-${currentDate.getDate()}`
                ],
                [
                    'Today',
                    `${currentDate.getFullYear()}-${currentDate.getMonth()+1}-${currentDate.getDate()+1}`
                ],
                [
                    'Tomorrow',
                    `${currentDate.getFullYear()}-${currentDate.getMonth()+1}-${currentDate.getDate()+2}`
                ],
                [
                    'This Week',
                    `${currentDate.getFullYear()}-${currentDate.getMonth()+1}-${currentDate.getDate()+7}`
                ],
                [
                    'Later'
                ]
            ]

            dateHeaders.forEach(text => {

                const parentEl = document.createElement('div');
                let divEl = document.createElement('div');
                let headerEl = document.createElement('h2');

                headerEl.innerText = text[0];

                divEl.classList.add("toDoHeaderElement");
                divEl.setAttribute("unselectable", 'on');
                divEl.setAttribute("onselectstart", 'return false;');
                divEl.setAttribute("onmousedown", 'return false;');

                divEl.append(headerEl);

                parentEl.append(divEl);

                outputEl.append(parentEl);
            });

            for (let x = 0; x < orderedItemsArray.length; x++) {

                let parentDivEl = document.createElement('div');

                parentDivEl.classList.add('toDoListElement');

                if (orderedItemsArray[x].priority === 1) {
                    parentDivEl.classList.add('priority1');

                } else if (orderedItemsArray[x].priority === 2) {
                    parentDivEl.classList.add('priority2');

                } else {
                    parentDivEl.classList.add('priority3');

                }

                let titleSpanEl = document.createElement('span');

                titleSpanEl.innerText = orderedItemsArray[x].name;
                titleSpanEl.classList.add('titleText');

                let descSpanEl = document.createElement('span');

                descSpanEl.innerText = orderedItemsArray[x].desc;
                descSpanEl.classList.add('descriptionText');

                let dateSpanEl = document.createElement('span');

                dateSpanEl.innerText = orderedItemsArray[x].date;
                dateSpanEl.classList.add('titleText');

                let rmvBtnEl = document.createElement('div');

                rmvBtnEl.innerText = '-';
                rmvBtnEl.classList.add('toDoRemoveBtn');
                rmvBtnEl.setAttribute('unselectable', 'on');
                rmvBtnEl.setAttribute('onselectstart', 'return false;');
                rmvBtnEl.setAttribute('onmousedown', 'return false;');

                parentDivEl.append(titleSpanEl, descSpanEl, dateSpanEl, rmvBtnEl);

                forElse01: {
                    for (let y = 0; y < dateHeaders.length - 1; y++) {
                        if (new Date(orderedItemsArray[x].date) < new Date(dateHeaders[y][1])) {
                            outputEl.children[y].append(parentDivEl);
                            break forElse01;
                        }
                    }
                    outputEl.children[dateHeaders.length - 1].append(parentDivEl);
                }
            }


            break;
        case 'importance':
            let priorityHeaders = [
                [
                    'High Priority',
                    1
                ],
                [
                    'Standard Priority',
                    2
                ],
                [
                    'Low Priority'
                ]
            ]

            priorityHeaders.forEach(text => {

                const parentEl = document.createElement('div');
                let divEl = document.createElement('div');
                let headerEl = document.createElement('h2');

                headerEl.innerText = text[0];

                divEl.classList.add("toDoHeaderElement");
                divEl.setAttribute("unselectable", 'on');
                divEl.setAttribute("onselectstart", 'return false;');
                divEl.setAttribute("onmousedown", 'return false;');

                divEl.append(headerEl);

                parentEl.append(divEl);

                outputEl.append(parentEl);
            });

            for (let x = 0; x < orderedItemsArray.length; x++) {

                let parentDivEl = document.createElement('div');

                parentDivEl.classList.add('toDoListElement');

                if (orderedItemsArray[x].priority === 1) {
                    parentDivEl.classList.add('priority1');

                } else if (orderedItemsArray[x].priority === 2) {
                    parentDivEl.classList.add('priority2');

                } else {
                    parentDivEl.classList.add('priority3');

                }

                let titleSpanEl = document.createElement('span');

                titleSpanEl.innerText = orderedItemsArray[x].name;
                titleSpanEl.classList.add('titleText');

                let descSpanEl = document.createElement('span');

                descSpanEl.innerText = orderedItemsArray[x].desc;
                descSpanEl.classList.add('descriptionText');

                let dateSpanEl = document.createElement('span');

                dateSpanEl.innerText = orderedItemsArray[x].date;
                dateSpanEl.classList.add('titleText');

                let rmvBtnEl = document.createElement('div');

                rmvBtnEl.innerText = '-';
                rmvBtnEl.classList.add('toDoRemoveBtn');
                rmvBtnEl.setAttribute('unselectable', 'on');
                rmvBtnEl.setAttribute('onselectstart', 'return false;');
                rmvBtnEl.setAttribute('onmousedown', 'return false;');

                parentDivEl.append(titleSpanEl, descSpanEl, dateSpanEl, rmvBtnEl);

                switch (orderedItemsArray[x].priority) {
                    case 1:
                        outputEl.children[0].append(parentDivEl);
                        break;
                    case 2:
                        outputEl.children[1].append(parentDivEl);
                        break;
                    case 3:
                        outputEl.children[2].append(parentDivEl);
                        break;
                }
            }
            break;
    }
}

//#endregion

//#region - Sorting Algorithms -

// - Chart Class -
class sortingChart {
    height;
    chartsArray;
    randomArray = new Array();

    constructor(itemNum, chartTypes, callback) {
        this.createChart(itemNum, chartTypes, callback);
    }

    async createChart(itemNum, chartTypes, callback) {
        this.height = 565 / chartTypes.length - (10 * (chartTypes.length - 1));

        this.chartsArray = chartTypes;

        this.randomArray.length = itemNum;
        // Create Ordered Items
        for (let n = 0; n < this.randomArray.length; n++) {
            await timer(5);
            this.randomArray[n] = n;

            this.chartsArray.forEach(item => {
                item.array = this.randomArray;
                item.activeItem = n;
            });
        }

        // Randomize Positions
        for (let i = 0; i < this.randomArray.length; i++) {
            await timer(15);
            swapItems(this.randomArray, i, Math.floor(Math.random() * (this.randomArray.length - 1)));

            this.chartsArray.forEach(item => {
                item.array = this.randomArray;
                item.activeItem = i;
            });
        }

        this.chartsArray.forEach(item => {
            let tempArray = new Array();
            item.array.forEach(element => {
                tempArray.push(element);
            });
            item.array = tempArray;
        });

        if (typeof callback === 'function') callback();
    }

    async asyncInsertionSort(index) {

        for (let a = 1; a < this.chartsArray[index].array.length; a++) {

            let key = this.chartsArray[index].array[a];

            let b = a - 1;

            while (b >= 0 && key < this.chartsArray[index].array[b]) {
                this.chartsArray[index].array[b + 1] = this.chartsArray[index].array[b];
                this.chartsArray[index].activeItem = b;
                await timer(1);
                b--;
            }
            this.chartsArray[index].array[b + 1] = key;
        }

        for (let n = 0; n < this.chartsArray[index].array.length; n++) {
            await timer(10);
            this.chartsArray[index].activeItem = n;
        }
    }

    async mergeArrays(leftArray, rightArray, actItemIndex) {
        let result = new Array();

        while (leftArray.length && rightArray.length) {
            await timer(1);

            if (leftArray[0] < rightArray[0]) {
                result.push(leftArray.shift());
            } else {
                result.push(rightArray.shift());
            }
            this.chartsArray[actItemIndex].activeItem = result.length-1;
            this.chartsArray[actItemIndex].secondaryItems[0] = result.length;
            this.chartsArray[actItemIndex].secondaryItems[1] = result.length+leftArray.length;

            this.chartsArray[actItemIndex].array = [...result, ...leftArray, ...rightArray];
        }

        return [...result, ...leftArray, ...rightArray];
    }

    async asyncMergeSort(index) {
        let array = new Array();
        this.chartsArray[index].array.forEach(element => {
            array.push(element);
        });

        await this.mergeSort(array, index);

        this.chartsArray[index].secondaryItems = [];

        for (let n = 0; n < this.chartsArray[index].array.length; n++) {
            await timer(1);
            this.chartsArray[index].activeItem = n;
        }
    }

    async mergeSort(array, actItemIndex) {
        if (array.length < 2) return array;

        let split = Math.floor(array.length / 2);

        const leftArray = array.splice(0, split);

        await timer(1);

        let result = await this.mergeArrays(await this.mergeSort(leftArray, actItemIndex), await this.mergeSort(array, actItemIndex), actItemIndex);

        return result;
    }

    async asyncQuickSort(index) {
        let array = new Array();
        this.chartsArray[index].array.forEach(element => {
            array.push(element);
        });

        await this.quickSort(array, 0, array.length - 1, index);

        this.chartsArray[index].secondaryItems = [];

        for (let n = 0; n < this.chartsArray[index].array.length; n++) {
            await timer(1);
            this.chartsArray[index].activeItem = n;
        }
    }

    async quickSort(array, left, right, actItemIndex) {

        if (array.length < 2) return array;

        let index = await this.quickSortPartition(array, left, right, actItemIndex);

        if (left < index - 1) {
            await this.quickSort(array, left, index - 1, actItemIndex);
        }

        if (right > index) {
            await this.quickSort(array, index, right, actItemIndex);
        }

        this.chartsArray[actItemIndex].array = array;

        return array;
    }

    async quickSortPartition(array, left, right, actItemIndex) {
        this.chartsArray[actItemIndex].activeItem = array[Math.floor((left + right) / 2)]
        let pivot = array[Math.floor((left + right) / 2)];
        let leftCursor = left;
        let rightCursor = right;

        while (leftCursor <= rightCursor) {

            while (array[leftCursor] < pivot) {
                await timer(0.1);
                this.chartsArray[actItemIndex].secondaryItems[0] = leftCursor;
                leftCursor++;
            }
            while (array[rightCursor] > pivot) {
                await timer(0.1);
                this.chartsArray[actItemIndex].secondaryItems[1] = rightCursor;
                rightCursor--;
            }

            if (leftCursor <= rightCursor) {
                swapItems(array, leftCursor, rightCursor);
                this.chartsArray[actItemIndex].array = array;
                leftCursor++;
                rightCursor--;
            }

        }
        return leftCursor;
    }

    draw(canvas2dContext) {
        for (let i = 0; i < this.chartsArray.length; i++) {
            for (let n = 0; n < this.randomArray.length; n++) {

                canvas2dContext.beginPath();
                canvas2dContext.moveTo((1000 / this.randomArray.length) * n + (20 + (1000 / sorterChart.randomArray.length) / 2), 575 - this.height * i - (10 * (this.chartsArray.length - 1) * i));

                canvas2dContext.strokeStyle = 'black';
                if (Array.isArray(this.chartsArray[i].secondaryItems)) {
                    this.chartsArray[i].secondaryItems.forEach(element => {
                        if (element === n) canvas2dContext.strokeStyle = 'blue';
                    });
                }
                if (this.chartsArray[i].activeItem === n) canvas2dContext.strokeStyle = 'red';

                canvas2dContext.lineTo((1000 / this.randomArray.length) * n + (20 + (1000 / sorterChart.randomArray.length) / 2), (575 - ((this.chartsArray[i].array[n] / this.randomArray.length) * this.height)) - this.height * i - (10 * (this.chartsArray.length - 1) * i));
                canvas2dContext.stroke();
            }
        }
    }

}

//#endregion

//#endregion

//#region -- Debugging & Benchmarking --

// - Test a sorter -
function testSorter(callback, arraySize) {
    let additionalParams = new Array();
    for (let n = 2; n < arguments.length; n++) {
        additionalParams.push(arguments[n]);
    }

    let inputArray = new Array();
    for (let n = 0; n < arraySize; n++) {
        inputArray.push(Math.round(Math.random() * (arraySize - 1)));
    }
    console.time('test')
    console.log(callback(inputArray, ...additionalParams));
    console.timeEnd('test');
}
//#endregion