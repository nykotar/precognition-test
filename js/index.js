const {ipcRenderer} = require('electron')

let stepIndex = 0
let steps = document.querySelectorAll(".step")

let imagePool;
let selectedImages = [];

function nextStep() {
    steps[stepIndex].classList.remove("visible")
    stepIndex = stepIndex + 1
    steps[stepIndex].classList.add("visible")
}

function getFourDigits() {
    var digits = ""
    for(var i = 0; i < 4; i++) {
        digits = digits + Math.floor(Math.random() * 10)
    }
    return digits
}

function genTrn() {
    return getFourDigits() + "-" + getFourDigits()
}

document.querySelector("#instructions-next").addEventListener('click', () => {

    //Select images
    imagePool = ipcRenderer.sendSync("get-image-pool")
    
    for(var i = 0; i < 5; i++) {
        selectedImages.push(Math.floor(Math.random() * imagePool.length))
    }

    
    console.log("Selected five: " + selectedImages)

    //update target reference number
    document.querySelector("#trn").innerHTML = genTrn()

    nextStep()
})