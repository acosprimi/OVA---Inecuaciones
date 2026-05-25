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
    
    // Configurar interacciones 3D dinámicas
    setupCardTilt();
    if (page === "evaluacion.html") inicializarQuiz();
    if (page === "contenido.html") {
      if (window.inicializarBalanza) window.inicializarBalanza();
    }
  } catch (err) {
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
  
  // Inicializar estela de chispas en el cursor
  initCursorSparkles();
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
  if (calif >= 4.0) { 
    msg = "\u00a1Excelente trabajo! \u00a1Dominas las inecuaciones!"; 
    color = "#10b981"; 
    triggerConfetti();
  }
  else if (calif >= 3.0) { 
    msg = "\u00a1Aprobado! Buen esfuerzo, pero puedes mejorar."; 
    color = "#3b82f6"; 
    triggerConfetti();
  }
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

// ==========================================
// NUEVAS FUNCIONALIDADES Y EFECTOS LINDOS 3D
// ==========================================

// 1. ROTACIÓN DINÁMICA 3D CON EL MOUSE
function setupCardTilt() {
  const cards = document.querySelectorAll(".card, .team-card, .glass-card");
  
  cards.forEach(card => {
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });

    card.style.transformStyle = "preserve-3d";

    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Rotación máxima de 8 grados
      const rotateX = ((centerY - y) / centerY) * 8;
      const rotateY = ((x - centerX) / centerX) * 8;
      
      card.style.transform = `translateY(-8px) scale(1.02) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
  });
}

// 2. BALANZA MATEMÁTICA INTERACTIVA
let balanceWeights = { left: 3, right: 3 };

window.changeWeight = function(side, amount) {
  const newVal = balanceWeights[side] + amount;
  if (newVal >= 0 && newVal <= 10) {
    balanceWeights[side] = newVal;
    updateBalance();
  }
};

function updateBalance() {
  const valLeft = document.getElementById("val-left");
  const valRight = document.getElementById("val-right");
  const itemsLeft = document.getElementById("items-left");
  const itemsRight = document.getElementById("items-right");
  const beam = document.getElementById("balance-beam");
  const panL = document.getElementById("pan-left");
  const panR = document.getElementById("pan-right");
  const balanceSign = document.getElementById("balance-sign");
  const expression = document.getElementById("inequality-expression");

  if (!valLeft || !valRight) return;

  valLeft.textContent = balanceWeights.left;
  valRight.textContent = balanceWeights.right;

  // Insertar manzanas con animación
  itemsLeft.innerHTML = Array(balanceWeights.left).fill('<div class="apple-weight"></div>').join('');
  itemsRight.innerHTML = Array(balanceWeights.right).fill('<div class="apple-weight"></div>').join('');

  // Ángulo e inecuación resultante
  let angle = 0;
  let sign = "=";

  const diff = balanceWeights.left - balanceWeights.right;
  if (diff > 0) {
    angle = -12; // Se inclina a la izquierda (rotación negativa)
    sign = ">";
  } else if (diff < 0) {
    angle = 12;  // Se inclina a la derecha (rotación positiva)
    sign = "<";
  }

  // Aplicar rotación física (y contrarrotación en los platillos para mantenerlos verticales)
  beam.style.transform = `rotate(${angle}deg)`;
  if (panL) panL.style.transform = `rotate(${-angle}deg)`;
  if (panR) panR.style.transform = `rotate(${-angle}deg)`;

  balanceSign.textContent = sign;
  expression.innerHTML = `Lado Izquierdo (${balanceWeights.left}) ${sign === '=' ? '=' : sign} Lado Derecho (${balanceWeights.right})`;
  
  if (sign === "=") {
    balanceSign.style.color = "var(--text-muted)";
  } else if (sign === ">") {
    balanceSign.style.color = "var(--primary)";
  } else {
    balanceSign.style.color = "var(--secondary)";
  }
}

window.inicializarBalanza = function() {
  balanceWeights = { left: 3, right: 3 };
  updateBalance();
};

// 3. ESTELA DE CHISPAS EN EL CURSOR
function initCursorSparkles() {
  const symbols = ["+", "−", "×", "÷", ">", "<", "★", "✦", "●", "◆"];
  const colors = ["#ff6b6b", "#ff9ff3", "#48dbfb", "#feca57", "#1dd1a1", "#a29bfe"];

  let lastX = 0;
  let lastY = 0;
  const minDistance = 25;

  document.addEventListener("mousemove", (e) => {
    const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
    if (dist < minDistance) return;

    lastX = e.clientX;
    lastY = e.clientY;

    createSparkle(e.clientX, e.clientY);
  });

  function createSparkle(x, y) {
    const el = document.createElement("div");
    el.className = "cursor-sparkle";
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    
    const size = Math.random() * 12 + 10;
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    const destX = (Math.random() - 0.5) * 60;
    const destY = -Math.random() * 80 - 20;

    el.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      font-size: ${size}px;
      color: ${color};
      font-weight: bold;
      pointer-events: none;
      z-index: 10000;
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
      transition: transform 1s ease-out, opacity 1s ease-out;
      font-family: Arial, sans-serif;
    `;

    document.body.appendChild(el);

    setTimeout(() => {
      el.style.transform = `translate(calc(-50% + ${destX}px), calc(-50% + ${destY}px)) scale(0.3) rotate(${Math.random() * 360}deg)`;
      el.style.opacity = "0";
    }, 50);

    setTimeout(() => {
      el.remove();
    }, 1050);
  }
}

// 4. CELEBRACIÓN DE CONFETI MULTICOLOR
function triggerConfetti() {
  const container = document.body;
  const colors = ["#ff6b6b", "#ff9ff3", "#48dbfb", "#feca57", "#1dd1a1", "#a29bfe", "#ffffff"];
  const shapes = ["circle", "square", "triangle"];

  for (let i = 0; i < 70; i++) {
    const el = document.createElement("div");
    el.className = "confetti-particle";
    
    const size = Math.random() * 8 + 6;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    
    const startX = Math.random() * window.innerWidth;
    const startY = window.innerHeight + 10;
    
    const angle = Math.random() * Math.PI - Math.PI / 2;
    const velocity = Math.random() * 15 + 10;
    const gravity = 0.4;
    const rotationSpeed = (Math.random() - 0.5) * 15;
    
    el.style.cssText = `
      position: fixed;
      left: ${startX}px;
      top: ${startY}px;
      width: ${size}px;
      height: ${size}px;
      background-color: ${color};
      pointer-events: none;
      z-index: 10000;
      opacity: 0.9;
    `;
    
    if (shape === "circle") {
      el.style.borderRadius = "50%";
    } else if (shape === "triangle") {
      el.style.backgroundColor = "transparent";
      el.style.width = "0";
      el.style.height = "0";
      el.style.borderLeft = `${size/2}px solid transparent`;
      el.style.borderRight = `${size/2}px solid transparent`;
      el.style.borderBottom = `${size}px solid ${color}`;
    }
    
    container.appendChild(el);

    let posX = startX;
    let posY = startY;
    let velX = Math.sin(angle) * velocity;
    let velY = -Math.cos(angle) * velocity;
    let rot = Math.random() * 360;
    
    let life = 0;
    const maxLife = 120;

    function update() {
      velY += gravity;
      posX += velX;
      posY += velY;
      rot += rotationSpeed;
      life++;

      el.style.transform = `translate(${posX - startX}px, ${posY - startY}px) rotate(${rot}deg)`;
      el.style.opacity = (1 - life / maxLife).toString();

      if (life < maxLife && posY < window.innerHeight + 50) {
        requestAnimationFrame(update);
      } else {
        el.remove();
      }
    }
    
    requestAnimationFrame(update);
  }
}
