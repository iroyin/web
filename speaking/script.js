document.addEventListener("DOMContentLoaded", () => {
    const toggleThemeBtn = document.getElementById("toggle-theme");
    const startRecordingBtn = document.getElementById("start-recording");
    const recognizedTextElem = document.getElementById("recognized-text");
    const suggestedCorrectionElem = document.getElementById("suggested-correction");
    const clearHistoryBtn = document.getElementById("clear-history");
    const downloadHistoryBtn = document.getElementById("download-history");
    const historyTable = document.getElementById("history");
    const difficultySelect = document.getElementById("difficulty-select");
    const questionElem = document.getElementById("suggested-question");



    // Preguntas por nivel
    const questions = {
        easy: ["What is your name?", "How old are you?", "Where are you from?"],
        medium: ["What did you do yesterday?", "Can you describe your best friend?", "What are your hobbies?"],
        hard: ["If you could travel anywhere, where would you go and why?", "What is the most difficult challenge you have faced?", "Describe your ideal job and why it suits you."]
    };

    function setRandomQuestion() {
        const level = difficultySelect.value;
        const questionList = questions[level];
        const randomIndex = Math.floor(Math.random() * questionList.length);
        questionElem.textContent = questionList[randomIndex];
    }

    if (difficultySelect) {
        difficultySelect.addEventListener("change", setRandomQuestion);
        setRandomQuestion();
    }

    

    difficultySelect.addEventListener("change", setRandomQuestion);
    setRandomQuestion();

    // Toggle Dark Mode
    toggleThemeBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
    });

    // Speech Recognition Setup
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = false;
    recognition.lang = "en-US";
    
    startRecordingBtn.addEventListener("click", () => {
        recognition.start();
    });
    
    recognition.onresult = async (event) => {
        const transcript = event.results[0][0].transcript;
        recognizedTextElem.textContent = transcript;
        
        // Llamar a LanguageTool para corrección gramatical
        let correction = await getGrammarCorrection(transcript);
        let correctionNeeded = transcript !== correction ? "Yes" : "No";
        suggestedCorrectionElem.textContent = correction;
        
        // Agregar a historial
        addToHistory(transcript, correctionNeeded, correction);
        
        // Leer en voz alta la corrección o felicitación
        if (transcript !== correction) {
            speakCorrection("Did you mean: " + correction);
        } else {
            speakCorrection("Great job, your sentence is correct");
        }
    };
    
    async function getGrammarCorrection(text) {
        const response = await fetch("https://api.languagetool.org/v2/check", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `text=${encodeURIComponent(text)}&language=en-US`
        });
        const data = await response.json();
        
        let correctedText = text;
        data.matches.forEach(match => {
            correctedText = correctedText.replace(match.context.text, match.replacements[0]?.value || match.context.text);
        });
        
        return correctedText;
    }
    
    function addToHistory(userInput, correctionNeeded, correction) {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${userInput}</td><td>${correctionNeeded}</td><td>${correction}</td>`;
        historyTable.appendChild(row);
        saveHistory();
    }
    
    function saveHistory() {
        const historyData = [];
        document.querySelectorAll("#history tr").forEach(row => {
            const columns = row.querySelectorAll("td");
            historyData.push({
                userInput: columns[0].textContent,
                correctionNeeded: columns[1].textContent,
                correction: columns[2].textContent
            });
        });
        localStorage.setItem("conversationHistory", JSON.stringify(historyData));
    }
    
    function loadHistory() {
        const historyData = JSON.parse(localStorage.getItem("conversationHistory")) || [];
        historyData.forEach(entry => addToHistory(entry.userInput, entry.correctionNeeded, entry.correction));
    }
    
    function clearHistory() {
        historyTable.innerHTML = "";
        localStorage.removeItem("conversationHistory");
    }
    
    function downloadHistory() {
        const historyData = localStorage.getItem("conversationHistory");
        const blob = new Blob([historyData], { type: "application/json" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "conversation_history.json";
        a.click();
    }
    
    function speakCorrection(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        speechSynthesis.speak(utterance);
    }
    
    clearHistoryBtn.addEventListener("click", clearHistory);
    downloadHistoryBtn.addEventListener("click", downloadHistory);
    
    loadHistory();
});
