// Tech Tree Script by Timothy V 

// -- Initialize Variables --

// HTML Elements
let cnv = docGetID("treeCanvas");

let dBoxEl = docGetID('dialogueBox');
let hBoxEl = docGetID('helpBox');
let sBoxEl = docGetID('saveBox');
// Register dialog boxes into dialog polyfill, permitting dialogs to be used with incompatible browsers (Firefox, Safari, etc.)
dialogPolyfill.registerDialog(dBoxEl);
dialogPolyfill.registerDialog(hBoxEl);
dialogPolyfill.registerDialog(sBoxEl);

let dialogBtnContainer = docGetID('divBtnContainerDBox');
let helpBtnContainer = docGetID('divBtnContainerHBox');
let saveBtnContainer = docGetID('divBtnContainerSBox');

// Glbl Variables
let screenSize = {
    width: screen.availWidth,
    height: screen.availHeight
}

// -- Canvas & Context setup
/** @type {CanvasRenderingContext2D} */
let ctx = cnv.getContext("2d");

cnv.width = screenSize.width / 1.5;
cnv.height = screenSize.height / 1.5;

let ctxCon = new contextController(cnv, ctx);

let clickHeld = -1;
let dragStart = {
    x: 0,
    y: 0,
    cX: 0,
    cY: 0
}
let dragOffset = {
    x: 0,
    y: 0
}
let mouse = {
    x: 0,
    y: 0
}

let editImg = new Image();
editImg.src = '../img/edit.png';
let downImg = new Image();
downImg.src = '../img/down.png';
let upImg = new Image();
upImg.src = '../img/up.png';

let cousine = new FontFace('cousine', 'url(../fonts/Cousine-Regular.ttf)');

let topTreeElements = new Array();

let scrolling = false;

let bounds = new boundingBox(36, -3, 40, 3);

let smallestEdge = Math.min(cnv.width, cnv.height);

let addButtonVertices = [
    new PVector(0, 0),
    new PVector(smallestEdge / 12, 0),
    new PVector(smallestEdge / 12, smallestEdge / 12 - smallestEdge / 12 / 6),
    new PVector(smallestEdge / 12 - smallestEdge / 12 / 6, smallestEdge / 12),
    new PVector(0, smallestEdge / 12)
];

let helpButtonVertices = [
    new PVector(smallestEdge / 12, smallestEdge / 12 - smallestEdge / 12 / 6),
    new PVector(smallestEdge / 12, smallestEdge / 12 - smallestEdge / 12 / 6 + smallestEdge / 12),
    new PVector(smallestEdge / 12 - smallestEdge / 12 / 6, smallestEdge / 12 + smallestEdge / 12),
    new PVector(0, smallestEdge / 12 + smallestEdge / 12),
    new PVector(0, smallestEdge / 12),
    new PVector(smallestEdge / 12 - smallestEdge / 12 / 6, smallestEdge / 12)
];

let saveButtonVertices = [
    new PVector(smallestEdge / 12, smallestEdge / 12 * 2 - smallestEdge / 12 / 6),
    new PVector(smallestEdge / 12, smallestEdge / 12 * 2 - smallestEdge / 12 / 6 + smallestEdge / 12),
    new PVector(smallestEdge / 12 - smallestEdge / 12 / 6, smallestEdge / 12 * 3),
    new PVector(0, smallestEdge / 12 * 3),
    new PVector(0, smallestEdge / 12 * 2),
    new PVector(smallestEdge / 12 - smallestEdge / 12 / 6, smallestEdge / 12 * 2)
];

let addButtonHover = false;
let helpButtonHover = false;
let saveButtonHover = false;

let dialogResolve;

// -- Main Loop --
requestAnimationFrame(loop);
// Adds custom typeface
document.fonts.add(cousine);

measureWidth('abc', 24)

function loop() {
    // - Update Variables -
    // If right click is held
    if (clickHeld === 2) {
        // Set the camera's center to the start point plus the offset divded by the zoom
        ctxCon.camera.centerX = dragStart.cX + dragOffset.x / ctxCon.camera.zoom
        ctxCon.camera.centerY = dragStart.cY + dragOffset.y / ctxCon.camera.zoom
    }
    // Set current y to zero minus the total height of all top level elements divded by two
    let currentY = 0 - topTreeElements.reduce((a, b) => a + b.totalHeight, 0) / 2;
    // For each top level element
    topTreeElements.forEach(child => {
        // Set element y position to the current y plus the element's total height divded by two minus the element's height divded by two
        child.position.y = (currentY + child.totalHeight / 2) - child.height / 2;
        // Add the element's total height to the current y
        currentY += child.totalHeight;
        // Trigger an update chain from the element
        child.updateChain();
    });
    // For each top level element
    topTreeElements.forEach(child => {
        // Check for hover on element
        child.checkHover(mouse);
    });
    // Calculate the tree's total height and width
    let totalHeight = topTreeElements.reduce((a, b) => a + b.totalHeight, 0);
    let totalWidth = topTreeElements.reduce((a, b) => Math.max(a, b.totalWidth), 0);
    // Set the bounds based on the tree size
    bounds.min.x = -64;
    bounds.max.x = Math.max(totalWidth - 36, 576);
    bounds.min.y = Math.min(0 - totalHeight / 2 - 48, -320)
    bounds.max.y = Math.max(totalHeight / 2 + 48, 320)
    // Update the camera's position
    ctxCon.updateCamera(bounds)
    // If the screen's available width and height don't match the current screen size values
    if (screen.availWidth !== screenSize.width || screen.availHeight !== screenSize.height) {
        // Set screen size values
        screenSize = {
            width: screen.availWidth,
            height: screen.availHeight
        }
        // Set canvas width and height accordingly
        cnv.width = Math.max(screenSize.width / 1.5);
        cnv.height = Math.max(screenSize.height / 1.5);
        // Calculate the smallest edge size
        smallestEdge = Math.min(cnv.width, cnv.height);
        // Create vertices of on canvas button
        addButtonVertices = [
            new PVector(0, 0),
            new PVector(smallestEdge / 12, 0),
            new PVector(smallestEdge / 12, smallestEdge / 12 - smallestEdge / 12 / 6),
            new PVector(smallestEdge / 12 - smallestEdge / 12 / 6, smallestEdge / 12),
            new PVector(0, smallestEdge / 12)
        ];

        helpButtonVertices = [
            new PVector(smallestEdge / 12, smallestEdge / 12 - smallestEdge / 12 / 6),
            new PVector(smallestEdge / 12, smallestEdge / 12 - smallestEdge / 12 / 6 + smallestEdge / 12),
            new PVector(smallestEdge / 12 - smallestEdge / 12 / 6, smallestEdge / 12 + smallestEdge / 12),
            new PVector(0, smallestEdge / 12 + smallestEdge / 12),
            new PVector(0, smallestEdge / 12),
            new PVector(smallestEdge / 12 - smallestEdge / 12 / 6, smallestEdge / 12)
        ];

        saveButtonVertices = [
            new PVector(smallestEdge / 12, smallestEdge / 12 * 2 - smallestEdge / 12 / 6),
            new PVector(smallestEdge / 12, smallestEdge / 12 * 2 - smallestEdge / 12 / 6 + smallestEdge / 12),
            new PVector(smallestEdge / 12 - smallestEdge / 12 / 6, smallestEdge / 12 * 3),
            new PVector(0, smallestEdge / 12 * 3),
            new PVector(0, smallestEdge / 12 * 2),
            new PVector(smallestEdge / 12 - smallestEdge / 12 / 6, smallestEdge / 12 * 2)
        ];

    }
    // Set the canvas width and height
    cnv.width = Math.max(screenSize.width / 1.5);
    cnv.height = Math.max(screenSize.height / 1.5);

    // - Draw -
    // Draw the background
    ctx.fillStyle = '#AADDAA';
    ctx.fillRect(0, 0, cnv.width, cnv.height);
    // Draw the bounding box
    ctx.fillStyle = '#CCEECC'
    ctx.fillRect(...ctxCon.gac('xywh', bounds.min.x, bounds.min.y, bounds.max.x - bounds.min.x, bounds.max.y - bounds.min.y))
    // Draw the tree
    drawTree();
    
    // Lines 196-225 Draw import/export button
    ctx.fillStyle = '#1BCC32';
    ctx.strokeStyle = '#EEEEEE';
    if (saveButtonHover) {
        ctx.fillStyle = '#EEEEEE';
        ctx.strokeStyle = '#1BCC32';
    }
    ctx.lineWidth = smallestEdge / 120;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round'

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(smallestEdge / 12, 0);
    ctx.lineTo(smallestEdge / 12, smallestEdge / 12 - smallestEdge / 12 / 6 + smallestEdge / 12 * 2);
    ctx.lineTo(smallestEdge / 12 - smallestEdge / 12 / 6, smallestEdge / 12 * 3);
    ctx.lineTo(0, smallestEdge / 12 * 3);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(smallestEdge / 12 / 5, smallestEdge / 12 * 2 + smallestEdge / 12 / 2);
    ctx.lineTo(smallestEdge / 12 / 5, smallestEdge / 12 * 2 + smallestEdge / 12 / 4 * 3);
    ctx.lineTo(smallestEdge / 12 - smallestEdge / 12 / 5, smallestEdge / 12 * 2 + smallestEdge / 12 / 4 * 3);
    ctx.lineTo(smallestEdge / 12 - smallestEdge / 12 / 5, smallestEdge / 12 * 2 + smallestEdge / 12 / 2);
    ctx.moveTo(smallestEdge / 12 / 2, smallestEdge / 12 * 2 + smallestEdge / 12 / 6);
    ctx.lineTo(smallestEdge / 12 / 2, smallestEdge / 12 * 2 + smallestEdge / 12 / 1.9);
    ctx.lineTo(smallestEdge / 12 / 2 + smallestEdge / 12 / 7, smallestEdge / 12 * 2 + smallestEdge / 12 / 1.9 - smallestEdge / 12 / 7);
    ctx.moveTo(smallestEdge / 12 / 2, smallestEdge / 12 * 2 + smallestEdge / 12 / 1.9);
    ctx.lineTo(smallestEdge / 12 / 2 - smallestEdge / 12 / 7, smallestEdge / 12 * 2 + smallestEdge / 12 / 1.9 - smallestEdge / 12 / 7);
    ctx.stroke();

    // Lines 228-251 Draw help button
    ctx.fillStyle = '#3A95EE';
    ctx.strokeStyle = '#EEEEEE';
    if (helpButtonHover) {
        ctx.fillStyle = '#EEEEEE';
        ctx.strokeStyle = '#3A95EE';
    }
    ctx.lineWidth = smallestEdge / 120;
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(smallestEdge / 12, 0);
    ctx.lineTo(smallestEdge / 12, smallestEdge / 12 - smallestEdge / 12 / 6 + smallestEdge / 12);
    ctx.lineTo(smallestEdge / 12 - smallestEdge / 12 / 6, smallestEdge / 12 + smallestEdge / 12);
    ctx.lineTo(0, smallestEdge / 12 + smallestEdge / 12);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.arc(smallestEdge / 24, smallestEdge / 12 + (smallestEdge / 24 - smallestEdge / 24 / 4), smallestEdge / 24 - smallestEdge / 24 / 1.4, Math.PI + 0.5, Math.PI / 2);
    ctx.lineTo(smallestEdge / 24, smallestEdge / 12 + smallestEdge / 24 + smallestEdge / 24 / 5);
    ctx.moveTo(smallestEdge / 24, smallestEdge / 12 + smallestEdge / 24 + smallestEdge / 24 / 1.8);
    ctx.lineTo(smallestEdge / 24, smallestEdge / 12 + smallestEdge / 24 + smallestEdge / 24 / 1.8);
    ctx.stroke();

    // Lines 254-277 Draw Add button
    ctx.fillStyle = '#FF2E63';
    ctx.strokeStyle = '#EEEEEE';
    if (addButtonHover) {
        ctx.fillStyle = '#EEEEEE';
        ctx.strokeStyle = '#FF2E63';
    }
    ctx.lineWidth = smallestEdge / 120;
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(smallestEdge / 12, 0);
    ctx.lineTo(smallestEdge / 12, smallestEdge / 12 - smallestEdge / 12 / 6);
    ctx.lineTo(smallestEdge / 12 - smallestEdge / 12 / 6, smallestEdge / 12);
    ctx.lineTo(0, smallestEdge / 12);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(smallestEdge / 12 / 2, smallestEdge / 12 / 4);
    ctx.lineTo(smallestEdge / 12 / 2, smallestEdge / 12 - smallestEdge / 12 / 4);
    ctx.moveTo(smallestEdge / 12 / 4, smallestEdge / 12 / 2);
    ctx.lineTo(smallestEdge / 12 - smallestEdge / 12 / 4, smallestEdge / 12 / 2);
    ctx.stroke();

    // - End -
    requestAnimationFrame(loop);
}

// -- Add Event Listeners
// Prevent context menu from opening when canvas right clicked
cnv.oncontextmenu = function (e) {
    e.preventDefault();
}
// Dialog box closing
dialogBtnContainer.children[0].children[0].addEventListener('click', function () {
    closeModal(dBoxEl, true)
});
helpBtnContainer.children[0].children[0].addEventListener('click', function () {
    closeModal(hBoxEl, false)
});
saveBtnContainer.children[0].children[0].addEventListener('click', function () {
    closeModal(sBoxEl, false)
});
dialogBtnContainer.children[0].children[0].addEventListener('mousedown', function () {
    dialogResolve(0);
});
document.addEventListener('keydown', function (event) {
    if(event.repeat === false && event.key === 'Escape'){
        dBoxEl.classList.remove('opening');
        dBoxEl.classList.add('closing');
        let tempFunc = function () {
            modalClosed(dBoxEl, tempFunc, true)
        };
        tempFunc();
        dialogResolve(0);
    }
    
});
dialogBtnContainer.children[1].children[0].addEventListener('mousedown', function () {
    dialogResolve(-1);
});
sBoxEl.children[5].children[0].addEventListener('mousedown', function () {
    dialogResolve(1);
});
saveBtnContainer.children[0].children[0].addEventListener('mousedown', function () {
    dialogResolve(0);
});
sBoxEl.children[5].children[2].addEventListener('mousedown', function () {
    dialogResolve(-1);
});
// Scroll, click, and mouse move handlers
cnv.addEventListener('wheel', scrollHandler);
cnv.addEventListener('mousedown', clickHandler);
cnv.addEventListener('mouseup', clickHandler);
cnv.addEventListener('mouseleave', clickHandler);
cnv.addEventListener('mousemove', moveHandler);

// -- Functions --

// - Event Functions -
function closeModal(dialogBox, deleteItems) {
    // Adjust classes
    dialogBox.classList.remove('opening');
    dialogBox.classList.add('closing');
    // Create temporary function
    let tempFunc = function () {
        modalClosed(dialogBox, tempFunc, deleteItems)
    };
    // When the box's animation ends (it is closed) call modalClosed
    dialogBox.addEventListener('animationend', tempFunc)
}

function modalClosed(dialogBox, tempFunc, deleteItems) {
    // If the box is still closing, remove the class, and close the box
    if (dialogBox.classList[0] === 'closing') {
        dialogBox.close();
        dialogBox.classList.remove('closing');
    }
    // If deleteItems is true
    if (deleteItems) {
        let removalArray = new Array();
        // Insert references to each element into an array
        for (const child of dialogBox.children) {
            removalArray.push(child);
        }
        // For each element
        removalArray.forEach((element, index) => {
            // If they are not the first element, delete it
            if (index > 0) {
                element.remove();
            }
        });
    }
    // Remove the event listener
    dialogBox.removeEventListener('animationend', tempFunc)
}

function openModal(dialogBox) {
    // If box is closing
    if (dialogBox.classList[0] === 'closing') {
        // Fully close box
        dialogBox.close();
        modalClosed(dialogBox);
        dialogBox.classList.remove('closing');
    }
    // Add the opening class
    dialogBox.classList.add('opening');
    // Show the dialog box
    dialogBox.showModal();
}

function scrollHandler(event) {
    // If scrolling variable is false, and the current held click is not right click
    if (scrolling === false && clickHeld < 2) {
        // Set scrolling to true
        scrolling = true;
        // After 50 ms
        setTimeout(function () {
            // Set scrolling to false
            scrolling = false;
        }, 50)
        // Increase or decrease the zoom value
        ctxCon.camera.zoom += -Math.sign(event.deltaY) / 4
        // Constrain zoom
        if (ctxCon.camera.zoom < 0.25) ctxCon.camera.zoom = 0.25;
        if (ctxCon.camera.zoom > 2) ctxCon.camera.zoom = 2;
    }
}

async function clickHandler(event) {
    cnvRect = cnv.getBoundingClientRect();
    // Switch statement based on the type of the event
    switch (event.type) {
        case 'mousedown': // If mouse down
            // If the held click is not the button that was released and the held click is not -1, or the button is middle mouse, break
            if (clickHeld !== event.button && clickHeld !== -1 || event.button === 1) break;
            // Check for hover on canvas
            checkHover(event.clientX - cnvRect.left, event.clientY - cnvRect.top)
            // If currently hovering over the add button
            if (addButtonHover) {
                // If the button is not left click, break
                if (event.button !== 0) break;
                // Get the parameters of the new tree item
                let treeParams = await createTreeItem();
                // If no parameters were provided (canceled), break
                if (treeParams === undefined) break;
                // Otherwise, create a new top level item
                topTreeElements.push(new treeItem(null, ...treeParams));
            } else if (helpButtonHover) { // Otherwise, if currently hovering over the help button
                // If it is not left click, break
                if (event.button !== 0) break;
                // Open the dialog box
                openModal(hBoxEl);
            } else if (saveButtonHover) { // Otherwise, if currently hovering over the import/export button
                // If it is not left click, break
                if (event.button !== 0) break;
                // Open the dialog box
                openSaver();
            } else { // Otherwise
                // Set the currently held button
                clickHeld = event.button;
                // Call beginDrag
                beginDrag(event);
            }
            // break
            break;
        case 'mouseup': // If mouse up
            // If the held button is not this button, break
            if (clickHeld !== event.button) break;
        case 'mouseleave': // If mouse up, or the mouse leaves the canvas
            // If the held click is -1, break
            if (clickHeld === -1) break;
            // End drag
            endDrag();
            // Set held click to -1
            clickHeld = -1;
            // break
            break;
    }
}

function moveHandler(event) {
    cnvRect = cnv.getBoundingClientRect();
    // If clickHeld is not -1
    if (clickHeld > -1) {
        // I was planning on maybe putting more options here, but didn't, that's why I didn't just put all of this in the szme if statement
        switch (clickHeld) {
            case 2: // If right click
                // Get drag offset
                dragOffset.x = (dragStart.x - (event.clientX - cnvRect.left))
                dragOffset.y = (dragStart.y - (event.clientY - cnvRect.top))
                break;
        }
    } else { // Otherwise
        // Check current hover
        checkHover(event.clientX - cnvRect.left, event.clientY - cnvRect.top);
        // Set mouse x and y values
        mouse.x = event.clientX - cnvRect.left;
        mouse.y = event.clientY - cnvRect.top;
    }
}

async function beginDrag(event) {
    cnvRect = cnv.getBoundingClientRect();
    switch (event.button) {
        case 2: // If pressed button is right click
            // Set drag start positions
            dragStart.x = event.clientX - cnvRect.left;
            dragStart.y = event.clientY - cnvRect.top;
            dragStart.cX = ctxCon.camera.centerX;
            dragStart.cY = ctxCon.camera.centerY;
            // Reset drag offset
            dragOffset.x = 0;
            dragOffset.y = 0;
            break;
        case 0: // If pressed button is left click
            // Set mouse x and y
            mouse.x = event.clientX - cnvRect.left;
            mouse.y = event.clientY - cnvRect.top;
            // For each top level element
            for (const child of topTreeElements) {
                // Check hover
                child.checkHover(mouse);
                // Then check for click
                if (await child.checkClick(topTreeElements) === true) break;
            };
    }
}

function endDrag() {
    // If the held click is right click
    if (clickHeld === 2) {
        // Set the camera position
        ctxCon.camera.centerX = dragStart.cX + dragOffset.x / ctxCon.camera.zoom
        ctxCon.camera.centerY = dragStart.cY + dragOffset.y / ctxCon.camera.zoom
        // Reset the drag offset
        dragOffset.x = 0;
        dragOffset.y = 0;
    }
}

// - Functions -
function readFile(file, callback) {
    // Create new file reader
    const reader = new FileReader();
    // On file load
    reader.onload = function (event) {
        // Call the callback, passing the result
        callback(event.target.result);
    };
    // Read the file
    reader.readAsText(file);
}

function checkHover(mouseX, mouseY) {
    // Check for button hover using Polygon vs point collision
    if (polyPoint(addButtonVertices, mouseX, mouseY)) addButtonHover = true;
    else addButtonHover = false;

    if (polyPoint(helpButtonVertices, mouseX, mouseY)) helpButtonHover = true;
    else helpButtonHover = false;

    if (polyPoint(saveButtonVertices, mouseX, mouseY)) saveButtonHover = true;
    else saveButtonHover = false;
}


function measureWidth(text, size) {
    // Set canvas font size
    ctx.font = `${size}px cousine`;
    // Return the measured width of the provided text
    return ctx.measureText(text).width;
}
// This function isn't actually used in the project, but I used it to determine several values during developement
function measureHeight(text, size) {
    // Set canvas font size
    ctx.font = `${size}px cousine`;
    // Get the text metrics for the provided text
    let textMetric = ctx.measureText(text)
    // Return the ascent plus the descent
    return textMetric.actualBoundingBoxAscent + textMetric.actualBoundingBoxDescent;
}
// Converts a single line of text to multiple lines of text, if long enough
function getWrappedLines(textArray, size, preferedLineSize) {
    let lines = [""]
    // For each word followed by whitespace
    textArray.forEach(element => {
        // Measure the width of just the word (without the whitespace)
        let elementWidth = measureWidth(element.match(/\S+/g), size);
        // Add the word with whitespace to the array of lines
        lines.push(element);
        // If the width of the current line plus the width of the newly added segment is shorter than the prefered line length
        if (measureWidth(lines[lines.length - 2], size) + elementWidth < preferedLineSize) lines.mergeStrings(lines.length - 2, 2, ""); // Merge the current line and new segment together
    });
    // return the lines in an array
    return lines;
}

async function openSaver() {
    // Open the dialog box
    openModal(sBoxEl);
    // Button Detector function
    async function buttonDetector() {
        let eventResult;
        // Create a new promise
        let waitPromise = new Promise((resolve) => {
            // Set a global variable to the resolve function for this promise
            dialogResolve = resolve
        });
        // Wait until the promise is resolved (externally, by calling dialogResolve())
        await waitPromise.then((result) => {
            // Set eventResult to the result of the promise
            eventResult = result
        });
        // Return the event result
        return eventResult;
    }
    // Get result from button detector
    let result = await buttonDetector();
    // If result is 1, if a file was attached, read it
    if(result === 1){
        if(sBoxEl.children[2].value !== '' ) readFile(sBoxEl.children[2].files[0], constructTree);
    }
    // If result is -1
    if(result === -1){
        // Deconstruct the tree
        let deconstructedTree = deconstructTree(topTreeElements);
        // Compress the deconstructed tree
        let compressedTree = LZString.compressToUTF16(deconstructedTree);
        // Download the compressed tree as a file (Using FileSaver.js)
        let blob = new Blob([compressedTree], {type: "text/plain;charset=utf-16"});
        saveAs(blob, "techTree.dat");
    }
    // If there was a result, close the dialog box
    if(result) closeModal(sBoxEl);
}

async function createTreeItem() {
    // Hide Delete button
    dialogBtnContainer.children[1].classList.add('displayNone');
    // Create elements
    let titleTitle = document.createElement('h2');
    let titleInput = document.createElement('input');

    let descriptionTitle = document.createElement('h3');
    let descriptionInput = document.createElement('textarea');

    let costTitle = document.createElement('h3');
    let costInput = document.createElement('input');

    let lb = document.createElement('br');

    let submitButton = document.createElement('button');
    // Modify elements
    titleInput.type = 'text';
    descriptionInput.rows = '6';
    descriptionInput.cols = '35';
    costInput.type = 'number';
    costInput.value = 0;
    costInput.min = '0';
    costInput.max = '9999';
    costInput.onkeydown = function () {
        return false;
    };

    titleTitle.innerText = "Item Title";
    descriptionTitle.innerText = "Item Description";
    costTitle.innerText = "Item Cost";

    submitButton.classList.add('techTreeBtn')
    submitButton.innerText = "Done";
    submitButton.unselectable = "on";
    submitButton.onselectstart = function () {
        return false;
    }
    submitButton.onmousedown = function () {
        return false;
    }
    // Append elements
    dBoxEl.append(titleTitle, titleInput, descriptionTitle, descriptionInput, costTitle, costInput, lb, submitButton);
    // Open dialog box
    openModal(dBoxEl);
    // Button Detector function
    async function buttonDetector() {
        let eventResult;
        // Create a new promise
        let waitPromise = new Promise((resolve) => {
            // Set a global variable to the resolve function for this promise
            dialogResolve = resolve
        });
        // Wait until the promise is resolved (externally, by calling dialogResolve())
        await waitPromise.then((result) => {
            // Set eventResult to the result of the promise
            eventResult = result
        });
        // Return the event result
        return eventResult;
    }
    submitButton.addEventListener('mousedown', function () {
        // When submit button is clicked, call dialog resolve
        dialogResolve(1);
    });
    // Get result from button detector
    let result = await buttonDetector();
    // If there was a result
    if (result) {
        // Set output to the values input on the dialog box
        let output = [titleInput.value, descriptionInput.value, parseInt(costInput.value)];
        // Close the dialog box (deleting contents)
        closeModal(dBoxEl, true);
        // Return the output
        return output;
    }
}

async function editTreeItem(treeItem) {
    // Show Delete button
    dialogBtnContainer.children[1].classList.remove('displayNone');
    // Create elements
    let titleInput = document.createElement('input');

    let descriptionInput = document.createElement('textarea');

    let costInput = document.createElement('input');

    let lb, lb1, lb2;
    lb = document.createElement('br');
    lb1 = document.createElement('br');
    lb2 = document.createElement('br');

    let submitButton = document.createElement('button');
    // Modify elements
    titleInput.type = 'text';
    titleInput.value = treeItem.title;

    descriptionInput.rows = '6';
    descriptionInput.cols = '35';
    descriptionInput.value = treeItem.description;

    costInput.type = 'number';
    costInput.value = treeItem.cost;
    costInput.min = '0';
    costInput.max = '9999';
    costInput.onkeydown = function () {
        return false;
    };

    submitButton.classList.add('techTreeBtn')
    submitButton.innerText = "Done";
    submitButton.unselectable = "on";
    submitButton.onselectstart = function () {
        return false;
    }
    submitButton.onmousedown = function () {
        return false;
    }
    // Append elements
    dBoxEl.append(titleInput, lb, descriptionInput, lb1, costInput, lb2, submitButton);
    openModal(dBoxEl);
    // Button Detector function
    async function buttonDetector() {
        let eventResult;
        // Create a new promise
        let waitPromise = new Promise((resolve) => {
            // Set a global variable to the resolve function for this promise
            dialogResolve = resolve
        });
        submitButton.addEventListener('mousedown', function () {
            // When submit button is clicked, call dialog resolve
            dialogResolve(1);
        });
        // Wait until the promise is resolved (externally, by calling dialogResolve())
        await waitPromise.then((result) => {
            // Set eventResult to the result of the promise
            eventResult = result
        });
        // Return the event result
        return eventResult;
    }
    // Get result from button detector
    let result = await buttonDetector();
    // if the result is 1
    if (result === 1) {
        // Set new values for the tree item
        treeItem.newValues([titleInput.value, descriptionInput.value, parseInt(costInput.value)]);
    } else if (result === -1) { // Otherwise, if the result is -1
        // Delete the tree item
        treeItem.delete(topTreeElements);
    }
    // if there was a result, close the box (deleting contents)
    if (result) closeModal(dBoxEl, true);
}

function drawTree() {
    // For each top level tree item
    for (const tree of topTreeElements) {
        // Draw the tree item
        drawTreeItem(tree);
    }
}

function drawTreeItem(item) {
    // For each child of the item
    item.children.forEach(child => {
        // If the area between the child and the item is on screen
        if (
            child.position.x >= ctxCon.camera.x &&
            item.position.x + item.width <= ctxCon.camera.x + ctxCon.camera.width &&
            Math.max(item.position.y + item.height / 2, child.position.y + child.height / 2) >= ctxCon.camera.y &&
            Math.min(item.position.y + item.height / 2, child.position.y + child.height / 2) <= ctxCon.camera.y + ctxCon.camera.height
        ) {
            // Draw the connecting line
            ctx.strokeStyle = '#252A34';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(...ctxCon.gac('xy', item.position.x + item.width, item.position.y + item.height / 2));
            let distance = child.position.x - (item.position.x + item.width);
            ctx.bezierCurveTo(...ctxCon.gac('xyxyxy', item.position.x + item.width + distance / 2, item.position.y + item.height / 2, item.position.x + item.width + distance / 2, child.position.y + child.height / 2, item.position.x + item.width + distance, child.position.y + child.height / 2))
            ctx.stroke();
        }
    });
    // If the item is on screen
    if (
        item.position.x + item.width >= ctxCon.camera.x &&
        item.position.x <= ctxCon.camera.x + ctxCon.camera.width &&
        item.position.y + item.height >= ctxCon.camera.y &&
        item.position.y <= ctxCon.camera.y + ctxCon.camera.height
    ) {
        // Item background
        ctx.fillStyle = '#EEEEEE';
        ctx.beginPath();
        ctx.cutCorner(...ctxCon.gac('xywhw', item.position.x, item.position.y, item.width, item.height, 20));
        ctx.fill();
        // Top stripe
        ctx.fillStyle = '#FF2E63';
        ctx.beginPath();
        ctx.cutCorner(...ctxCon.gac('xywhw', item.position.x, item.position.y, item.width - 14, 6, 6));
        ctx.fill();
        // Button light
        ctx.fillStyle = '#CCCCCC';
        ctx.beginPath();
        ctx.fillRect(...ctxCon.gac('xywh', item.position.x + item.width - 20, item.position.y + 24, 20, item.height - 28));
        ctx.fill();
        // Button shadow
        ctx.fillStyle = '#AAAAAA';
        ctx.beginPath();
        ctx.moveTo(...ctxCon.gac('xy', item.position.x + item.width - 20, item.position.y + 24));
        ctx.lineTo(...ctxCon.gac('xy', item.position.x + item.width - 17, item.position.y + 27));
        ctx.lineTo(...ctxCon.gac('xy', item.position.x + item.width - 3, item.position.y + item.height - 7));
        ctx.lineTo(...ctxCon.gac('xy', item.position.x + item.width, item.position.y + item.height - 4));
        ctx.lineTo(...ctxCon.gac('xy', item.position.x + item.width - 20, item.position.y + item.height - 4));
        ctx.closePath();
        ctx.fill();
        // Button main
        ctx.fillStyle = '#BBBBBB';
        ctx.beginPath();
        ctx.fillRect(...ctxCon.gac('xywh', item.position.x + item.width - 17, item.position.y + 27, 14, item.height - 34));
        ctx.fill();

        let itemCenter = item.position.y + ((item.height - 20) / 2) + 20;

        // Draw button icon
        ctx.lineWidth = ctxCon.gac('w', 3)[0];
        ctx.lineCap = 'round';

        ctx.strokeStyle = '#EEEEEE';
        if (item.buttonHover === 3) ctx.strokeStyle = '#555555';
        ctx.beginPath();
        ctx.moveTo(...ctxCon.gac('xy', item.position.x + item.width - 10, itemCenter - 4));
        ctx.lineTo(...ctxCon.gac('xy', item.position.x + item.width - 10, itemCenter + 4));
        ctx.moveTo(...ctxCon.gac('xy', item.position.x + item.width - 6, itemCenter));
        ctx.lineTo(...ctxCon.gac('xy', item.position.x + item.width - 14, itemCenter));
        ctx.stroke();

        if (item.buttonHover === 3) {
            ctx.strokeStyle = '#EEEEEE';
            ctx.beginPath();
            ctx.moveTo(...ctxCon.gac('xy', item.position.x + item.width - 10, itemCenter - 5));
            ctx.lineTo(...ctxCon.gac('xy', item.position.x + item.width - 10, itemCenter + 3));
            ctx.moveTo(...ctxCon.gac('xy', item.position.x + item.width - 6, itemCenter - 1));
            ctx.lineTo(...ctxCon.gac('xy', item.position.x + item.width - 14, itemCenter - 1));
            ctx.stroke();
        }

        ctx.textBaseline = 'top';
        // Draw headers
        ctx.fillStyle = '#08D9D6'
        ctx.font = `${ctxCon.gac('w', 18)[0]}px cousine`;
        ctx.fillText('Description', ...ctxCon.gac('xy', item.position.x + 16, item.position.y + 81));

        ctx.fillText('Cost', ...ctxCon.gac('xy', item.position.x + 16, item.position.y + 103 + item.wrappedDescription.length * 13));

        ctx.fillStyle = '#252A34'
        // Draw title
        ctx.font = `${ctxCon.gac('w', 24)[0]}px cousine`;
        ctx.fillText(item.title, ...ctxCon.gac('xy', item.position.x + 16, item.position.y + 53));
        // Draw description
        ctx.font = `${ctxCon.gac('w', 13)[0]}px cousine`;
        item.wrappedDescription.forEach((line, index) => {
            ctx.fillText(line, ...ctxCon.gac('xy', item.position.x + 16, item.position.y + 103 + index * 13));
        });
        // Draw cost
        ctx.fillText(item.cost + ' units', ...ctxCon.gac('xy', item.position.x + 16, item.position.y + 125 + item.wrappedDescription.length * 13));
        // Draw Top buttons
        if (item.buttonHover === 0) {
            ctx.drawImage(editImg, ...ctxCon.gac('xywh', item.position.x + 14, item.position.y + 18, 24, 24));
        } else {
            ctx.drawImage(editImg, ...ctxCon.gac('xywh', item.position.x + 16, item.position.y + 18, 20, 20));
        }

        if (item.buttonHover === 1) {
            ctx.drawImage(downImg, ...ctxCon.gac('xywh', item.position.x + 43, item.position.y + 18, 24, 24));
        } else {
            ctx.drawImage(downImg, ...ctxCon.gac('xywh', item.position.x + 45, item.position.y + 18, 20, 20));
        }

        if (item.buttonHover === 2) {
            ctx.drawImage(upImg, ...ctxCon.gac('xywh', item.position.x + 72, item.position.y + 18, 24, 24));
        } else {
            ctx.drawImage(upImg, ...ctxCon.gac('xywh', item.position.x + 74, item.position.y + 18, 20, 20));
        }
    }
    // For each child of this item
    item.children.forEach(child => {
        // If the child's position is less than or equal to that if the camera
        if (child.position.x <= ctxCon.camera.x + ctxCon.camera.width) {
            // Draw the child
            drawTreeItem(child);
        }
    });
}