let experimentSpanEl = docGetID("experimentSpan");
let playBtn = docGetID("playBtn");

let choices = [
    "with Gravity",
    "with Mazes",
    "around with some Pixel Art",
    "with an Image",
    "with some Fireworks",
    "Minesweeper",
    "with a Schedule",
    "with a handy Sorter",
    "with Tech Trees"
]

let randNum = Math.floor(Math.random() * 9)

experimentSpanEl.innerHTML = choices[randNum];

playBtn.addEventListener('click', clickManager);

function clickManager() {
    switch (randNum) {
        case 0:
            location.replace("../gravitySim/");
            break;
        case 1:
            location.replace("../randomMaze/");
            break;
        case 2:
            location.replace("../gridSnapping/");
            break;
        case 3:
            location.replace("../imageZoom/");
            break;
        case 4:
            location.replace("../fireworkSim/");
            break;
        case 5:
            location.replace("../minesweeper/");
            break;
        case 6:
            location.replace("../todoList/");
            break;
        case 7:
            location.replace("../sortingAlgorithms/");
            break;
        case 8:
            location.replace("../techTree/");
            break;
    }
}