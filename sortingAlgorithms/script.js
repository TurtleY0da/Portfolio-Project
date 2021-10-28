// Sorting Algorithm Exeriment by Timothy V 

// -- Initialize Variables --

// HTML Elements
let cnv = docGetID("sortingCanvas");

let inputs = {
    columnNumListEl: docGetID("columnNumIn"),
    sortBtnEl: docGetID("sortBtn"),
    insertionSortEl: docGetID("insSortCheckbox"),
    mergeSortEl: docGetID("mrgSortCheckbox"),
    quickSortEl: docGetID("qukSortCheckbox"),
    waitEl: docGetID('waitCheckbox')
}

// Glbl Variables
let openSans = new FontFace('openSans', 'url(../fonts/OpenSans-SemiBold.ttf)');

let running = true;

// Item: {array:[], activeItem: 0, secondaryItems: [-1,-1]}
let sorterChart = new sortingChart(100, [{array:[], activeItem: 0, secondaryItems: [-1,-1]}, {array:[], activeItem: 0, secondaryItems: [-1,-1]}, {array:[], activeItem: 0, secondaryItems: [-1,-1]}], ready);

let sorted = false;

let activeSorts = {
    insert: true,
    merge: true,
    quick: true,
    wait: false,
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

    for(let i = 0; i < sorterChart.chartsArray.length; i++){
        ctx.save();
        ctx.globalCompositeOperation = 'xor';
        ctx.font = '42px openSans';
        ctx.textBaseline = 'hanging'
        ctx.fillStyle = 'black';
        ctx.fillText(activeSorts.string[i], 20, 575 - sorterChart.height * i - (10 * (sorterChart.chartsArray.length - 1) * i) - sorterChart.height);
        ctx.restore();
    }

    // - End -
    requestAnimationFrame(loop);
}

// -- Add Event Listeners
inputs.sortBtnEl.addEventListener('mousedown', genAndSort);

// -- Functions --

// - Event Functions -
async function genAndSort(){
    if(running) return;

    running = true;
    activeSorts.wait = inputs.waitEl.checked;
    if(sorted){
        activeSorts.insert = inputs.insertionSortEl.checked;
        activeSorts.merge = inputs.mergeSortEl.checked;
        activeSorts.quick = inputs.quickSortEl.checked;
    }

    activeSorts.string = [];
    let array = new Array();

    if(activeSorts.insert) activeSorts.string.push('Insertion Sort');
    if(activeSorts.merge) activeSorts.string.push('Merge Sort');
    if(activeSorts.quick) activeSorts.string.push('Quick Sort');

    for(let n = 0; n < activeSorts.string.length; n++){
        array.push({array:[], activeItem: 0, secondaryItems: [-1,-1]});
    }

    if(activeSorts.string.length > 0){
        if(sorted){
            await sorterChart.createChart(parseInt(inputs.columnNumListEl.value), array);
        } else {
            sorted = true;
        }

        if(activeSorts.wait){
            for(let n = 0; n < activeSorts.string.length; n++){
                if(activeSorts.string[n][0] === 'I') await sorterChart.asyncInsertionSort(n);
                if(activeSorts.string[n][0] === 'M') await sorterChart.asyncMergeSort(n);
                if(activeSorts.string[n][0] === 'Q') await sorterChart.asyncQuickSort(n, 0, sorterChart.randomArray.length - 1);
            }
        } else {
            let sorterArray = new Array();
            for(let n = 0; n < activeSorts.string.length; n++){
                if(activeSorts.string[n][0] === 'I') sorterArray.push(sorterChart.asyncInsertionSort(n));
                if(activeSorts.string[n][0] === 'M') sorterArray.push(sorterChart.asyncMergeSort(n)); 
                if(activeSorts.string[n][0] === 'Q') sorterArray.push(sorterChart.asyncQuickSort(n, 0, sorterChart.randomArray.length - 1)); 
            }

            let length = sorterArray.length;

            for(let i = 0; i < 3-length; i++){
                sorterArray.push(null);
            }

            await Promise.all(sorterArray);
        }
    }
    
    running = false;
}

// - Functions -

function ready() {
    running = false;
}