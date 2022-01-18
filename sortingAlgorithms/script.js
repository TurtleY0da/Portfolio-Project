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
// Add custom font
document.fonts.add(openSans);

requestAnimationFrame(loop);

function loop() {
    // - Update Variables -


    // - Draw -
    // Clear background
    ctx.clearRect(0, 0, cnv.width, cnv.height);
    // Set line width
    ctx.lineWidth = (1000/sorterChart.randomArray.length)-((1000/sorterChart.randomArray.length)/10);
    // Draw the chart
    sorterChart.draw(ctx);
    // For each sorter
    for(let i = 0; i < sorterChart.chartsArray.length; i++){
        // Draw name
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
    // If currently sorting, don't do anything
    if(running) return;
    // Otherwise
    // Set values
    running = true;
    activeSorts.wait = inputs.waitEl.checked;
    // If already sorted, get active sorters
    if(sorted){
        activeSorts.insert = inputs.insertionSortEl.checked;
        activeSorts.merge = inputs.mergeSortEl.checked;
        activeSorts.quick = inputs.quickSortEl.checked;
    }
    // Set more values
    activeSorts.string = [];
    let array = new Array();

    if(activeSorts.insert) activeSorts.string.push('Insertion Sort');
    if(activeSorts.merge) activeSorts.string.push('Merge Sort');
    if(activeSorts.quick) activeSorts.string.push('Quick Sort');
    // For each sorter, create an object
    for(let n = 0; n < activeSorts.string.length; n++){
        array.push({array:[], activeItem: 0, secondaryItems: [-1,-1]});
    }
    // If any box is ticked
    if(activeSorts.string.length > 0){
        // If already sorted
        if(sorted){
            // Create a new chart
            await sorterChart.createChart(parseInt(inputs.columnNumListEl.value), array);
        } else { // Otherwise
            // Set sorted to true
            sorted = true;
        }
        // If wait is ticked
        if(activeSorts.wait){
            // For each sorter
            for(let n = 0; n < activeSorts.string.length; n++){
                // If sorter is active, wait until previous is done before starting next
                if(activeSorts.string[n][0] === 'I') await sorterChart.asyncInsertionSort(n);
                if(activeSorts.string[n][0] === 'M') await sorterChart.asyncMergeSort(n);
                if(activeSorts.string[n][0] === 'Q') await sorterChart.asyncQuickSort(n, 0, sorterChart.randomArray.length - 1);
            }
        } else { // Otherwise
            let sorterArray = new Array();
            // For each sorter
            for(let n = 0; n < activeSorts.string.length; n++){
                // If sorter is active, add function to array
                if(activeSorts.string[n][0] === 'I') sorterArray.push(sorterChart.asyncInsertionSort(n));
                if(activeSorts.string[n][0] === 'M') sorterArray.push(sorterChart.asyncMergeSort(n)); 
                if(activeSorts.string[n][0] === 'Q') sorterArray.push(sorterChart.asyncQuickSort(n, 0, sorterChart.randomArray.length - 1)); 
            }

            let length = sorterArray.length;
            // Add null to empty positions
            // I forget why I did this
            for(let i = 0; i < 3-length; i++){
                sorterArray.push(null);
            }
            // Await until all sorter are done running at the same time
            await Promise.all(sorterArray);
        }
    }
    // Set running to false
    running = false;
}

// - Functions -

function ready() {
    // Set running to false
    running = false;
}