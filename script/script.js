"use strict";

const quiz = $(".quiz__window");
const menu = $(".menu")
const btnNext = $(".quiz__next-btn");
const btnRestart = $(".result__restart");
const themeSwitcher = $(".toggle-theme-button");
const lightGameBtn = $(".menu__button.lightGame");
const middleGameBtn = $(".menu__button.middleGame");
const hardGameBtn = $(".menu__button.hardGame");
const btnBackToMenu = $(".result__back-to-menu");
let questions;
let userScore;
let count;
let userAnswersCount;
let userAnswerList = [];
let quizStart;
let difficultyLevel;

if (localStorage.getItem('theme')) {
    document.body.classList.toggle('dark-theme');
}

if (localStorage.getItem('quizStart')) {
    quizStart = true;
} else quizStart = false;

if (localStorage.getItem('difficultyLevel')) {
    difficultyLevel = localStorage.getItem('difficultyLevel');
}

if (quizStart == false) {
    menu.classList.remove('hidden');
    lightGameBtn.addEventListener('click', lightDifficulty);
    middleGameBtn.addEventListener('click', middleDifficulty);
    hardGameBtn.addEventListener('click', hardDifficulty);
} else startQuiz(difficultyLevel);

function lightDifficulty() {
    const light = 0;
    localStorage.setItem('difficultyLevel', light)
    startQuiz(light);
}

function middleDifficulty() {
    const middle = 1;
    localStorage.setItem('difficultyLevel', middle)
    startQuiz(middle);
}

function hardDifficulty() {
    const hard = 2;
    localStorage.setItem('difficultyLevel', hard)
    startQuiz(hard);
}

function startQuiz(level) {
    if (level == 0) {
        questions = questions1;
    }
    if (level == 1) {
        questions = questions2;
    }
    if (level == 2) {
        questions = questions3;
    }
    quizStart = true;
    menu.classList.add("hidden");
    localStorage.setItem('quizStart', quizStart);

    if (localStorage.getItem('index') != 0 && localStorage.getItem('index') <= questions.length) {
        count = localStorage.getItem('index');
    } else count = 0;

    if (localStorage.getItem('score')) {
        userScore = localStorage.getItem('score');
    } else userScore = 0;

    if (localStorage.getItem('localuserAnswersCount')) {
        userAnswersCount = localStorage.getItem('localUserAnswersCount');
    } else userAnswersCount = 0;

    if (localStorage.getItem('localUserAnswers')) {
        userAnswerList = localStorage.getItem('localUserAnswers').split(',');
    } else userAnswerList = [];

    if (count == questions.length) {
        const result = $(".result");
        const resultText = $(".result__text");
        result.classList.remove('hidden');
        quiz.classList.add('hidden');
        resultText.innerHTML = `RESULT :${userScore} / ${questions.length}`
    }

    if (typeof questions !== 'undefined' && questions.length > 0 && count < questions.length && quizStart == true) {
        quiz.classList.remove('hidden');
        localStorage.setItem('index', count);
        localStorage.setItem('score', userScore);
        showQuestion(count);
    }

    timerOnStartUpdate();
    btnNext.addEventListener('click', nextQuestion);
    btnRestart.addEventListener('click', restartQuiz);
    themeSwitcher.addEventListener('click', toggleTheme);
    btnBackToMenu.addEventListener('click', backToMenu)
}

function showQuestion(index) {
    const title = $(".quiz__title");
    const list = $(".quiz__list");
    const progress = $(".quiz__progress");

    title.innerHTML = `${questions[index].question}`;
    list.innerHTML = '';

    if (questions[index].answers.length > 1) {
        const text = ` (Choose multiple answers)`
        title.insertAdjacentHTML("beforeend", text)
    }

    questions[index].choices.forEach(item => {
        const text = `<li class="quiz__choice">${item}</li>`;
        list.insertAdjacentHTML("beforeend", text)
    })

    const choices = list.querySelectorAll(".quiz__choice");
    choices.forEach(item => item.setAttribute("onclick", "handleChoice(this)"));

    progress.innerHTML = `QUESTION ${Number(index)+1} / ${questions.length}`;

    btnNext.classList.remove('active');

    for (let i of userAnswerList) {
        handlePreviousChoice(i);
    }
};

function handleChoice(answer) {
    const userAnswer = answer.textContent;
    const correctAnswers = questions[count].answers;
    const choices = document.querySelectorAll(".quiz__choice");

    if (!userAnswerList.includes(userAnswer)) {
        userAnswersCount += 1;
        userAnswerList.push(userAnswer)
        localStorage.setItem('localUserAnswers', userAnswerList)
    }

    if (correctAnswers.includes(userAnswer)) {
        answer.classList.add("correct");
    } else {
        answer.classList.add("incorrect");
        choices.forEach(item => {
            if (correctAnswers.includes(item.textContent)) {
                item.classList.add("correct");
            }
        });
        userAnswersCount = 0;
        choices.forEach(item => item.classList.add("disabled"));
        onTimesLeft();
        btnNext.classList.add('active');
    }

    if (userAnswersCount == correctAnswers.length) {
        choices.forEach(item => item.classList.add("disabled"));
        userAnswersCount = 0;
        userScore++;
        localStorage.setItem('score', userScore)
        onTimesLeft();
        btnNext.classList.add('active');
    }
}

function handlePreviousChoice(answer) {
    const choices = document.querySelectorAll(".quiz__choice");
    const correctAnswers = questions[count].answers;

    userAnswersCount += 1;
    for (let i in choices) {
        if (choices[i].textContent == answer) {
            if (correctAnswers.includes(answer)) {
                choices[i].classList.add("correct");
            } else {
                choices[i].classList.add("incorrect");
                choices.forEach(item => {
                    if (correctAnswers.includes(item.textContent)) {
                        item.classList.add("correct");
                    }
                });
                userAnswersCount = 0;
                choices.forEach(item => item.classList.add("disabled"));
                btnNext.classList.add('active');
            }
            if (userAnswersCount == correctAnswers.length) {
                choices.forEach(item => item.classList.add("disabled"));
                userAnswersCount = 0;
                btnNext.classList.add('active');
            }
        }
    }
}

function nextQuestion() {
    const choice = $(".quiz__choice");
    const result = $(".result");
    const resultText = $(".result__text");

    userAnswerList = [];
    localStorage.removeItem('localUserAnswers');
    count = localStorage.getItem('index');

    if (count >= questions.length - 1 && choice.classList.contains('disabled')) {
        count++;
        localStorage.setItem('index', count);
        result.classList.remove('hidden');
        quiz.classList.add('hidden');
        resultText.innerHTML = `RESULT :${userScore} / ${questions.length}`
        return;
    }

    if (choice.classList.contains('disabled')) {
        count++;
        localStorage.setItem('index', count);
        showQuestion(count);
        localStorage.removeItem('time');
        localStorage.removeItem('width')
        onTimesLeft();
        startTimer();
    }
}

function restartQuiz() {
    const result = $(".result");

    const level = localStorage.getItem('difficultyLevel');
    count = 0;
    quiz.classList.remove('hidden');
    result.classList.add('hidden');
    localStorage.clear();
    localStorage.setItem('quizStart', 1)
    localStorage.setItem('index', count);
    localStorage.setItem('difficultyLevel', level);
    showQuestion(count);
    onTimesLeft();
    startTimer();
}

function toggleTheme() {
    if (localStorage.getItem('theme')) {
        document.body.classList.remove('dark-theme')
        localStorage.removeItem('theme')
    } else {
        document.body.classList.toggle('dark-theme')
        localStorage.setItem('theme', "dark-theme")
    }
}

function backToMenu() {
    const result = $(".result");

    count = 0;
    localStorage.clear();
    onTimesLeft();
    localStorage.setItem('index', count);
    menu.classList.remove('hidden');
    result.classList.add('hidden');
    lightGameBtn.addEventListener('click', lightDifficulty);
    middleGameBtn.addEventListener('click', middleDifficulty);
    hardGameBtn.addEventListener('click', hardDifficulty);
}