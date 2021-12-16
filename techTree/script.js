// Tech Tree Script by Timothy V 

// -- Initialize Variables --

// HTML Elements
let cnv = docGetID("treeCanvas");

let dBoxEl = docGetID('dialogueBox');
let hBoxEl = docGetID('helpBox');
let sBoxEl = docGetID('saveBox');

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

document.fonts.add(cousine);

measureWidth('abc', 24)

function loop() {
    // - Update Variables -
    if (clickHeld === 2) {
        ctxCon.camera.centerX = dragStart.cX + dragOffset.x / ctxCon.camera.zoom
        ctxCon.camera.centerY = dragStart.cY + dragOffset.y / ctxCon.camera.zoom
    }

    let currentY = 0 - topTreeElements.reduce((a, b) => a + b.totalHeight, 0) / 2;
    topTreeElements.forEach(child => {
        child.position.y = (currentY + child.totalHeight / 2) - child.height / 2;
        currentY += child.totalHeight;
        child.updateChain();
    });

    topTreeElements.forEach(child => {
        child.checkHover(mouse);
    });

    let totalHeight = topTreeElements.reduce((a, b) => a + b.totalHeight, 0);
    let totalWidth = topTreeElements.reduce((a, b) => Math.max(a, b.totalWidth), 0);

    bounds.min.x = -64;
    bounds.max.x = Math.max(totalWidth - 36, 576);
    bounds.min.y = Math.min(0 - totalHeight / 2 - 48, -320)
    bounds.max.y = Math.max(totalHeight / 2 + 48, 320)

    ctxCon.updateCamera(bounds)

    if (screen.availWidth !== screenSize.width || screen.availHeight !== screenSize.height) {
        screenSize = {
            width: screen.availWidth,
            height: screen.availHeight
        }
        cnv.width = Math.max(screenSize.width / 1.5);
        cnv.height = Math.max(screenSize.height / 1.5);
        smallestEdge = Math.min(cnv.width, cnv.height);
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

    cnv.width = Math.max(screenSize.width / 1.5);
    cnv.height = Math.max(screenSize.height / 1.5);

    // - Draw -
    ctx.fillStyle = '#AADDAA';
    ctx.fillRect(0, 0, cnv.width, cnv.height);

    ctx.fillStyle = '#CCEECC'
    ctx.fillRect(...ctxCon.gac('xywh', bounds.min.x, bounds.min.y, bounds.max.x - bounds.min.x, bounds.max.y - bounds.min.y))

    drawTree();

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
cnv.oncontextmenu = function (e) {
    e.preventDefault();
}

dialogBtnContainer.children[0].children[0].addEventListener('click', function () {
    closeModal(dBoxEl, true)
});
helpBtnContainer.children[0].children[0].addEventListener('click', function () {
    closeModal(hBoxEl, false)
});
saveBtnContainer.children[0].children[0].addEventListener('click', function () {
    closeModal(sBoxEl, false)
});
cnv.addEventListener('wheel', scrollHandler);
cnv.addEventListener('mousedown', clickHandler);
cnv.addEventListener('mouseup', clickHandler);
cnv.addEventListener('mouseleave', clickHandler);
cnv.addEventListener('mousemove', moveHandler);

// -- Functions --

// - Event Functions -
function closeModal(dialogBox, deleteItems) {
    dialogBox.classList.remove('opening');
    dialogBox.classList.add('closing');
    let tempFunc = function () {
        modalClosed(dialogBox, tempFunc, deleteItems)
    };
    dialogBox.addEventListener('animationend', tempFunc)
}

function modalClosed(dialogBox, tempFunc, deleteItems) {
    if (dialogBox.classList[0] === 'closing') {
        dialogBox.close();
        dialogBox.classList.remove('closing');
    }
    if (deleteItems) {
        let removalArray = new Array();
        for (const child of dialogBox.children) {
            removalArray.push(child);
        }
        removalArray.forEach((element, index) => {
            if (index > 0) {
                element.remove();
            }
        });
    }
    dialogBox.removeEventListener('animationend', tempFunc)
}

function openModal(dialogBox) {
    if (dialogBox.classList[0] === 'closing') {
        dialogBox.close();
        modalClosed(dialogBox);
        dialogBox.classList.remove('closing');
    }
    dialogBox.classList.add('opening');
    dialogBox.showModal();
}

function scrollHandler(event) {
    if (scrolling === false && clickHeld < 2) {
        scrolling = true;
        setTimeout(function () {
            scrolling = false;
        }, 50)
        ctxCon.camera.zoom += -Math.sign(event.deltaY) / 4

        if (ctxCon.camera.zoom < 0.25) ctxCon.camera.zoom = 0.25;
        if (ctxCon.camera.zoom > 2) ctxCon.camera.zoom = 2;
    }
}

async function clickHandler(event) {
    cnvRect = cnv.getBoundingClientRect();
    switch (event.type) {
        case 'mousedown':
            if (clickHeld !== event.button && clickHeld !== -1 || event.button === 1) break;
            checkHover(event.clientX - cnvRect.left, event.clientY - cnvRect.top)
            if (addButtonHover) {
                if (event.button !== 0) break;
                let treeParams = await createTreeItem();
                if (treeParams === undefined) break;
                topTreeElements.push(new treeItem(null, ...treeParams));
            } else if (helpButtonHover) {
                if (event.button !== 0) break;
                openModal(hBoxEl);
            } else if (saveButtonHover) {
                if (event.button !== 0) break;
                openSaver();
            } else {
                clickHeld = event.button;
                beginDrag(event);
            }
            break;
        case 'mouseup':
            if (clickHeld !== event.button) break;
        case 'mouseleave':
            if (clickHeld === -1) break;
            endDrag();
            clickHeld = -1;
            break;
    }
}

function moveHandler(event) {
    cnvRect = cnv.getBoundingClientRect();
    if (clickHeld > -1) {
        switch (clickHeld) {
            case 2:
                dragOffset.x = (dragStart.x - (event.clientX - cnvRect.left))
                dragOffset.y = (dragStart.y - (event.clientY - cnvRect.top))
                break;
        }
    } else {
        checkHover(event.clientX - cnvRect.left, event.clientY - cnvRect.top);
        mouse.x = event.clientX - cnvRect.left;
        mouse.y = event.clientY - cnvRect.top;
    }
}

async function beginDrag(event) {
    cnvRect = cnv.getBoundingClientRect();
    switch (event.button) {
        case 2:
            dragStart.x = event.clientX - cnvRect.left;
            dragStart.y = event.clientY - cnvRect.top;
            dragStart.cX = ctxCon.camera.centerX;
            dragStart.cY = ctxCon.camera.centerY;

            dragOffset.x = 0;
            dragOffset.y = 0;
            break;
        case 0:
            mouse.x = event.clientX - cnvRect.left;
            mouse.y = event.clientY - cnvRect.top;
            for (const child of topTreeElements) {
                child.checkHover(mouse);
                if (await child.checkClick(topTreeElements) === true) break;
            };
    }
}

function endDrag() {
    if (clickHeld === 2) {
        ctxCon.camera.centerX = dragStart.cX + dragOffset.x / ctxCon.camera.zoom
        ctxCon.camera.centerY = dragStart.cY + dragOffset.y / ctxCon.camera.zoom

        dragOffset.x = 0;
        dragOffset.y = 0;
    }
}

// - Functions -
function readFile(file, callback) {
    const reader = new FileReader();
    reader.onload = function (event) {
        callback(event.target.result);
    };
    reader.readAsText(file);
}

function checkHover(mouseX, mouseY) {
    // Check for button hover
    // If false, check for hover on 'treeItem's
    if (polyPoint(addButtonVertices, mouseX, mouseY)) addButtonHover = true;
    else addButtonHover = false;

    if (polyPoint(helpButtonVertices, mouseX, mouseY)) helpButtonHover = true;
    else helpButtonHover = false;

    if (polyPoint(saveButtonVertices, mouseX, mouseY)) saveButtonHover = true;
    else saveButtonHover = false;
}


function measureWidth(text, size) {
    ctx.font = `${size}px cousine`;
    return ctx.measureText(text).width;
}

function measureHeight(text, size) {
    ctx.font = `${size}px cousine`;
    let textMetric = ctx.measureText(text)
    return textMetric.actualBoundingBoxAscent + textMetric.actualBoundingBoxDescent;
}

function getWrappedLines(textArray, size, preferedLineSize) {
    let lines = [""]
    textArray.forEach(element => {
        let elementWidth = measureWidth(element.match(/\S+/g), size);
        lines.push(element);
        if (measureWidth(lines[lines.length - 2], size) + elementWidth < preferedLineSize) lines.mergeStrings(lines.length - 2, 2, "");
    });
    return lines;
}

async function openSaver() {
    openModal(sBoxEl);

    async function buttonDetector(importBtn, closeBtn, exportBtn) {
        let eventResult;
        var waitPromise = new Promise((resolve) => {
            dialogResolve = resolve
        });
        importBtn.addEventListener('mousedown', function () {
            dialogResolve(1);
        });
        closeBtn.addEventListener('mousedown', function () {
            dialogResolve(0);
        });
        exportBtn.addEventListener('mousedown', function () {
            dialogResolve(-1);
        });
        await waitPromise.then((result) => {
            eventResult = result
        });
        return eventResult;
    }

    let result = await buttonDetector(sBoxEl.children[5].children[0], saveBtnContainer.children[0].children[0], sBoxEl.children[5].children[2]);

    if(result === 1){
        if(sBoxEl.children[2].value !== '' ) readFile(sBoxEl.children[2].files[0], constructTree);
    }
    if(result === -1){
        let deconstructedTree = deconstructTree(topTreeElements);
        let compressedTree = LZString.compressToUTF16(deconstructedTree);
        let blob = new Blob([compressedTree], {type: "text/plain;charset=utf-16"});
        saveAs(blob, "techTree.dat");
    }

    if(result) closeModal(sBoxEl);
}

async function createTreeItem() {
    dialogBtnContainer.children[1].classList.add('displayNone');

    let titleTitle = document.createElement('h2');
    let titleInput = document.createElement('input');

    let descriptionTitle = document.createElement('h3');
    let descriptionInput = document.createElement('textarea');

    let costTitle = document.createElement('h3');
    let costInput = document.createElement('input');

    let lb = document.createElement('br');

    let submitButton = document.createElement('button');

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

    dBoxEl.append(titleTitle, titleInput, descriptionTitle, descriptionInput, costTitle, costInput, lb, submitButton);
    openModal(dBoxEl);

    async function buttonDetector(submitBtn, closeBtn) {
        let eventResult;
        var waitPromise = new Promise((resolve) => {
            dialogResolve = resolve
        });
        submitBtn.addEventListener('mousedown', function () {
            dialogResolve(1);
        });
        closeBtn.addEventListener('mousedown', function () {
            dialogResolve(0);
        });
        await waitPromise.then((result) => {
            eventResult = result
        });
        return eventResult;
    }

    let result = await buttonDetector(submitButton, dialogBtnContainer.children[0].children[0]);
    if (result) {
        let output = [titleInput.value, descriptionInput.value, parseInt(costInput.value)];
        closeModal(dBoxEl, true);
        return output;
    }
}

async function editTreeItem(treeItem) {
    dialogBtnContainer.children[1].classList.remove('displayNone');

    let titleInput = document.createElement('input');

    let descriptionInput = document.createElement('textarea');

    let costInput = document.createElement('input');

    let lb, lb1, lb2;
    lb = document.createElement('br');
    lb1 = document.createElement('br');
    lb2 = document.createElement('br');

    let submitButton = document.createElement('button');

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

    dBoxEl.append(titleInput, lb, descriptionInput, lb1, costInput, lb2, submitButton);
    openModal(dBoxEl);

    async function buttonDetector(submitBtn, closeBtn, deleteBtn) {
        let eventResult;
        var waitPromise = new Promise((resolve) => {
            dialogResolve = resolve
        });
        submitBtn.addEventListener('mousedown', function () {
            dialogResolve(1);
        });
        closeBtn.addEventListener('mousedown', function () {
            dialogResolve(0);
        });
        deleteBtn.addEventListener('mousedown', function () {
            dialogResolve(-1);
        });
        await waitPromise.then((result) => {
            eventResult = result
        });
        return eventResult;
    }

    let result = await buttonDetector(submitButton, dialogBtnContainer.children[0].children[0], dialogBtnContainer.children[1].children[0]);
    if (result === 1) {
        treeItem.newValues([titleInput.value, descriptionInput.value, parseInt(costInput.value)]);
    } else if (result === -1) {
        treeItem.delete(topTreeElements);
    }
    if (result) closeModal(dBoxEl, true);
}

function drawTree() {
    for (const tree of topTreeElements) {
        drawTreeItem(tree);
    }
}

function drawTreeItem(item) {
    item.children.forEach(child => {
        if (
            child.position.x >= ctxCon.camera.x &&
            item.position.x + item.width <= ctxCon.camera.x + ctxCon.camera.width &&
            Math.max(item.position.y + item.height / 2, child.position.y + child.height / 2) >= ctxCon.camera.y &&
            Math.min(item.position.y + item.height / 2, child.position.y + child.height / 2) <= ctxCon.camera.y + ctxCon.camera.height
        ) {
            ctx.strokeStyle = '#252A34';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(...ctxCon.gac('xy', item.position.x + item.width, item.position.y + item.height / 2));
            let distance = child.position.x - (item.position.x + item.width);
            ctx.bezierCurveTo(...ctxCon.gac('xyxyxy', item.position.x + item.width + distance / 2, item.position.y + item.height / 2, item.position.x + item.width + distance / 2, child.position.y + child.height / 2, item.position.x + item.width + distance, child.position.y + child.height / 2))
            ctx.stroke();
        }
    });
    if (
        item.position.x + item.width >= ctxCon.camera.x &&
        item.position.x <= ctxCon.camera.x + ctxCon.camera.width &&
        item.position.y + item.height >= ctxCon.camera.y &&
        item.position.y <= ctxCon.camera.y + ctxCon.camera.height
    ) {
        ctx.fillStyle = '#EEEEEE';
        ctx.beginPath();
        ctx.cutCorner(...ctxCon.gac('xywhw', item.position.x, item.position.y, item.width, item.height, 20));
        ctx.fill();

        ctx.fillStyle = '#FF2E63';
        ctx.beginPath();
        ctx.cutCorner(...ctxCon.gac('xywhw', item.position.x, item.position.y, item.width - 14, 6, 6));
        ctx.fill();

        ctx.fillStyle = '#CCCCCC';
        ctx.beginPath();
        ctx.fillRect(...ctxCon.gac('xywh', item.position.x + item.width - 20, item.position.y + 24, 20, item.height - 28));
        ctx.fill();

        ctx.fillStyle = '#AAAAAA';
        ctx.beginPath();
        ctx.moveTo(...ctxCon.gac('xy', item.position.x + item.width - 20, item.position.y + 24));
        ctx.lineTo(...ctxCon.gac('xy', item.position.x + item.width - 17, item.position.y + 27));
        ctx.lineTo(...ctxCon.gac('xy', item.position.x + item.width - 3, item.position.y + item.height - 7));
        ctx.lineTo(...ctxCon.gac('xy', item.position.x + item.width, item.position.y + item.height - 4));
        ctx.lineTo(...ctxCon.gac('xy', item.position.x + item.width - 20, item.position.y + item.height - 4));
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#BBBBBB';
        ctx.beginPath();
        ctx.fillRect(...ctxCon.gac('xywh', item.position.x + item.width - 17, item.position.y + 27, 14, item.height - 34));
        ctx.fill();

        let itemCenter = item.position.y + ((item.height - 20) / 2) + 20;


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

        ctx.fillStyle = '#08D9D6'
        ctx.font = `${ctxCon.gac('w', 18)[0]}px cousine`;
        ctx.fillText('Description', ...ctxCon.gac('xy', item.position.x + 16, item.position.y + 81));

        ctx.fillText('Cost', ...ctxCon.gac('xy', item.position.x + 16, item.position.y + 103 + item.wrappedDescription.length * 13));

        ctx.fillStyle = '#252A34'

        ctx.font = `${ctxCon.gac('w', 24)[0]}px cousine`;
        ctx.fillText(item.title, ...ctxCon.gac('xy', item.position.x + 16, item.position.y + 53));

        ctx.font = `${ctxCon.gac('w', 13)[0]}px cousine`;
        item.wrappedDescription.forEach((line, index) => {
            ctx.fillText(line, ...ctxCon.gac('xy', item.position.x + 16, item.position.y + 103 + index * 13));
        });

        ctx.fillText(item.cost + ' units', ...ctxCon.gac('xy', item.position.x + 16, item.position.y + 125 + item.wrappedDescription.length * 13));

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
    item.children.forEach(child => {
        if (child.position.x <= ctxCon.camera.x + ctxCon.camera.width) {
            drawTreeItem(child);
        }
    });
}

// TEMPORARY
var stringToColour = function (str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    var colour = '#';
    for (var i = 0; i < 3; i++) {
        var value = (hash >> (i * 8)) & 0xFF;
        colour += ('00' + value.toString(16)).substr(-2);
    }
    return colour;
}