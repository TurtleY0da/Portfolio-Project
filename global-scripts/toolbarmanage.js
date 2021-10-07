// Dropdown Manager Script by Timothy V

// -- Initialize Variables --

// - Create buttons

addDropdownButton('Basic Gravity Simulator').addEventListener('click', function() {
    location.replace('../gravitySim/');
});

addDropdownButton('Random Maze Generator').addEventListener('click', function() {
    location.replace('../randomMaze/');
});

addDropdownButton('Pixel Art Experiment').addEventListener('click', function() {
    location.replace('../gridSnapping/');
});

addDropdownButton('Image Zooming Experiment').addEventListener('click', function() {
    location.replace('../imageZoom/');
});

addDropdownButton('Firework Simulator').addEventListener('click', function() {
    location.replace('../fireworkSim/');
});

// - HTML Element References -
// Button array on dropdown menu
let buttonsArrayEl = docGetClass("dropdownButton");

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