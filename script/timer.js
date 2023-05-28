const TIME_LIMIT = 20;
const LINE_WIDTH = 100;
const WARNING_TIME = 10;
const ALERT_TIME = 5;
let timeLeft;
// let width;
let timePassed;
progressbar = $(".progressbar")
let timerInterval = null;
if (localStorage.getItem('time')) {
    timePassed = Number(localStorage.getItem('time'));
} else timePassed = 0;
if (localStorage.getItem('width')) {
    width = localStorage.getItem('width');
} else width = 100;


// let remainingPathColor = COLOR_CODES.info.color;
progressbar.style.width = width + "%";
timer = $(".base-timer")
timer.innerHTML = ` <span id="base-timer-label" class="base-timer__label">${formatTime(TIME_LIMIT-timePassed)}</span>`





startTimer();
if (btnNext.classList.contains('active')) {
    onTimesLeft();
}

function onTimesUp() {
    const correctAnswers = questions[count].answers;
    const choices = document.querySelectorAll(".quiz__choice");
    clearInterval(timerInterval);
    choices.forEach(item => {
        if (correctAnswers.includes(item.textContent)) {
            item.classList.add("correct");
            userAnswerList.push(item.textContent)
            localStorage.setItem('localUserAnswers', userAnswerList)
        }
    });
    choices.forEach(item => item.classList.add("disabled"));
    btnNext.classList.add('active');
}

function onTimesLeft() {
    clearInterval(timerInterval);
}

function moveProgressBar() {
    if (width > 0) {
        width = width - (100 / TIME_LIMIT);
    } else width = 0;
    localStorage.setItem('width', width);
    progressbar.style.width = width + "%";
}

function startTimer() {
    if (localStorage.getItem('width')) {
        width = localStorage.getItem('width');
    } else width = 100;
    progressbar.style.width = width + "%";
    setRemainingPathColor(timeLeft);
    if (localStorage.getItem('time')) {
        timePassed = Number(localStorage.getItem('time'));
    } else timePassed = 0;
    timer = $(".base-timer")
    timer.innerHTML = ` <span id="base-timer-label" class="base-timer__label">${formatTime(TIME_LIMIT-timePassed)}</span>`
    timerInterval = setInterval(() => {

        timePassed += 1;
        timeLeft = TIME_LIMIT - timePassed;
        if (timeLeft < 0) {
            timePassed -= 1
            timeLeft += 1;
        }
        localStorage.setItem('time', timePassed)
        document.getElementById("base-timer-label").innerHTML = formatTime(
            timeLeft
        );
        moveProgressBar();
        setRemainingPathColor(timeLeft);
        if (timeLeft <= 0) {
            onTimesUp();
        }
    }, 1000);
}

function formatTime(time) {
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;

    if (seconds < 10) {
        seconds = `0${seconds}`;
    }

    return `${minutes}:${seconds}`;
}

function setRemainingPathColor(timeLeft) {
    if (timeLeft <= ALERT_TIME) {
        progressbar.classList.remove('warning');
        progressbar.classList.add('alert');
    } else if (timeLeft <= WARNING_TIME) {
        progressbar.classList.remove('info');
        progressbar.classList.add('warning');
    }
}