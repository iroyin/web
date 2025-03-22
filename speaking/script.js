document.getElementById("toggle-theme").addEventListener("click", function() {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
});

// Cargar tema guardado
document.addEventListener("DOMContentLoaded", function() {
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
    }
    loadHistory();
});

// Configurar reconocimiento de voz
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = "en-US";
recognition.interimResults = false;

recognition.onresult = function(event) {
    const transcript = event.results[0][0].transcript;
    document.getElementById("recognized-text").textContent = transcript;
    correctGrammar(transcript);
};

document.getElementById("start-recording").addEventListener("click", function() {
    recognition.start();
});

// Función para corregir gramática usando LanguageTool
function correctGrammar(text) {
    fetch("https://api.languagetool.org/v2/check", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `text=${encodeURIComponent(text)}&language=en-US`
    })
    .then(response => response.json())
    .then(data => {
        let correctedText = text;
        let neededCorrection = "No";
        if (data.matches.length > 0) {
            neededCorrection = "Yes";
            data.matches.forEach(match => {
                correctedText = correctedText.replace(match.context.text, match.replacements[0]?.value || match.context.text);
            });
            document.getElementById("suggested-correction").textContent = `Did you mean: ${correctedText}?`;
        } else {
            document.getElementById("suggested-correction").textContent = "No corrections needed.";
        }
        saveToHistory(text, neededCorrection, correctedText);
    })
    .catch(error => console.error("Error checking grammar:", error));
}

// Guardar historial en LocalStorage y mostrarlo en tabla
function saveToHistory(original, neededCorrection, corrected) {
    let history = JSON.parse(localStorage.getItem("history")) || [];
    history.push({ userText: original, correctionNeeded: neededCorrection, correctedText: corrected });
    localStorage.setItem("history", JSON.stringify(history));
    loadHistory();
}

// Cargar historial en la vista como tabla
function loadHistory() {
    let history = JSON.parse(localStorage.getItem("history")) || [];
    const historyContainer = document.getElementById("history");
    historyContainer.innerHTML = "";
    history.forEach(entry => {
        historyContainer.innerHTML += `<tr><td>${entry.userText}</td><td>${entry.correctionNeeded}</td><td>${entry.correctedText}</td></tr>`;
    });
}

// Descargar historial en formato JSON
document.getElementById("download-history").addEventListener("click", function() {
    let history = JSON.parse(localStorage.getItem("history")) || [];
    const blob = new Blob([JSON.stringify(history, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "history.json";
    a.click();
});

// Borrar historial
document.getElementById("clear-history").addEventListener("click", function() {
    localStorage.removeItem("history");
    loadHistory();
});
