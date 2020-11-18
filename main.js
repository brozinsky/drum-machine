const playBtn = document.querySelector('.play');
const pads = document.querySelectorAll('.pad');
const soloBtns = document.querySelectorAll('.solo');
const muteBtns = document.querySelectorAll('.mute');

const currentStep = document.querySelectorAll('.step');
const sampleBtns = document.querySelectorAll('.light');
const activeCh1 = document.querySelector('.ch-1__light');
const activeCh2 = document.querySelector('.ch-2__light');
const activeCh3 = document.querySelector('.ch-3__light');
const activeCh4 = document.querySelector('.ch-4__light');
const ch1Sample = document.querySelector('.ch1__sample');
const ch2Sample = document.querySelector('.ch2__sample');
const ch3Sample = document.querySelector('.ch3__sample');
const ch4Sample = document.querySelector('.ch4__sample');
const playIcon = document.getElementById('play-icon');
const selectElements = document.querySelectorAll('select');

let index = 0;
let isPlaying = null;
let bpm = 120;
let interval = (60 / bpm / 2) * 1000;

function selectSample(e) {
    const selectedChannel = e.target.name;
    const sampleSource = e.target.value;

    switch (selectedChannel) {
        case 'ch-1__select':
            ch1Sample.src = sampleSource;
            break;
        case 'ch-2__select':
            ch2Sample.src = sampleSource;
            break;
        case 'ch-3__select':
            ch3Sample.src = sampleSource;
            break;
        case 'ch-4__select':
            ch4Sample.src = sampleSource;
            break;
    }
};
selectElements.forEach(select => {
    select.addEventListener('change', function (e) { selectSample(e) })
});

function trySample(e) {
    const channel = e.target.dataset.ch;
    playSample(channel);
};

sampleBtns.forEach(sampleBtn => {
    sampleBtn.addEventListener('click', function (e) { trySample(e) })
});

function playSample(sample) {
    switch (sample) {
        case '1':
            ch1Sample.currentTime = 0;
            ch1Sample.play();
            blink(activeCh1);
            break;
        case '2':
            ch2Sample.play();
            ch2Sample.currentTime = 0;
            blink(activeCh2);
            break;
        case '3':
            ch3Sample.play();
            ch3Sample.currentTime = 0;
            blink(activeCh3);
            break;
        case '4':
            ch4Sample.play();
            ch4Sample.currentTime = 0;
            blink(activeCh4);
            break;
    }
};

function blink(activeCh) {
    gsap.from(activeCh, {
        backgroundColor: '#fff',
        duration: interval / 1000,
    });
};

function repeat() {
    let step = index % 16;
    const activeBars = document.querySelectorAll(`.s${step}`);
    activeBars.forEach(bar => {
        if (bar.classList.contains('active') && !bar.classList.contains('muted')) {
            let sample = bar.dataset.ch;
            playSample(sample);
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

soloBtns.forEach(soloBtn => {
    soloBtn.addEventListener("click", (e) => {

        // solo channel by muting other channels
        // const currentChannel = e.target.classList[0].slice(0, 4);
        const currentChannel = e.target.dataset.ch;

        pads.forEach(pad => {
            const channelPad = pad.dataset.ch;
            pad.classList.remove('muted');
            if (channelPad !== currentChannel && soloBtn.classList[1] !== 'solo--active') {
                pad.classList.add('muted')
            }
        });

        // update solo state
        if (soloBtn.classList[1] == 'solo--active') {
            soloBtns.forEach(soloBtn => {
                soloBtn.classList.remove('solo--active');
            });
        } else {
            soloBtns.forEach(soloBtn => {
                soloBtn.classList.remove('solo--active');
            });
            soloBtn.classList.toggle('solo--active');

            // toggle mute when soloed
            muteBtns.forEach(muteBtn => {
                muteBtn.classList.remove('mute--active');
            });
        }
    });
});

muteBtns.forEach(muteBtn => {
    muteBtn.addEventListener("click", (e) => {
        // reset solo button state and all muted pads
        soloBtns.forEach(soloBtn => {
            if (soloBtn.classList[1] == 'solo--active') {
                pads.forEach(pad => {
                    pad.classList.remove('muted')
                });
            }
            soloBtn.classList.remove('solo--active');
        });

        // update mute state
        muteBtn.classList.toggle('mute--active');

        // toggle pad btns to mute
        const currentChannel = e.target.dataset.ch;
        pads.forEach(pad => {
            const channelPad = pad.dataset.ch;
            if (channelPad == currentChannel) {
                pad.classList.toggle('muted')
            }
        });
    });
});