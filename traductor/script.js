let recognition;

function startRecognition() {
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'es-ES'; // Se inicia con español
    recognition.start();

    recognition.onresult = async (event) => {
        const text = event.results[0][0].transcript;
        document.getElementById("original").innerHTML = `<strong>Texto original:</strong> ${text}`;

        // Detectar idioma
        const detectedLang = await detectLanguage(text);
        const targetLang = detectedLang === 'es' ? 'en' : 'es';

        // Traducir el texto
        const translatedText = await translateText(text, targetLang);
        document.getElementById("translated").innerHTML = `<strong>Traducción:</strong> ${translatedText}`;

        // Leer la traducción en voz alta
        const speech = new SpeechSynthesisUtterance(translatedText);
        speech.lang = targetLang === 'es' ? 'es-ES' : 'en-US';
        window.speechSynthesis.speak(speech);

        // Guardar en historial
        saveToHistory(text, translatedText);

        // Comandos de voz
        const lowerText = text.toLowerCase();
        if (lowerText === "activar modo oscuro" || lowerText === "desactivar modo oscuro") {
            toggleDarkMode();
        } else if (lowerText === "borrar historial") {
            localStorage.removeItem("translationHistory");
            updateHistoryUI();
        }
    };

    recognition.onerror = (event) => {
        console.error("Error de reconocimiento: ", event.error);
    };
}

// Detectar idioma con API de Google Translate
async function detectLanguage(text) {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(text)}`;
    try {
        const response = await fetch(url);
        const result = await response.json();
        return result[2]; // Código del idioma detectado ('es' o 'en')
    } catch (error) {
        console.error("Error al detectar idioma:", error);
        return 'es'; // Por defecto, español
    }
}

// Traducir texto usando Google Translate API
async function translateText(text, targetLang) {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    
    try {
        const response = await fetch(url);
        const result = await response.json();
        return result[0][0][0];
    } catch (error) {
        console.error("Error al traducir:", error);
        return "Error en la traducción";
    }
}

// Guardar historial en localStorage
function saveToHistory(original, translated) {
    let history = JSON.parse(localStorage.getItem("translationHistory")) || [];
    history.unshift({ original, translated });
    history = history.slice(0, 10); // Limitar a 10 elementos
    localStorage.setItem("translationHistory", JSON.stringify(history));
    updateHistoryUI();
}

// Mostrar historial en la UI
function updateHistoryUI() {
    const historyDiv = document.getElementById("history");
    let history = JSON.parse(localStorage.getItem("translationHistory")) || [];

    if (history.length === 0) {
        historyDiv.innerHTML = "<p>No hay traducciones recientes.</p>";
        return;
    }

    historyDiv.innerHTML = history.map(entry => 
        `<p><strong>${entry.original}</strong> → ${entry.translated}</p>`
    ).join("");
}

// Alternar modo oscuro y guardar estado en localStorage
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    const isDarkMode = document.body.classList.contains("dark-mode");
    localStorage.setItem("darkMode", isDarkMode);
}

// Aplicar modo oscuro al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("darkMode") === "true") {
        document.body.classList.add("dark-mode");
    }
    updateHistoryUI(); // Cargar historial al iniciar
});

// Exportar historial como archivo JSON
function exportHistory() {
    const history = localStorage.getItem("translationHistory") || "[]";

    if (history === "[]") {
        alert("No hay historial para exportar.");
        return;
    }

    const blob = new Blob([history], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "historial_traducciones.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
