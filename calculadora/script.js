const resultado = document.getElementById("resultado");
const startButton = document.getElementById("start");
const clearButton = document.getElementById("clear");
const modoButton = document.getElementById("modo");
const idiomaButton = document.getElementById("idioma");
const historialLista = document.getElementById("historial");
const titulo = document.getElementById("titulo");
const historialTitulo = document.getElementById("historialTitulo");

const sonidoClick = new Audio("click.mp3");
const sonidoResultado = new Audio("resultado.mp3");

document.addEventListener("DOMContentLoaded", cargarHistorial);

let idiomaActual = localStorage.getItem("idioma") || "es";
actualizarIdioma();

if (localStorage.getItem("modoOscuro") === "true") {
    document.body.classList.add("dark-mode");
    modoButton.textContent = "☀️ Modo Claro";
}

modoButton.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const esOscuro = document.body.classList.contains("dark-mode");
    localStorage.setItem("modoOscuro", esOscuro);
    modoButton.textContent = esOscuro ? "☀️ Modo Claro" : "🌙 Modo Oscuro";
});

idiomaButton.addEventListener("click", () => {
    idiomaActual = idiomaActual === "es" ? "en" : "es";
    localStorage.setItem("idioma", idiomaActual);
    actualizarIdioma();
});

function actualizarIdioma() {
    if (idiomaActual === "es") {
        idiomaButton.textContent = "🇪🇸 Español";
        titulo.textContent = "Calculadora por Voz";
        resultado.placeholder = "Escribe o habla tu cálculo";
        startButton.textContent = "🎤 Hablar";
        clearButton.textContent = "❌ Limpiar";
        historialTitulo.textContent = "Historial";
    } else {
        idiomaButton.textContent = "🇺🇸 English";
        titulo.textContent = "Voice Calculator";
        resultado.placeholder = "Type or speak your calculation";
        startButton.textContent = "🎤 Speak";
        clearButton.textContent = "❌ Clear";
        historialTitulo.textContent = "History";
    }
}

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = idiomaActual === "es" ? "es-ES" : "en-US";
recognition.interimResults = false;

startButton.addEventListener("click", () => {
    recognition.lang = idiomaActual === "es" ? "es-ES" : "en-US";
    recognition.start();
    vibrar(100);
});

recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    resultado.value = transcript;
    procesarOperacion(transcript);
};

recognition.onerror = (event) => {
    alert("Error en el reconocimiento de voz: " + event.error);
};

resultado.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        procesarOperacion(resultado.value);
    }
});

function procesarOperacion(entrada) {
    try {
        let operacion = entrada.toLowerCase();

        if (idiomaActual === "es") {
            operacion = operacion
                .replace(/por/g, "*")
                .replace(/entre/g, "/")
                .replace(/más/g, "+")
                .replace(/menos/g, "-")
                .replace(/elevado a (\d+)/g, "**$1")
                .replace(/raíz de (\d+)/g, "Math.sqrt($1)")
                .replace(/logaritmo de (\d+)/g, "Math.log10($1)")
                .replace(/factorial de (\d+)/g, "factorial($1)")
                .replace(/(\d+) por ciento de (\d+)/g, "($1/100) * $2");
        } else {
            operacion = operacion
                .replace(/times/g, "*")
                .replace(/divided by/g, "/")
                .replace(/plus/g, "+")
                .replace(/minus/g, "-")
                .replace(/to the power of (\d+)/g, "**$1")
                .replace(/square root of (\d+)/g, "Math.sqrt($1)")
                .replace(/log of (\d+)/g, "Math.log10($1)")
                .replace(/factorial of (\d+)/g, "factorial($1)")
                .replace(/(\d+) percent of (\d+)/g, "($1/100) * $2");
        }

        const resultadoOperacion = evaluarOperacion(operacion);
        const resultadoTexto = `${entrada} = ${resultadoOperacion}`;
        resultado.value = resultadoTexto;
        agregarAlHistorial(resultadoTexto);
        leerResultado(resultadoOperacion);
        playSound(sonidoResultado);
    } catch (error) {
        console.log(error);
        resultado.value = idiomaActual === "es" ? "Error en la operación" : "Error in operation";
    }
}

function factorial(n) {
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

function evaluarOperacion(expresion) {
    try {
        return Function(`"use strict"; return (${expresion})`)();
    } catch (error) {
        throw new Error("Expresión no válida");
    }
}

function agregarAlHistorial(texto) {
    const li = document.createElement("li");
    li.textContent = texto;
    historialLista.prepend(li);
    guardarHistorial(texto);
}

function leerResultado(resultado) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(
        idiomaActual === "es" ? `El resultado es ${resultado}` : `The result is ${resultado}`
    );
    synth.speak(utterance);
}

function playSound(sonido) {
    sonido.currentTime = 0;
    sonido.play();
}

function vibrar(duracion = 200) {
    if (navigator.vibrate) {
        navigator.vibrate(duracion);
    }
}

[startButton, clearButton].forEach(boton => {
    boton.addEventListener("click", () => playSound(sonidoClick));
});

function guardarHistorial(texto) {
    let historial = JSON.parse(localStorage.getItem("historial")) || [];
    historial.unshift(texto);
    localStorage.setItem("historial", JSON.stringify(historial));
}

function cargarHistorial() {
    let historial = JSON.parse(localStorage.getItem("historial")) || [];
    historialLista.innerHTML = "";
    historial.forEach(item => agregarAlHistorial(item));
}

clearButton.addEventListener("click", () => {
    resultado.value = "";
    historialLista.innerHTML = "";
    localStorage.removeItem("historial");
});
