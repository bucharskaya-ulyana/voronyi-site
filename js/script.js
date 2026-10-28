/* =========================================================
   СКРИПТИ САЙТУ
   Тут чотири невеликі частини:
   1. Кнопка меню на телефоні
   2. Кольорові картки, що відкриваються (сторінка «Історія кольорів»)
   3. Веселка-діаграма (сторінка «Вірші»)
   4. Гра «Вгадай колір» (сторінка «Вірші»)

   Кожна частина спочатку перевіряє, чи є потрібний елемент
   на сторінці. Якщо немає — просто нічого не робить.
   ========================================================= */


/* ---------- 1. МЕНЮ НА ТЕЛЕФОНІ ---------- */
const menuButton = document.getElementById("menuButton");
const menu = document.getElementById("menu");

if (menuButton) {
    menuButton.addEventListener("click", function () {
        // toggle — додає клас, якщо його немає, і забирає, якщо є
        menu.classList.toggle("open");
    });
}


/* ---------- 2. КОЛЬОРОВІ КАРТКИ ----------
   Знаходимо всі картки і на кожну вішаємо «слухача» кліку.
   При кліку картка отримує клас "open" — і в CSS
   показується прихований текст. */
const colorCards = document.querySelectorAll(".color-card");

colorCards.forEach(function (card) {
    card.addEventListener("click", function () {
        card.classList.toggle("open");
    });
});


/* ---------- 3. ВЕСЕЛКА ----------
   Кожна дуга має атрибути data-name, data-count, data-text.
   При кліку беремо їх і показуємо у віконці праворуч. */
const arcs = document.querySelectorAll(".arc");
const rainbowInfo = document.getElementById("rainbowInfo");

arcs.forEach(function (arc) {
    arc.addEventListener("click", function () {
        // Знімаємо виділення з усіх дуг...
        arcs.forEach(function (other) {
            other.classList.remove("selected");
        });
        // ...і виділяємо ту, на яку натиснули
        arc.classList.add("selected");

        // Беремо дані з атрибутів дуги
        const name = arc.dataset.name;
        const count = arc.dataset.count;
        const text = arc.dataset.text;

        // Рахуємо відсоток від загальної кількості (50)
        const percent = Math.round(count / 50 * 100);

        // Записуємо все це у віконце
        rainbowInfo.innerHTML =
            "<h3>" + name + "</h3>" +
            "<div class='rainbow-count'>" + count + "</div>" +
            "<p>разів із 50 (" + percent + "%)</p>" +
            "<p>" + text + "</p>";
    });
});


/* ---------- 4. ГРА «ВГАДАЙ КОЛІР» ----------
   Список питань. У кожного питання є:
   - line   — рядок з віршу, де замість кольору стоїть ___
   - poem   — назва вірша
   - answer — правильна відповідь */
const questions = [
    { line: "Ось вона — ___ Панна!..", poem: "«Блакитна Панна»", answer: "блакитний" },
    { line: "Дівчино-серденько! Ти мов ___ цвіт", poem: "«Memento mori!»", answer: "рожевий" },
    { line: "Чолом тобі, ___, широкеє море", poem: "«До моря»", answer: "синій" },
    { line: "___ плямою комин на білий килим ліг", poem: "«Зоряне небо»", answer: "чорний" },
    { line: "Дзвінкою ___ сильветою вона упала на емаль", poem: "«Інфанта»", answer: "чорний" },
    { line: "Марний відгук ___ січі", poem: "«Іванові Котляревському»", answer: "кривавий" },
    { line: "Чорною плямою комин на ___ килим ліг", poem: "«Зоряне небо»", answer: "білий" }
];

// Варіанти відповідей (кнопки)
const answers = ["блакитний", "рожевий", "синій", "чорний", "білий", "кривавий", "золотий"];

// Знаходимо елементи гри на сторінці
const gameQuestion = document.getElementById("gameQuestion");
const gameSource = document.getElementById("gameSource");
const gameAnswers = document.getElementById("gameAnswers");
const gameResult = document.getElementById("gameResult");
const gameNext = document.getElementById("gameNext");

let current = 0;   // номер поточного питання
let score = 0;     // скільки правильних відповідей
let answered = false;   // чи вже відповіли на це питання

// Функція показує питання з номером current
function showQuestion() {
    const q = questions[current];

    gameQuestion.textContent = q.line;
    gameSource.textContent = q.poem + " · питання " + (current + 1) + " з " + questions.length;
    gameResult.textContent = "";
    gameAnswers.innerHTML = "";   // очищаємо старі кнопки
    answered = false;

    // Створюємо кнопку для кожного варіанта
    answers.forEach(function (word) {
        const button = document.createElement("button");
        button.textContent = word;

        button.addEventListener("click", function () {
            checkAnswer(button, word);
        });

        gameAnswers.appendChild(button);
    });
}

// Функція перевіряє відповідь
function checkAnswer(button, word) {
    if (answered) {
        return;   // на одне питання відповідаємо лише раз
    }
    answered = true;

    const rightAnswer = questions[current].answer;

    if (word === rightAnswer) {
        button.classList.add("right");
        score = score + 1;
        gameResult.textContent = "Правильно! Рахунок: " + score;
    } else {
        button.classList.add("wrong");
        gameResult.textContent = "Ні, правильна відповідь — «" + rightAnswer + "». Рахунок: " + score;
    }
}

// Кнопка «Наступне питання»
if (gameNext) {
    gameNext.addEventListener("click", function () {
        current = current + 1;

        // Якщо питання закінчились — показуємо результат і починаємо спочатку
        if (current >= questions.length) {
            gameQuestion.textContent = "Гру закінчено! Ви вгадали " + score + " з " + questions.length;
            gameSource.textContent = "";
            gameAnswers.innerHTML = "";
            gameResult.textContent = "Натисніть кнопку, щоб зіграти ще раз";
            current = -1;   // наступне натискання почне з першого питання
            score = 0;
            return;
        }

        showQuestion();
    });

    // Показуємо перше питання, коли сторінка відкрилась
    showQuestion();
}
