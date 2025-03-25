let verbs = [];
let currentVerb = {};
let answered = false; // Flag para controlar el estado de la respuesta
let totalAttempts = 0;
let totalCorrect = 0;

// Importa los verbos directamente desde el archivo verbs.js
verbs = window.verbs;
getRandomVerb();

function getRandomVerb() {
    currentVerb = verbs[Math.floor(Math.random() * verbs.length)];
    
    // Muestra el significado del verbo en español
    document.getElementById('verb-meaning').textContent = currentVerb.inSpanish;
    
    // Resetea los campos de entrada y mensajes
    document.getElementById('baseVerb').value = '';
    document.getElementById('pastVerb').value = '';
    document.getElementById('participeVerb').value = '';
    document.getElementById('resultMessage').textContent = '';
    
    // Restablece el color del borde y el resultado de aciertos
    resetFields();
    
    // Restablece el texto del botón
    document.getElementById('checkAnswer').textContent = 'Verificar';
    answered = false;
}

document.getElementById('checkAnswer').addEventListener('click', () => {
    if (!answered) {
        const baseInput = document.getElementById('baseVerb');
        const pastInput = document.getElementById('pastVerb');
        const participleInput = document.getElementById('participeVerb');

        const base = baseInput.value.trim().toLowerCase();
        const past = pastInput.value.trim().toLowerCase();
        const participle = participleInput.value.trim().toLowerCase();

        let isCorrect = true;
        let correctCount = 0; // Contador de respuestas correctas

        // Verificar respuestas y cambiar el borde
        if (base === currentVerb.baseVerb) {
            baseInput.style.borderColor = 'green';
            correctCount++;
        } else {
            baseInput.style.borderColor = 'red';
            isCorrect = false;
        }

        if (past === currentVerb.passVerb) {
            pastInput.style.borderColor = 'green';
            correctCount++;
        } else {
            pastInput.style.borderColor = 'red';
            isCorrect = false;
        }

        if (participle === currentVerb.participeVerb) {
            participleInput.style.borderColor = 'green';
            correctCount++;
        } else {
            participleInput.style.borderColor = 'red';
            isCorrect = false;
        }

        // Calcular el porcentaje de acierto
        let accuracy = (correctCount / 3) * 100;
        totalAttempts++;
        totalCorrect += accuracy;

        document.getElementById('resultCore').textContent = `Acierto: ${accuracy.toFixed(2)}%`;

        if (isCorrect) {
            document.getElementById('resultMessage').textContent = '¡Correcto!';
            document.getElementById('resultMessage').className = 'correct';
        } else {
            document.getElementById('resultMessage').textContent = 
                `Incorrecto, la respuesta correcta es: ${currentVerb.baseVerb}, ${currentVerb.passVerb}, ${currentVerb.participeVerb}`;
            document.getElementById('resultMessage').className = 'incorrect';
        }
        
        document.getElementById('checkAnswer').textContent = 'Continuar';
        answered = true;
    } else {
        getRandomVerb();
    }
});

// Función para restablecer los estilos antes de la siguiente palabra
function resetFields() {
    document.getElementById('baseVerb').style.borderColor = '';
    document.getElementById('pastVerb').style.borderColor = '';
    document.getElementById('participeVerb').style.borderColor = '';
    document.getElementById('resultMessage').textContent = '';
    document.getElementById('resultCore').textContent = ''; // Limpia el porcentaje de acierto
    document.getElementById('checkAnswer').textContent = 'Verificar';
    answered = false;
}

function goToVerbsPage() {
    window.location.href = 'verbs.html';
}

document.getElementById('viewVerbs').addEventListener('click', goToVerbsPage);
