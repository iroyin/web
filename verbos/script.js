let verbs = []; 
let currentVerb = {};

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
}

document.getElementById('checkAnswer').addEventListener('click', () => {
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
});

document.getElementById('nextVerb').addEventListener('click', getRandomVerb);
