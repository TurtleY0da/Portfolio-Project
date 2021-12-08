// Tech Tree Script by Timothy V 

// -- Initialize Variables --

// HTML Elements
let cnv = docGetID("treeCanvas");

let dBoxEl = docGetID('dialogueBox');
dialogPolyfill.registerDialog(dBoxEl);

let dialogBtnContainer = docGetID('divBtnContainer');

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

let cousine = new FontFace('cousine', 'url(../fonts/Cousine-Regular.ttf)');

let topTreeElements = new Array();

let scrolling = false;

let bounds = new boundingBox(0, 0, 500, 600);

let smallestEdge = Math.min(cnv.width, cnv.height);

let buttonVertices = [new PVector(0, 0), new PVector(smallestEdge / 12, 0), new PVector(smallestEdge / 12, smallestEdge / 12 - smallestEdge / 12 / 6), new PVector(smallestEdge / 12 - smallestEdge / 12 / 6, smallestEdge / 12), new PVector(0, smallestEdge / 12)];

let buttonHover = false;

let dialogResolve;

let drawPromise;
let drawing = false;

// -- Main Loop --
requestAnimationFrame(loop);

document.fonts.add(cousine);

measureWidth('abc', 24)

function loop() {
    if (topTreeElements.length > 0) {
        if (!drawing) {
            drawing = true;
            drawPromise = drawTree(topTreeElements, finishedDraw);
        }
    }
    // - Update Variables -
    if (clickHeld === 2) {
        ctxCon.camera.centerX = dragStart.cX + dragOffset.x / ctxCon.camera.zoom
        ctxCon.camera.centerY = dragStart.cY + dragOffset.y / ctxCon.camera.zoom
    }

    ctxCon.updateCamera(bounds)

    if (screen.availWidth !== screenSize.width || screen.availHeight !== screenSize.height) {
        screenSize = {
            width: screen.availWidth,
            height: screen.availHeight
        }
        cnv.width = Math.max(screenSize.width / 1.5);
        cnv.height = Math.max(screenSize.height / 1.5);
        smallestEdge = Math.min(cnv.width, cnv.height);
        buttonVertices = [new PVector(0, 0), new PVector(smallestEdge / 12, 0), new PVector(smallestEdge / 12, smallestEdge / 12 - smallestEdge / 12 / 6), new PVector(smallestEdge / 12 - smallestEdge / 12 / 6, smallestEdge / 12), new PVector(0, smallestEdge / 12)];
    }

    cnv.width = Math.max(screenSize.width / 1.5);
    cnv.height = Math.max(screenSize.height / 1.5);

    // - Draw -
    ctx.fillStyle = '#AADDAA';
    ctx.fillRect(0, 0, cnv.width, cnv.height);

    ctx.fillStyle = 'white'
    ctx.fillRect(...ctxCon.gac([bounds.min.x, bounds.min.y, bounds.max.x - bounds.min.x, bounds.max.y - bounds.min.y], ['x', 'y', 'w', 'h']))

    ctx.fillStyle = '#FF2E63';
    ctx.strokeStyle = '#EEEEEE';
    if (buttonHover) {
        ctx.fillStyle = '#EEEEEE';
        ctx.strokeStyle = '#FF2E63';
    }
    ctx.lineWidth = smallestEdge / 100;
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

    // ctx.fillStyle = 'blue';
    // topTreeElements.forEach(item => {
    //     ctx.fillRect(...ctxCon.gac([item.position.x, item.position.y, item.width, item.height], ['x', 'y', 'w', 'h']));
    //     item.children.forEach(child => {
    //         ctx.fillRect(...ctxCon.gac([child.position.x, child.position.y, child.width, child.height], ['x', 'y', 'w', 'h']));
    //     })
    // });


    // ctx.font = '24px cousine';
    // ctx.textBaseline = 'top';
    // ctx.fillText('oooooooooooooooooOoooooooooooooooo', 0, 0);

    // - End -
    requestAnimationFrame(loop);
}

// -- Add Event Listeners
cnv.oncontextmenu = function (e) {
    e.preventDefault();
}

dialogBtnContainer.children[0].children[0].addEventListener('click', closeModal);
cnv.addEventListener('wheel', scrollHandler);
cnv.addEventListener('mousedown', clickHandler);
cnv.addEventListener('mouseup', clickHandler);
cnv.addEventListener('mouseleave', clickHandler);
cnv.addEventListener('mousemove', moveHandler);

// -- Functions --

// - Event Functions -
function closeModal() {
    dBoxEl.classList.remove('opening');
    dBoxEl.classList.add('closing');
    dBoxEl.addEventListener('animationend', modalClosed);
}

function modalClosed() {
    if (dBoxEl.classList[0] === 'closing') {
        dBoxEl.close();
        dBoxEl.classList.remove('closing');
    }
    let removalArray = new Array();
    for (const child of dBoxEl.children) {
        removalArray.push(child);
    }
    removalArray.forEach((element, index) => {
        if (index > 0) {
            element.remove();
        }
    });
    dBoxEl.removeEventListener('animationend', modalClosed)
}

function openModal() {
    if (dBoxEl.classList[0] === 'closing') {
        dBoxEl.close();
        modalClosed();
        dBoxEl.classList.remove('closing');
    }
    dBoxEl.classList.add('opening');
    dBoxEl.showModal();
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
    switch (event.type) {
        case 'mousedown':
            if (clickHeld !== event.button && clickHeld !== -1 || event.button === 1) break; 
            if(buttonHover){
                if(event.button !== 0) break;
                let treeParams = await createTopLevel()
                if(treeParams === undefined) break;
                topTreeElements.push(new treeItem(null, ...treeParams));
            } else {
                clickHeld = event.button;
                beginDrag(event);
            }
            break;
        case 'mouseup':
            if (clickHeld !== event.button) break;
        case 'mouseleave':
            if(clickHeld === -1) break;
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
    }
}

function beginDrag(event) {
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
function checkHover(mouseX, mouseY) {
    // Check for button hover
    // If false, check for hover on 'treeItem's
    if (polyPoint(buttonVertices, mouseX, mouseY)) buttonHover = true;
    else buttonHover = false;
}

function finishedDraw() {
    drawing = false;
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

async function createTopLevel() {
    dialogBtnContainer.children[1].classList.add('displayNone');
    dialogBtnContainer.children[2].classList.add('displayNone');

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
    submitButton.onselectstart = function() {
        return false;
    }
    submitButton.onmousedown = function () {
        return false;
    }

    dBoxEl.append(titleTitle, titleInput, descriptionTitle, descriptionInput, costTitle, costInput, lb, submitButton);
    openModal();

    let result = await buttonDetector(submitButton, dialogBtnContainer.children[0].children[0]);
    if(result){
        let output = [titleInput.value, descriptionInput.value, parseInt(costInput.value)];
        closeModal();
        return output;
    }
}

async function buttonDetector(submitBtn, closeBtn) {
    let eventResult;
    var waitPromise = new Promise((resolve) => { dialogResolve = resolve });
    submitBtn.addEventListener('mousedown', function(){
        dialogResolve(true);
    });
    closeBtn.addEventListener('mousedown', function(){
        dialogResolve(false);
    });
    await waitPromise.then((result) => { eventResult = result });
    return eventResult;
}

async function drawTree(treeArray, callback) {
    for(const item of treeArray){
        console.log(...ctxCon.gac([item.position.x, item.position.y, item.width, item.height], [['x'], ['y'], ['w'], ['h']]))
        await drawTreeItem(item);
        await timer(0.3);
    }
    callback();
}

async function drawTreeItem(item){
    if(
        item.position.x+item.width >= ctxCon.camera.x &&
        item.position.x <= ctxCon.camera.x + ctxCon.camera.width &&
        item.position.y+item.height >= ctxCon.camera.y &&
        item.position.y <= ctxCon.camera.y + ctxCon.camera.height
    ){
        ctx.fillStyle = 'blue';
        console.log(...ctxCon.gac([item.position.x, item.position.y, item.width, item.height], ['x', 'y', 'w', 'h']))
        ctx.fillRect(...ctxCon.gac([item.position.x, item.position.y, item.width, item.height], [['x'], 'y', 'w', 'h']))
    } else {
        console.log(item.position.x+item.width > ctxCon.camera.x, item.position.x < ctxCon.camera.x + ctxCon.camera.width, item.position.y+item.height >= ctxCon.camera.y, item.position.y <= ctxCon.camera.y + ctxCon.camera.height);
    }
}