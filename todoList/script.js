// To Do List by Timothy V 

// -- Initialize Variables --

// HTML Elements
let inputs = {
    titleEl: docGetID('titleIn'),
    descriptionEl: docGetID('descriptionIn'),
    dateEl: docGetID('dateIn'),
    priorityListEl: docGetID('priorityList'),
    addBtn: docGetID('toDoAddBtn'),
    sortListEl: docGetID('sortList')
}

let outputListEl = docGetID('outputList');

let allItems = new Array();

let orderedItems = new Array();

let prevLocalStore = new String;
let prevListChoice = 'date';

// Glbl Variables
// Every 100 ms, update the list
let interval = setInterval(outputList, 100);

// -- Add Event Listeners
inputs.addBtn.addEventListener('mousedown', addNewItem)

// -- Functions --

// - Functions -

// Output the list
function outputList() {
    // Refresh the items
    refreshArray(allItems);
    // Deep copy the item (the wrong way)
    orderedItems = JSON.parse(JSON.stringify(allItems));
    // Order the items
    orderedItems = orderArray(orderedItems, inputs.sortListEl);
    // If the previous localStorage state is different than the state of the current localStorage, or previous sort choice is different than the current sort choice
    if(prevLocalStore !== JSON.stringify(localStorage) || prevListChoice !== inputs.sortListEl.value){
        // Delet all of the elements
        let example = new Array()
        for (const child of docGetID('outputList').children) {
            example.push(child);
        }
        example.forEach(element => {
            element.remove();
        });
        // Create all of the new elements
        createElements(inputs.sortListEl.value, orderedItems, outputListEl);
        // For every delete button
        for (const element of docGetClass('toDoRemoveBtn')){
            // Add an event listener
            element.addEventListener('mousedown', function(event) {
                // When click, remove this item from local storage, and output the list
                localStorage.removeItem(event.path[1].children[0].innerText);
                outputList();
            })
        }
    }
    // Set values
    prevLocalStore = JSON.stringify(localStorage);
    prevListChoice = inputs.sortListEl.value;
    
}
// Add a new item
function addNewItem() {
    // Try... catch statement
    try {
        // If title input is empty
        if (inputs.titleEl.value.trim() === '') {
            // throw 0
            throw (0);
        } else if (localStorage[inputs.titleEl.value.trim()] !== undefined) { // localStorage slot has content
            // throw 1
            throw (1);
        } else { // Otherwise
            // Add new item to local storage
            localStorage[inputs.titleEl.value.trim()] = JSON.stringify([inputs.descriptionEl.value.trim(), inputs.dateEl.value, inputs.priorityListEl.value]);
            // Reset input values
            inputs.titleEl.value = '';
            inputs.descriptionEl.value = '';
            inputs.dateEl.value = '';
            
            inputs.titleEl.style = 'border: 1px solid grey'
            inputs.titleEl.placeholder = 'Title'
            // Output todo list
            outputList();
        }

    } catch (error) { // If title input is empty, or item already exists
        // Switch statement based on error value
        switch (error) {
            case 0: // If title input is empty
                inputs.titleEl.style = 'border: 2px solid #ff0000'
                inputs.titleEl.placeholder = 'Missing Title'
                break;
            case 1: // If item with this title already exists
                inputs.titleEl.value = '';
                inputs.titleEl.style = 'border: 2px solid #ff0000'
                inputs.titleEl.placeholder = 'Duplicate Title'
                break;
        }
    }
}