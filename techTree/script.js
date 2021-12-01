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

let cousine = new FontFace('cousine', 'url(../fonts/Cousine-Regular.ttf)');

let topTreeElements = new Array();

let scrolling = false;

// -- Main Loop --
requestAnimationFrame(loop);

document.fonts.add(cousine);

function loop() {
    // - Update Variables -
    ctxCon.updateCamera()

    if (screen.availWidth !== screenSize.width || screenSize.availHeight !== screenSize.height) {
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

    ctx.fillStyle = 'black'
    ctx.fillRect(...ctxCon.gac([100, 50, 80, 40], ['x', 'y', 'w', 'h']))

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
    if(dBoxEl.classList[0] === 'closing'){
        dBoxEl.close();
        dBoxEl.classList.remove('closing');
    }
    dBoxEl.classList.add('opening');
    dBoxEl.showModal();
}

function scrollHandler(event) {
    if(scrolling === false){
        scrolling = true;
        setTimeout(function() {
            scrolling = false;
        }, 50)
        ctxCon.camera.zoom += -Math.sign(event.deltaY)/4
        if(ctxCon.camera.zoom < 0.25) ctxCon.camera.zoom = 0.25;
        if(ctxCon.camera.zoom > 2) ctxCon.camera.zoom = 2;
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
        if(measureWidth(lines[lines.length-2], size)+elementWidth < preferedLineSize) lines.mergeStrings(lines.length-2, 2, "");
    });
    return lines;
}