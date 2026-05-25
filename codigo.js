const logo = document.getElementById("logo");
const barraLateral = document.querySelector(".barra-lateral");
const spans = document.querySelectorAll(".barra-lateral span");
const palanca = document.querySelector(".switch");
const circulo = document.querySelector(".circulo");
const menu = document.querySelector(".menu");
const main = document.querySelector("main");

menu.addEventListener("click", () => {
  barraLateral.classList.toggle("max-barra-lateral");
  const isOpen = barraLateral.classList.contains("max-barra-lateral");
  menu.children[0].style.display = isOpen ? "none" : "block";
  menu.children[1].style.display = isOpen ? "block" : "none";
  if (window.innerWidth <= 320) {
    barraLateral.classList.add("mini-barra-lateral");
    main.classList.add("min-main");
    spans.forEach((span) => span.classList.add("oculto"));
  }
});

palanca.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  circulo.classList.toggle("prendido");
});

logo.addEventListener("click", () => {
  barraLateral.classList.toggle("mini-barra-lateral");
  main.classList.toggle("min-main");
  spans.forEach((span) => span.classList.toggle("oculto"));
});

const submenuBtns = document.querySelectorAll(".submenu-btn");
submenuBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    btn.parentElement.classList.toggle("active");
  });
});

const contenido = document.querySelector(".contenido-principal");
const links = document.querySelectorAll("[data-page]");

async function cargarPagina(page) {
  try {
    contenido.classList.remove("content-fade-in");
    const response = await fetch(`pages/${page}`);
    if (!response.ok) throw new Error("No se pudo cargar");
    const html = await response.text();
    contenido.innerHTML = html;
    window.scrollTo(0, 0);
    void contenido.offsetWidth;
    contenido.classList.add("content-fade-in");
    if (page === "evaluacion.html") inicializarQuiz();
  } catch {
    contenido.innerHTML = `
      <div class="text-center mt-5">
        <h1 class="gradient-text">Error de Carga</h1>
        <p style="color: var(--text-muted);">No se pudo cargar la secci\u00f3n solicitada.</p>
      </div>`;
  }
}

links.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const page = link.dataset.page;
    cargarPagina(page);
    links.forEach((l) => l.classList.remove("active-link"));
    link.classList.add("active-link");
    if (window.innerWidth <= 600) {
      barraLateral.classList.remove("max-barra-lateral");
      menu.children[0].style.display = "block";
      menu.children[1].style.display = "none";
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  cargarPagina("contenido.html");
  const primerLink = document.querySelector('[data-page="contenido.html"]');
  if (primerLink) primerLink.classList.add("active-link");
});

// ========== QUIZ ENGINE ==========
const preguntasQuiz = [
  { num: 1, question: "¿Cuál es la solución de x + 7 > 12?", options: ["x > 5", "x < 5", "x > 19", "x ≥ 5"], correct: 0 },
  { num: 2, question: "Al multiplicar ambos lados de una inecuación por un número negativo, ¿qué ocurre?", options: ["La desigualdad se mantiene", "Se invierte el sentido", "Se vuelve una ecuación", "Desaparece el signo"], correct: 1 },
  { num: 3, question: "Resuelve: 3x - 6 ≤ 9", options: ["x ≤ 5", "x ≥ 5", "x ≤ 3", "x < 5"], correct: 0 },
  { num: 4, question: "¿Cómo se representa x ≥ -3 en la recta numérica?", options: ["Círculo abierto en -3 hacia la izquierda", "Círculo cerrado en -3 hacia la derecha", "Círculo abierto en -3 hacia la derecha", "Círculo cerrado en -3 hacia la izquierda"], correct: 1 },
  { num: 5, question: "Resuelve: -4x < 20", options: ["x < -5", "x > 5", "x > -5", "x < 5"], correct: 2 },
  { num: 6, question: "¿Cuál número NO es solución de x + 2 > 7?", options: ["5", "6", "7", "8"], correct: 0 },
  { num: 7, question: "Resuelve: 2x + 5 ≥ 4x - 3", options: ["x ≥ 4", "x ≤ 4", "x ≤ -4", "x ≥ -4"], correct: 1 },
  { num: 8, question: "¿Qué intervalo representa x > 2?", options: ["(-∞, 2]", "(-∞, 2)", "(2, ∞)", "[2, ∞)"], correct: 2 },
  { num: 9, question: "Si -3x ≥ 9, entonces:", options: ["x ≥ -3", "x ≤ -3", "x ≥ 3", "x ≤ 3"], correct: 1 },
  { num: 10, question: "¿Cuál es la solución de 5 < x + 2 < 11?", options: ["3 < x < 9", "7 < x < 13", "x > 3", "x < 9"], correct: 0 },
  { num: 11, question: "La desigualdad 3x - 7 ≤ x + 5 tiene solución:", options: ["x ≤ 6", "x ≥ 6", "x ≤ 3", "x ≥ 3"], correct: 0 },
  { num: 12, question: "¿Qué número satisface 2x - 8 > 0?", options: ["3", "4", "5", "2"], correct: 2 },
  { num: 13, question: "Resuelve: 4(x - 2) ≥ 3x - 1", options: ["x ≥ 7", "x ≤ 7", "x ≥ -7", "x ≥ 9"], correct: 0 },
  { num: 14, question: "La solución de -5 < 2x + 1 < 7 es:", options: ["-3 < x < 3", "-2 < x < 3", "-3 < x < 4", "x < 3"], correct: 0 },
  { num: 15, question: "¿Cuál es la representación gráfica de x ≤ 4?", options: ["Recta hacia izquierda desde 4 abierto", "Recta hacia izquierda desde 4 cerrado", "Recta hacia derecha desde 4 abierto", "Recta hacia derecha desde 4 cerrado"], correct: 1 },
  { num: 16, question: "Resuelve: 7 - 2x > 3", options: ["x > 2", "x < 2", "x > -2", "x < -2"], correct: 1 },
  { num: 17, question: "¿Cuál inecuación representa \"un número más 5 es menor o igual que 12\"?", options: ["x + 5 ≥ 12", "x + 5 < 12", "x + 5 ≤ 12", "x + 5 = 12"], correct: 2 },
  { num: 18, question: "Resuelve: 2(x - 3) - 5x ≥ 7", options: ["x ≥ -13/3", "x ≤ -13/3", "x ≥ 13/3", "x ≤ 13/3"], correct: 1 },
  { num: 19, question: "¿Qué intervalo representa -2 < x ≤ 5?", options: ["[-2, 5]", "(-2, 5]", "[-2, 5)", "(-2, 5)"], correct: 1 },
  { num: 20, question: "Si el triple de un número disminuido en 4 es mayor que 11, ¿cuál es el número?", options: ["x > 3", "x > 4", "x > 5", "x > 6"], correct: 2 },
];

let quizState = {
  currentQuestionIndex: 0,
  answers: Array(preguntasQuiz.length).fill(null),
  studentName: "",
};

function inicializarQuiz() {
  const startScreen = document.getElementById("quiz-start-screen");
  const quizContent = document.getElementById("quiz-content");
  const quizResults = document.getElementById("quiz-results");
  if (startScreen) startScreen.style.display = "block";
  if (quizContent) quizContent.style.display = "none";
  if (quizResults) { quizResults.style.display = "none"; quizResults.innerHTML = ""; }
  quizState.currentQuestionIndex = 0;
  quizState.answers.fill(null);
  quizState.studentName = "";
  const input = document.getElementById("quiz-name-input");
  if (input) input.value = "";
  const err = document.getElementById("quiz-name-error");
  if (err) err.style.display = "none";
}

window.empezarQuiz = function () {
  const input = document.getElementById("quiz-name-input");
  const error = document.getElementById("quiz-name-error");
  const name = input ? input.value.trim() : "";
  if (!name || /\d/.test(name)) {
    if (error) error.style.display = "block";
    if (input) input.focus();
    return;
  }
  if (error) error.style.display = "none";
  quizState.studentName = name;
  quizState.currentQuestionIndex = 0;
  quizState.answers.fill(null);
  document.getElementById("quiz-start-screen").style.display = "none";
  document.getElementById("quiz-content").style.display = "block";
  renderQuestion();
};

function renderQuestion() {
  const container = document.getElementById("quiz-card-content");
  if (!container) return;

  const q = preguntasQuiz[quizState.currentQuestionIndex];
  const pct = (quizState.currentQuestionIndex / preguntasQuiz.length) * 100;
  const pb = document.getElementById("quiz-progress-bar");
  if (pb) pb.style.width = `${pct}%`;

  const qn = document.querySelector(".quiz-question-num");
  if (qn) qn.textContent = `Pregunta ${quizState.currentQuestionIndex + 1} de ${preguntasQuiz.length}`;

  const letters = ["A", "B", "C", "D"];
  let opts = "";
  q.options.forEach((opt, i) => {
    const sel = quizState.answers[quizState.currentQuestionIndex] === i;
    opts += `<div class="quiz-option ${sel ? "selected" : ""}" onclick="selectQuizOption(${i})">
      <span class="quiz-option-letter">${letters[i]}</span><span>${opt}</span></div>`;
  });

  container.innerHTML = `<h3 class="quiz-question-text">${q.question}</h3>
    <div class="quiz-options">${opts}</div>`;

  const prev = document.getElementById("quiz-btn-prev");
  const next = document.getElementById("quiz-btn-next");
  if (prev) prev.style.visibility = quizState.currentQuestionIndex === 0 ? "hidden" : "visible";
  if (next) {
    const last = quizState.currentQuestionIndex === preguntasQuiz.length - 1;
    next.textContent = last ? "Finalizar" : "Siguiente";
    const ok = quizState.answers[quizState.currentQuestionIndex] !== null;
    next.disabled = !ok;
    next.style.opacity = ok ? "1" : "0.5";
  }
}

window.selectQuizOption = function (i) {
  quizState.answers[quizState.currentQuestionIndex] = i;
  renderQuestion();
};

window.quizNextQuestion = function () {
  if (quizState.currentQuestionIndex < preguntasQuiz.length - 1) {
    quizState.currentQuestionIndex++;
    renderQuestion();
  } else {
    mostrarResultados();
  }
};

window.quizPrevQuestion = function () {
  if (quizState.currentQuestionIndex > 0) {
    quizState.currentQuestionIndex--;
    renderQuestion();
  }
};

function mostrarResultados() {
  const quizContent = document.getElementById("quiz-content");
  const quizResults = document.getElementById("quiz-results");
  if (!quizContent || !quizResults) return;
  const pb = document.getElementById("quiz-progress-bar");
  if (pb) pb.style.width = "100%";

  let aciertos = 0;
  preguntasQuiz.forEach((q, i) => { if (quizState.answers[i] === q.correct) aciertos++; });

  const calif = ((aciertos / preguntasQuiz.length) * 5.0).toFixed(1);
  let msg, color;
  if (calif >= 4.0) { msg = "\u00a1Excelente trabajo! \u00a1Dominas las inecuaciones!"; color = "#10b981"; }
  else if (calif >= 3.0) { msg = "\u00a1Aprobado! Buen esfuerzo, pero puedes mejorar."; color = "#3b82f6"; }
  else { msg = "Sigue practicando. Revisa el contenido e int\u00e9ntalo de nuevo."; color = "#ef4444"; }

  quizContent.style.display = "none";
  quizResults.style.display = "block";
  quizResults.innerHTML = `<div class="results-card content-fade-in py-4">
    <div class="results-score-circle" style="border-color: ${color}; box-shadow: 0 8px 20px ${color}35;">
      <span class="results-score-value">${calif}</span></div>
    <h2 class="results-message mb-1">${msg}</h2>
    <p class="text-muted mb-3" style="font-size: 1.05rem;"><strong>${quizState.studentName}</strong></p>
    <p class="results-summary mb-4">Has respondido correctamente <strong>${aciertos}</strong> de <strong>${preguntasQuiz.length}</strong> preguntas.<br>
      Nota obtenida: <strong>${calif} / 5.0</strong></p>
    <button class="btn btn-primary px-5 py-3 rounded-pill fw-bold" onclick="inicializarQuiz()" style="font-size: 1rem;">
      Reiniciar Evaluaci\u00f3n</button></div>`;
}
