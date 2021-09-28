// Global Functions
function docGetID(id) {
    return document.getElementById(id);
}

function docGetClass(className) {
    return document.getElementsByClassName(className);
}

function dropdownToggle(toggle, array) {
    toggle = !toggle;
    if(toggle == true){
        for(let n = 0; n < array.length; n++){
            array[n].classList.add("smallDropdown");
        }
    }
    if(toggle == false){
        for(let n = 0; n < array.length; n++){
            array[n].classList.remove("smallDropdown");
        }
    }
    return toggle;
}

// 