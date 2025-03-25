let verbs = []; 
let currentVerb = {};
let answered = false; // Flag para controlar el estado de la respuesta

// Importa los verbos directamente desde el archivo verbs.js
verbs = window.verbs;
getRandomVerb();

function getRandomVerb() {
    currentVerb = verbs[Math.floor(Math.random() * verbs.length)];
    document.getElementById('verb-meaning').textContent = currentVerb.inSpanish;
    document.getElementById('baseVerb').value = '';
    document.getElementById('pastVerb').value = '';
    document.getElementById('participeVerb').value = '';
    document.getElementById('resultMessage').textContent = '';
    document.getElementById('checkAnswer').textContent = 'Verificar';
    answered = false; // Restablecer el estado de la respuesta
}

document.getElementById('checkAnswer').addEventListener('click', () => {
    if (!answered) {
        const base = document.getElementById('baseVerb').value.trim().toLowerCase();
        const past = document.getElementById('pastVerb').value.trim().toLowerCase();
        const participle = document.getElementById('participeVerb').value.trim().toLowerCase();
        
        if (base === currentVerb.baseVerb && past === currentVerb.passVerb && participle === currentVerb.participeVerb) {
            document.getElementById('resultMessage').textContent = '¡Correcto!';
            document.getElementById('resultMessage').className = 'correct';
        } else {
            document.getElementById('resultMessage').textContent = `Incorrecto, la respuesta correcta es: ${currentVerb.baseVerb}, ${currentVerb.passVerb}, ${currentVerb.participeVerb}`;
            document.getElementById('resultMessage').className = 'incorrect';
        }
        
        document.getElementById('checkAnswer').textContent = 'Continuar';
        answered = true;
    } else {
        getRandomVerb();
    }
});

function goToVerbsPage() {
    window.location.href = 'verbs.html';
}

document.getElementById('viewVerbs').addEventListener('click', goToVerbsPage);
