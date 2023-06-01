const $ = document.querySelector.bind(document);
const TIME_LIMIT = 20;
const LINE_WIDTH = 100;
const WARNING_TIME = 10;
const ALERT_TIME = 5;
const timer = $(".timer__base")
const progressbar = $(".progressbar")

let timeLeft;
let timePassed = 0;
let timerInterval = null;
let width;

function timerOnStartUpdate() {
    if (localStorage.getItem('time')) {
        timePassed = Number(localStorage.getItem('time'));
    } else timePassed = 0;
    if (localStorage.getItem('width')) {
        width = localStorage.getItem('width');
    } else width = 100;
    setRemainingPathColor(TIME_LIMIT - timePassed)
    progressbar.style.width = width + "%";
    timer.innerHTML = ` <span id="timer__base-label" class="timer__base__label">${TIME_LIMIT-timePassed}</span>`
    startTimer();
    if (btnNext.classList.contains('active')) {
        onTimesLeft();
    }
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
    if (localStorage.getItem('time')) {
        timePassed = Number(localStorage.getItem('time'));
    } else timePassed = 0;

    setRemainingPathColor(TIME_LIMIT - timePassed);
    timer.innerHTML = ` <span id="timer__base-label" class="timer__base__label">${TIME_LIMIT-timePassed}</span>`
    timerInterval = setInterval(() => {
        timePassed += 1;
        timeLeft = TIME_LIMIT - timePassed;
        if (timeLeft < 0) {
            timePassed -= 1
            timeLeft += 1;
        }
        localStorage.setItem('time', timePassed)
        document.getElementById("timer__base-label").innerHTML =
            timeLeft;
        setRemainingPathColor(timeLeft);
        moveProgressBar();
        if (timeLeft <= 0) {
            onTimesUp();
        }
    }, 1000);
}

function setRemainingPathColor(timeLeft) {
    if (timeLeft <= ALERT_TIME) {
        progressbar.classList.remove('warning');
        progressbar.classList.add('alert');
        timer.classList.remove('warning')
        timer.classList.add('alert')
    } else if (timeLeft <= WARNING_TIME) {
        progressbar.classList.add('warning');
        timer.classList.add('warning')
    } else {
        progressbar.classList.remove('warning');
        progressbar.classList.remove('alert');
        timer.classList.remove('warning')
        timer.classList.remove('warning')
    }
}