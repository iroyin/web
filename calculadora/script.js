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


// Cargar historial al iniciar
document.addEventListener("DOMContentLoaded", cargarHistorial);

let idiomaActual = localStorage.getItem("idioma") || "es";
actualizarIdioma();

// Cargar modo oscuro si estaba activado antes
if (localStorage.getItem("modoOscuro") === "true") {
    document.body.classList.add("dark-mode");
    modoButton.textContent = "☀️ Modo Claro";
}

// Cambiar entre modos
modoButton.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const esOscuro = document.body.classList.contains("dark-mode");
    localStorage.setItem("modoOscuro", esOscuro);
    modoButton.textContent = esOscuro ? "☀️ Modo Claro" : "🌙 Modo Oscuro";
});

// Cambiar idioma
idiomaButton.addEventListener("click", () => {
    idiomaActual = idiomaActual === "es" ? "en" : "es";
    localStorage.setItem("idioma", idiomaActual);
    actualizarIdioma();
});

// Actualiza textos según el idioma seleccionado
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

// Configuración de reconocimiento de voz
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = idiomaActual === "es" ? "es-ES" : "en-US";
recognition.interimResults = false;

startButton.addEventListener("click", () => {
    recognition.lang = idiomaActual === "es" ? "es-ES" : "en-US";
    recognition.start();
    vibrar(100);
});

// Procesar voz
recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    resultado.value = transcript;
    procesarOperacion(transcript);
};

recognition.onerror = (event) => {
    alert("Error en el reconocimiento de voz: " + event.error);
};

// Procesar entrada manual al presionar "Enter"
resultado.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        procesarOperacion(resultado.value);
    }
});

// Procesa operaciones en ambos idiomas
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
        resultado.value = idiomaActual === "es" ? "Error en la operación" : "Error in operation";
    }
}

// Función para calcular factorial de forma segura
function factorial(n) {
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

// Evalúa la operación matemáticamente sin `eval()`
function evaluarOperacion(expresion) {
    try {
        return new Function(`"use strict"; return (${expresion})`)();
    } catch (error) {
        throw new Error("Expresión no válida");
    }
}

// Agrega el cálculo al historial
function agregarAlHistorial(texto) {
    const li = document.createElement("li");
    li.textContent = texto;
    historialLista.prepend(li);  
    guardarHistorial(texto); 
}

// Lee el resultado en voz alta en el idioma correcto
function leerResultado(resultado) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(
        idiomaActual === "es" ? `El resultado es ${resultado}` : `The result is ${resultado}`
    );
    synth.speak(utterance);
}




// Función para reproducir sonido
function playSound(sonido) {
    sonido.currentTime = 0;
    sonido.play();
}

// Función para vibrar en móviles
function vibrar(duracion = 200) {
    if (navigator.vibrate) {
        navigator.vibrate(duracion);
    }
}

// Agregar sonidos a los botones
[startButton, clearButton].forEach(boton => {
    boton.addEventListener("click", () => playSound(sonidoClick));
});


// Función para guardar historial en LocalStorage
function guardarHistorial(texto) {
    let historial = JSON.parse(localStorage.getItem("historial")) || [];
    historial.unshift(texto); // Agrega al inicio
    localStorage.setItem("historial", JSON.stringify(historial));
}

// Cargar historial guardado al recargar la página
function cargarHistorial() {
    let historial = JSON.parse(localStorage.getItem("historial")) || [];
    
    historialLista.innerHTML = "";  

    historial.forEach(item => agregarAlHistorial(item));
}

// Limpiar historial de pantalla y LocalStorage
clearButton.addEventListener("click", () => {
    resultado.value = "";
    historialLista.innerHTML = "";
    localStorage.removeItem("historial");
});
