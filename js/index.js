const {ipcRenderer} = require('electron')
const {shuffle} = require('./utils.js')

let stepIndex = 0
let steps = document.querySelectorAll(".step")

let imagePool;
let selectedImages = [];

let targetImage;

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
    /*
    for(var i = 0; i < 5; i++) {
        var selected = Math.floor(Math.random() * imagePool.length)

        //make sure we dont select the same image twice
        while(selectedImages.includes(selected)) {
            selected = Math.floor(Math.random() * imagePool.length)
        }
        selectedImages.push(selected)
    }

    
    console.log("Selected five: " + selectedImages)
    */

    //update target reference number
    document.querySelector("#trn").innerHTML = genTrn()

    nextStep()
})

document.querySelector("#tasking-done").addEventListener('click', () => {

    //select the target
    targetImage = Math.floor(Math.random() * imagePool.length)
    selectedImages.push(targetImage)

    //find other 4 images
    for(var i = 0; i < 4; i++) {
        var selected = Math.floor(Math.random() * imagePool.length)

        //make sure we dont select the same image twice
        while(selectedImages.includes(selected)) {
            selected = Math.floor(Math.random() * imagePool.length)
        }
        selectedImages.push(selected)
    }

    //shuffle
    selectedImages = shuffle(selectedImages)

    //fill the gallery with the selected images
    var gallery = document.querySelector(".gallery")
    for(var i = 0; i < 5; i++) {
        var img = document.createElement("img")
        img.src = "./resources/pool/" + imagePool[selectedImages[i]]
        img.dataset.imageIndex = imagePool[selectedImages[i]]
        img.addEventListener('click', (e) => {
            ipcRenderer.send("open-img", e.target.dataset.imageIndex)
        })
        img.classList.add("gallery-img")
        gallery.appendChild(img)
    }

    nextStep()
})

document.querySelector("#finish").addEventListener('click', () => {

    var galleryImages = document.querySelectorAll(".gallery-img")
    for(var i = 0; i < 5; i++) {
        if(galleryImages[i].dataset.imageIndex == imagePool[targetImage]) {
            galleryImages[i].classList.add("selected")
            break;
        }
    }
    //var targetIndex = Math.floor(Math.random() * galleryImages.length)

    var finishBtn = document.querySelector("#finish")
    finishBtn.disabled = true

    ipcRenderer.send("open-img", imagePool[targetImage])

})
