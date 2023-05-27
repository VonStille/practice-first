"use strict";

const $ = document.querySelector.bind(document);
const quiz = $(".quiz");
const btnNext = $(".quiz__next-btn");
const btnRestart = $(".result__restart");
const themeSwitcher = $(".toggle-theme-button")
let userScore;
let count;
let userAnswersCount;
let userAnswerList = [];

if (localStorage.getItem('theme')) {
    document.body.classList.toggle('dark-theme');

}


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
if (typeof questions !== 'undefined' && questions.length > 0 && count < questions.length) {
    quiz.classList.remove('hidden');
    localStorage.setItem('index', count);
    localStorage.setItem('score', userScore);
    showQuestion(count);
}

btnNext.addEventListener('click', nextQuestion);
btnRestart.addEventListener('click', restartQuiz);
themeSwitcher.addEventListener('click', toggleTheme);

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
        btnNext.classList.add('active');
    }
    if (userAnswersCount == correctAnswers.length) {
        choices.forEach(item => item.classList.add("disabled"));
        userAnswersCount = 0;
        userScore++;
        localStorage.setItem('score', userScore)
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
    userAnswerList = []
    localStorage.removeItem('localUserAnswers')
    count = localStorage.getItem('index')
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
    }
}

function restartQuiz() {
    const result = $(".result");
    userScore = 0;
    userAnswersCount = 0;
    count = 0;
    userAnswerList = []
    quiz.classList.remove('hidden');
    result.classList.add('hidden');
    localStorage.clear();
    localStorage.setItem('index', count);
    showQuestion(count);
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