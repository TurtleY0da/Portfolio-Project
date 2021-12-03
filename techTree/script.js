// Tech Tree Script by Timothy V 

// -- Initialize Variables --

// HTML Elements
let cnv = docGetID("treeCanvas");

let dBoxEl = docGetID('dialogueBox');
dialogPolyfill.registerDialog(dBoxEl);

let closeModalEl = docGetID('closeModalBtn');

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
    x:0,
    y:0,
    cX:0,
    cY:0
}
let dragOffset = {
    x:0,
    y:0
}

let cousine = new FontFace('cousine', 'url(../fonts/Cousine-Regular.ttf)');

let topTreeElements = new Array();

let scrolling = false;
let bounds = new boundingBox(-100, -100, 300, 300)

// -- Main Loop --
requestAnimationFrame(loop);

document.fonts.add(cousine);

function loop() {
    // - Update Variables -
    if(clickHeld === 2){
        ctxCon.camera.centerX = dragStart.cX + dragOffset.x /ctxCon.camera.zoom
        ctxCon.camera.centerY = dragStart.cY + dragOffset.y /ctxCon.camera.zoom
    }

    ctxCon.updateCamera(bounds)

    if (screen.availWidth !== screenSize.width || screen.availHeight !== screenSize.height) {
        screenSize = {
            width: screen.availWidth,
            height: screen.availHeight
        }
    }

    cnv.width = Math.max(screenSize.width / 1.5);
    cnv.height = Math.max(screenSize.height / 1.5);

    // - Draw -
    ctx.fillStyle = '#AADDAA';
    ctx.fillRect(0, 0, cnv.width, cnv.height);

    ctx.fillStyle = 'white'
    ctx.fillRect(...ctxCon.gac([bounds.min.x, bounds.min.y, bounds.max.x-bounds.min.x, bounds.max.y-bounds.min.y], ['x', 'y', 'w', 'h']))
    ctx.fillStyle = 'black'
    ctx.fillRect(...ctxCon.gac([100, 50, 80, 40], ['x', 'y', 'w', 'h']))
    ctx.fillRect(cnv.width/2-1,cnv.height/2-1,2, 2);

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

closeModalEl.addEventListener('click', closeModal);
cnv.addEventListener('wheel', scrollHandler);
cnv.addEventListener('mousedown', clickHandler);
cnv.addEventListener('mouseup', clickHandler);
cnv.addEventListener('mouseleave', clickHandler);
cnv.addEventListener('mousemove', dragHandler);

// -- Functions --

// - Event Functions -
function closeModal() {
    dBoxEl.classList.remove('opening');
    dBoxEl.classList.add('closing');
    dBoxEl.addEventListener('animationend', function (event) {
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
    });
}

function openModal() {
    if (dBoxEl.classList[0] === 'closing') {
        dBoxEl.close();
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

function clickHandler(event) {
    switch(event.type){
        case 'mousedown':
            if(clickHeld !== event.button && clickHeld !== -1 || event.button === 1) break;
            clickHeld = event.button;
            beginDrag(event);
            break;
        case 'mouseup':
            if(clickHeld !== event.button) break;
        case 'mouseleave':
            endDrag();
            clickHeld = -1;
            break;
    }
}

function dragHandler(event) {
    if(clickHeld > -1){
        cnvRect = cnv.getBoundingClientRect();
        switch(clickHeld){
            case 2:
                dragOffset.x = (dragStart.x - (event.clientX - cnvRect.left))
                dragOffset.y = (dragStart.y - (event.clientY - cnvRect.top))
                break;
        }
    }
}

function beginDrag(event) {
    cnvRect = cnv.getBoundingClientRect();
    switch(event.button){
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
    if(clickHeld === 2){
        ctxCon.centerX = dragStart.cX + dragOffset.x /ctxCon.camera.zoom
        ctxCon.centerY = dragStart.cY + dragOffset.y /ctxCon.camera.zoom

        dragOffset.x = 0;
        dragOffset.y = 0;
    }
}

// - Functions -
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