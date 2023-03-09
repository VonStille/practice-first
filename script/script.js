"use strict";

const $ = document.querySelector.bind(document);
const quiz = $(".quiz");
const btnNext = $(".quiz__next-btn");
let count = 0;

if (typeof questions !== 'undefined' && questions.length > 0) {
    quiz.classList.remove('hidden');
    showQuestion(count);
} else {
    //изменить вывод ошибки **(3)**
}

//
btnNext.addEventListener('click', nextQuestion);

function showQuestion(index) {
    const title = $(".quiz__title");
    const list = $(".quiz__list");
    const progress = $(".quiz__progress");
    title.innerHTML = `{$questions[index].question}`;
    list.innerHTML = '';
    questions[index].choices.forEach(item => {
        const text = `<li class="quiz__choice">${item}</li>`;
        list.insertAdjacentHTML("beforeend", text)
    })
    progress.innerHTML = `QUESTION ${index+1} / ${questions.length}`;
};

function makeChoise() {
    // функция для выбора варианта ответа **(1)**
}

function nextQuestion() {
    const choice = $(".quiz__choice");
    const result = $(".result");
    const resultText = $(".result__text");
    count++;
    showQuestion(count);
    if ((count + 1) == questions.length) { //допилить:обработка выбора варианта ответа  **(2)**
        result.classList.remove('hidden');
        quiz.classList.add('hidden');
        resultText.innerHTML = `RESULT :${userScore} / ${questions.length}`
        return;
    }

}