let stepIndex = 0
let steps = document.querySelectorAll(".step")

function nextStep() {
    steps[stepIndex].classList.remove("visible")
    stepIndex = stepIndex + 1
    steps[stepIndex].classList.add("visible")
}

document.querySelector("#instructions-next").addEventListener('click', () => {
    nextStep()
})