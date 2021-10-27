// Sorting Algorithm Exeriment by Timothy V 

// -- Initialize Variables --

// HTML Elements
let cnv = docGetID("myCanvas");

let inputs = {
    columnNumListEl: docGetID("columnNumIn"),
    sortBtnEl: docGetID("sortBtn"),
    insertionSortEl: docGetID("insSortCheckbox"),
    mergeSortEl: docGetID("mrgSortCheckbox"),
    quickSortEl: docGetID("qukSortCheckbox"),
}

// Glbl Variables
let openSans = new FontFace('openSans', 'url(../fonts/OpenSans-SemiBold.ttf)');

// Item: {array:[], activeItem: 0, secondaryItems: [-1,-1]}
let sorterChart = new sortingChart(100, [{array:[], activeItem: 0, secondaryItems: [-1,-1]}, {array:[], activeItem: 0, secondaryItems: [-1,-1]}, {array:[], activeItem: 0, secondaryItems: [-1,-1]}]);

let sorted = false;

let activeSorts = {
    insert: true,
    merge: true,
    quick: true,
    string: ['Insertion Sort', 'Merge Sort', 'Quick Sort']
}

// -- Canvas & Context setup
/** @type {CanvasRenderingContext2D} */
let ctx = cnv.getContext("2d");

cnv.width = 1040;
cnv.height = 585;

// -- Main Loop --
document.fonts.add(openSans);

requestAnimationFrame(loop);

function loop() {
    // - Update Variables -


    // - Draw -
    ctx.clearRect(0, 0, cnv.width, cnv.height);
    ctx.lineWidth = (1000/sorterChart.randomArray.length)-((1000/sorterChart.randomArray.length)/10);

    sorterChart.draw(ctx);

    for(let i = 0; i < 3; i++){
        ctx.save();
        ctx.globalCompositeOperation = 'xor';
        ctx.font = '42px openSans';
        ctx.textBaseline = 'hanging'
        ctx.fillStyle = 'black';
        ctx.fillText(sorterChart.chartsArray[i].array[0], 20, 575 - sorterChart.height * i - (10 * (sorterChart.chartsArray.length - 1) * i) - sorterChart.height);
        ctx.restore();
    }

    // - End -
    requestAnimationFrame(loop);
}

// -- Add Event Listeners
inputs.sortBtnEl.addEventListener('mousedown', genAndSort);

// -- Functions --

// - Event Functions -
function genAndSort(){
    activeSorts.insert = inputs.insertionSortEl.checked;
    activeSorts.merge = inputs.mergeSortEl.checked;
    activeSorts.quick = inputs.quickSortEl.checked;

    activeSorts.string = [];
    let array = new Array();

    if(activeSorts.insert) activeSorts.string.push('Insertion Sort');
    if(activeSorts.merge) activeSorts.string.push('Merge Sort');
    if(activeSorts.quick) activeSorts.string.push('Quick Sort');

    for(let n = 0; n < activeSorts.string.length; n++){
        array.push({array:[], activeItem: 0, secondaryItems: [-1,-1]});
    }

    if(activeSorts.string.length > 0) sorterChart.createChart(parseInt(inputs.columnNumListEl.value), array);
}

// - Functions -