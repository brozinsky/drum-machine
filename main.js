const playBtn = document.querySelector('.play');
const pads = document.querySelectorAll('.pad');
const soloBtns = document.querySelectorAll('.solo');
const muteBtns = document.querySelectorAll('.mute');

const currentStep = document.querySelectorAll('.step');
const ch1Sample = document.querySelector('.ch1-sample');
const ch2Sample = document.querySelector('.ch2-sample');
const ch3Sample = document.querySelector('.ch3-sample');
const playIcon = document.getElementById('play-icon');

let index = 0;
let isPlaying = null;
let bpm = 120;
let interval = (60 / bpm / 2) * 1000;


function repeat() {
    let step = index % 16;
    const activeBars = document.querySelectorAll(`.s${step}`);
    activeBars.forEach(bar => {
        if (bar.classList.contains('active') && !bar.classList.contains('muted')) {
            if (bar.classList.contains('ch-1__pad')) {
                ch1Sample.currentTime = 0;
                ch1Sample.play();
            }
            if (bar.classList.contains('ch-2__pad')) {
                ch2Sample.play();
                ch2Sample.currentTime = 0;
            }
            if (bar.classList.contains('ch-3__pad')) {
                ch3Sample.play();
                ch3Sample.currentTime = 0;
            }
        }
    });
    const activeStep = document.querySelectorAll(`.s${step}__step`);
    activeStep.forEach(step => {
        step.classList.add('step--active');
        setTimeout(() => {
            step.classList.remove('step--active');
        }, interval);
    });
    index++;
};

function start() {
    if (!isPlaying) {
        isPlaying = setInterval(() => {
            repeat();
        }, interval);
    } else {
        clearInterval(isPlaying);
        isPlaying = null;
    }
};

function updateBtn() {
    if (!isPlaying) {
        playIcon.classList.add('fa-play-circle')
        playIcon.classList.remove('fa-stop-circle')
    } else {
        playIcon.classList.add('fa-stop-circle')
        playIcon.classList.remove('fa-play-circle')
    }
};

playBtn.addEventListener('click', function () {
    start();
    updateBtn();
});

pads.forEach(pad => {
    pad.addEventListener("click", () => {
        pad.classList.toggle('active');
    });
});