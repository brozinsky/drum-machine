const playBtn = document.querySelector('.play');
const pads = document.querySelectorAll('.pad');
const soloBtns = document.querySelectorAll('.solo');
const muteBtns = document.querySelectorAll('.mute');

const currentStep = document.querySelectorAll('.step');
const sampleBtns = document.querySelectorAll('.light');
const ch1Sample = document.querySelector('.ch1-sample');
const ch2Sample = document.querySelector('.ch2-sample');
const ch3Sample = document.querySelector('.ch3-sample');
const ch4Sample = document.querySelector('.ch4-sample');
const playIcon = document.getElementById('play-icon');
const selectElements = document.querySelectorAll('select');

let index = 0;
let isPlaying = null;
let bpm = 120;
let interval = (60 / bpm / 2) * 1000;

// const activeBtns = document.querySelectorAll('.light');
// activeBtns.forEach(activeBtn => {
//     activeBtn.addEventListener("click", (e) => {
//         console.log(e.target);
//     })

// })

function activeChannel(e) {
    console.log(e.target.classList[0])
    const channel = e.target.classList;

    if (e.target.classList.contains('ch-1')) {
        ch1Sample.currentTime = 0;
        ch1Sample.play();
        console.log('dziala?')
    }
    else if (channel.contains('ch-2__light')) {
        ch2Sample.play();
        ch2Sample.currentTime = 0;
    }
    else if (channel.contains('ch-3')) {
        ch3Sample.play();
        ch3Sample.currentTime = 0;
    } else if (channel.contains('ch-4')) {
        ch4Sample.play();
        ch4Sample.currentTime = 0;
    }
};

sampleBtns.forEach(sampleBtn => {
    sampleBtn.addEventListener('click', function (e) { activeChannel(e) })
})

function selectSample(e) {
    const selectedChannel = e.target.name;
    const sampleSource = e.target.value;
    if (selectedChannel == 'ch-1__select') {
        ch1Sample.src = sampleSource;
    } else if (selectedChannel == 'ch-2__select') {
        ch2Sample.src = sampleSource;
    } else if (selectedChannel == 'ch-3__select') {
        ch3Sample.src = sampleSource;
    } else if (selectedChannel == 'ch-4__select') {
        ch4Sample.src = sampleSource;
    }
};

selectElements.forEach(select => {
    select.addEventListener('change', function (e) { selectSample(e) })
})

function repeat() {
    let step = index % 16;
    const activeBars = document.querySelectorAll(`.s${step}`);
    activeBars.forEach(bar => {
        if (bar.classList.contains('active') && !bar.classList.contains('muted')) {
            if (bar.classList.contains('ch-1__pad')) {
                ch1Sample.currentTime = 0;
                ch1Sample.play();
            }
            else if (bar.classList.contains('ch-2__pad')) {
                ch2Sample.play();
                ch2Sample.currentTime = 0;
            }
            else if (bar.classList.contains('ch-3__pad')) {
                ch3Sample.play();
                ch3Sample.currentTime = 0;
            } else if (bar.classList.contains('ch-4__pad')) {
                ch4Sample.play();
                ch4Sample.currentTime = 0;
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

soloBtns.forEach(soloBtn => {
    soloBtn.addEventListener("click", (e) => {

        // solo channel by muting other channels
        const currentChannel = e.target.classList[0].slice(0, 4);
        pads.forEach(pad => {
            pad.classList.remove('muted');
            if (`${pad.classList[0].slice(0, 4)}` !== currentChannel && soloBtn.classList[2] !== 'solo--active') {
                pad.classList.add('muted')
            }
        });

        // update solo state
        if (soloBtn.classList[2] == 'solo--active') {
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
            if (soloBtn.classList[2] == 'solo--active') {
                console.log('jesten');
                pads.forEach(pad => {
                    pad.classList.remove('muted')
                });
            }
            soloBtn.classList.remove('solo--active');
        });

        // update mute state
        muteBtn.classList.toggle('mute--active');

        // toggle pad btns to mute each time button is clicked
        const channelPads = document.querySelectorAll(`.${e.target.classList[0].slice(0, 4)}__pad`);
        channelPads.forEach(channelPad => {
            channelPad.classList.toggle('muted')
        });
    });
});