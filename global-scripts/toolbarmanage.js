// Dropdown Manager Script by Timothy V

// -- Initialize Variables --

// - HTML Element References -
// Button array on dropdown menu
let buttonsArrayEl = docGetClass("dropdownButton");

// Dropdown Buttons
let gravSimBtnEl = replaceHTML('gravitySimBtn', 'Basic Gravity Simulator');
let mazeGenBtnEl = replaceHTML('mazeGenBtn', 'Random Maze Generator');
let gridSnapBtnEl = replaceHTML('gridSnapBtn', 'Pixel Art Experiment');

// Toolbar Buttons
let projectBtnEl = docGetID("projectsBtn");
let homeBtnEl = docGetID("homeBtn");

// - Global Variables -
let dropdownToggleBool = true;

// -- Add Event Listeners --
projectBtnEl.addEventListener('click', function() {
    dropdownToggleBool = dropdownToggle(dropdownToggleBool, buttonsArrayEl)
});

if(!homeBtnEl.classList.contains("active")){
    homeBtnEl.addEventListener('click', gotoHome);
}

gravSimBtnEl.addEventListener('click', function() {
    location.replace('../gravitySim/');
});

mazeGenBtnEl.addEventListener('click', function() {
    location.replace('../randomMaze/');
});

gridSnapBtnEl.addEventListener('click', function() {
    location.replace('../gridSnapping/');
});