let recognition;

function startRecognition() {
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'es-ES'; // Prueba solo con español primero
    recognition.start();

    recognition.onresult = async (event) => {
        const text = event.results[0][0].transcript;
        document.getElementById("original").innerHTML = `<strong>Texto original:</strong> ${text}`;

        // Detectar idioma con API de traducción en lugar de regex
        const detectedLang = await detectLanguage(text);
        const targetLang = detectedLang === 'es' ? 'en' : 'es';

        const translatedText = await translateText(text, targetLang);
        document.getElementById("translated").innerHTML = `<strong>Traducción:</strong> ${translatedText}`;

        // Leer la traducción en voz alta
        const speech = new SpeechSynthesisUtterance(translatedText);
        speech.lang = targetLang === 'es' ? 'es-ES' : 'en-US';
        window.speechSynthesis.speak(speech);

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

async function detectLanguage(text) {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(text)}`;
    try {
        const response = await fetch(url);
        const result = await response.json();
        return result[2]; // Código de idioma detectado (ejemplo: 'es' o 'en')
    } catch (error) {
        console.error("Error al detectar idioma:", error);
        return 'es'; // Por defecto, asumir español
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
