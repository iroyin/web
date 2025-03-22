let recognition;

function startRecognition() {
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'es-ES,en-US'; // Soporta español e inglés
    recognition.start();

    recognition.onresult = async (event) => {
        const text = event.results[0][0].transcript;
        document.getElementById("original").innerHTML = `<strong>Texto original:</strong> ${text}`;

        // Detectar idioma con más precisión
        const isEnglish = /^[A-Za-z\s]+$/.test(text);
        const targetLang = isEnglish ? 'es' : 'en';

        const translatedText = await translateText(text, targetLang);
        document.getElementById("translated").innerHTML = `<strong>Traducción:</strong> ${translatedText}`;

        // Leer la traducción en voz alta
        const speech = new SpeechSynthesisUtterance(translatedText);
        speech.lang = targetLang === 'es' ? 'es-ES' : 'en-US';
        window.speechSynthesis.speak(speech);

        saveToHistory(text, translatedText) 

        if (text.toLowerCase() === "activar modo oscuro" || text.toLowerCase() === "desactivar modo oscuro") {
            toggleDarkMode();
        }else if (text.toLowerCase() === "borrar historial") {
            localStorage.removeItem("translationHistory");
            updateHistoryUI();
        }
    };

    recognition.onerror = (event) => {
        console.error("Error de reconocimiento: ", event.error);
    };
}

function stopRecognition() {
    if (recognition) {
        recognition.stop();
    }
}

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

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}

function saveToHistory(original, translated) {
    let history = JSON.parse(localStorage.getItem("translationHistory")) || [];
    history.unshift({ original, translated });
    localStorage.setItem("translationHistory", JSON.stringify(history));
    updateHistoryUI();
}

function updateHistoryUI() {
    const historyDiv = document.getElementById("history");
    const history = JSON.parse(localStorage.getItem("translationHistory")) || [];
    historyDiv.innerHTML = history.slice(0, 5).map(entry => 
        `<p><strong>${entry.original}</strong> → ${entry.translated}</p>`).join("");
}

function exportHistory() {
    const history = localStorage.getItem("translationHistory") || "[]";
    const blob = new Blob([history], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "historial_traducciones.json";
    a.click();
}