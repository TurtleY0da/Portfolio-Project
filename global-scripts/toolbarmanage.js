// Dropdown Manager Script by Timothy V
/*
This script manages the dropdown menu on every single page
*/

// -- Initialize Variables --

// - Create buttons

let sheet = document.getElementById('stylesheet').sheet;

let cssRulesNum = sheet.cssRules.length;

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

addDropdownButton('Minesweeper').addEventListener('click', function() {
    location.replace('../minesweeper/');
});

addDropdownButton('To Do List').addEventListener('click', function() {
    location.replace('../todoList/');
});

addDropdownButton('Sorting Algorithm Experiment').addEventListener('click', function() {
    location.replace('../sortingAlgorithms/');
});

addDropdownButton('Tech Tree Planner').addEventListener('click', function() {
    location.replace('../techTree/');
});

// addDropdownButton('Platformer').addEventListener('click', function() {
//     location.replace('../platformer/');
// });

// - HTML Element References -
// Button array on dropdown menu
let buttonsArrayEl = docGetClass("dropdownButton");

// Toolbar Buttons
let projectBtnEl = docGetID("projectsBtn");
let homeBtnEl = docGetID("homeBtn");

// - Global Variables -
let dropdownToggleBool = true;

// -- Add Event Listeners --
// If "Projects" if clicked, toggle the dropdown menu open/closed
projectBtnEl.addEventListener('click', function() {
    dropdownToggleBool = dropdownToggle(dropdownToggleBool, buttonsArrayEl)
});

// If not on the home page, and the button is clicked, go to the home page
if(!homeBtnEl.classList.contains("active")){
    homeBtnEl.addEventListener('click', gotoHome);
}

// Add CSS Rules procedurally
for (let n = 1; n <= buttonsArrayEl.length; n++) {
    sheet.insertRule(`#dropdownList :nth-child(${n}) div.smallDropdown {transition-delay: 0.${n-1}s;`, cssRulesNum);
}