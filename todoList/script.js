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

let interval = setInterval(outputList, 100);

// -- Add Event Listeners
inputs.addBtn.addEventListener('mousedown', addNewItem)

// -- Functions --

// - Event Functions -

// - Functions -

// Output the list
function outputList() {
    refreshArray(allItems);

    orderedItems = JSON.parse(JSON.stringify(allItems));

    orderedItems = orderArray(orderedItems, inputs.sortListEl);

    if(prevLocalStore !== JSON.stringify(localStorage) || prevListChoice !== inputs.sortListEl.value){
        let example = new Array()
        for (const child of docGetID('outputList').children) {
            example.push(child);
        }
        example.forEach(element => {
            element.remove();
        });
        createElements(inputs.sortListEl.value, orderedItems, outputListEl);
        
        let index = 0;
        for (const element of docGetClass('toDoRemoveBtn')){
            element.addEventListener('mousedown', function(event) {
                localStorage.removeItem(event.path[1].children[0].innerText);
                outputList();
            })
            index++;
        }
    }

    prevLocalStore = JSON.stringify(localStorage);
    prevListChoice = inputs.sortListEl.value;
    
}

function addNewItem() {
    try {

        if (inputs.titleEl.value.trim() === '') {
            throw (0);
        } else if (localStorage[inputs.titleEl.value.trim()] !== undefined) {
            throw (1);
        } else {
            localStorage[inputs.titleEl.value.trim()] = JSON.stringify([inputs.descriptionEl.value.trim(), inputs.dateEl.value, inputs.priorityListEl.value]);

            inputs.titleEl.value = '';
            inputs.descriptionEl.value = '';
            inputs.dateEl.value = '';

            inputs.titleEl.style = 'border: 1px solid grey'
            inputs.titleEl.placeholder = 'Title'

            outputList();
        }

    } catch (error) {
        switch (error) {
            case 0:
                inputs.titleEl.style = 'border: 2px solid #ff0000'
                inputs.titleEl.placeholder = 'Missing Title'
                break;
            case 1:
                inputs.titleEl.value = '';
                inputs.titleEl.style = 'border: 2px solid #ff0000'
                inputs.titleEl.placeholder = 'Duplicate Title'
                break;
        }
    }
}