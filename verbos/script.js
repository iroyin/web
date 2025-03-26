let verbs = [];
let verbsTemp = [];
let currentVerb = {};
let answered = false; // Flag para controlar el estado de la respuesta
let totalAttempts = 0;
let totalCorrect = 0;

let arrNone = [];
let arrTreintaytres = [];
let arrSesentayseis = [];
let arrCien = [];

const sonidoClick = new Audio("click.mp3");
const sonidoResultado = new Audio("resultado.mp3");

// Función para guardar en localStorage
function guardarArreglos() {
    localStorage.setItem("arrNone", JSON.stringify(arrNone));
    localStorage.setItem("arrTreintaytres", JSON.stringify(arrTreintaytres));
    localStorage.setItem("arrSesentayseis", JSON.stringify(arrSesentayseis));
    localStorage.setItem("arrCien", JSON.stringify(arrCien));
    localStorage.setItem("verbsTemp", JSON.stringify(verbsTemp));
}

// Función para recuperar los datos del localStorage
function cargarArreglos() {

    setCount('totalVerbs', verbs);
    setCount('totalVerbsNote', verbs);

    arrNone = JSON.parse(localStorage.getItem("arrNone")) || [];
    arrTreintaytres = JSON.parse(localStorage.getItem("arrTreintaytres")) || [];
    arrSesentayseis = JSON.parse(localStorage.getItem("arrSesentayseis")) || [];
    arrCien = JSON.parse(localStorage.getItem("arrCien")) || [];
    verbsTemp = JSON.parse(localStorage.getItem("verbsTemp")) || [];

    if(verbsTemp.length >= verbs.length){
        verbsTemp = [];
    }

    setCount('none', arrNone);
    setCount('treintaytres', arrTreintaytres);
    setCount('sesentayseis', arrSesentayseis);
    setCount('cien', arrCien);
}

document.addEventListener("DOMContentLoaded", function () {
    cargarArreglos();
});

// Importa los verbos directamente desde el archivo verbs.js
verbs = window.verbs;
getRandomVerb();

function getRandomVerb() {
    currentVerb = verbs[Math.floor(Math.random() * verbs.length)];
    
    if(verifiedIfExistElement(verbsTemp, currentVerb.baseVerb)){
        getRandomVerb();
    }
    
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
    playSound(sonidoClick);
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
        verificarResultado(accuracy.toFixed(2), currentVerb.baseVerb);

        if (isCorrect) {
            document.getElementById('resultMessage').textContent = '¡Correcto!';
            document.getElementById('resultMessage').className = 'correct';
        } else {
            document.getElementById('resultMessage').textContent = 
                `Incorrecto, la respuesta correcta es: ${currentVerb.baseVerb}, ${currentVerb.passVerb}, ${currentVerb.participeVerb}`;
            document.getElementById('resultMessage').className = 'incorrect';
        }

        playSound(sonidoResultado);
        
        document.getElementById('checkAnswer').textContent = 'Continuar';
        answered = true;

        addElementIfNotExist(verbsTemp, currentVerb.baseVerb);
    } else {
        getRandomVerb();
    }
});

function verificarResultado(accurancy, verb){
    if(Math.trunc(accurancy) === 0){
        addElementIfNotExist(arrNone, verb);

        //removeElement
        removeElement(arrTreintaytres, verb);
        removeElement(arrSesentayseis, verb);
        removeElement(arrCien, verb);

        setCount('none', arrNone);
    }else if(Math.trunc(accurancy) === 33){
        addElementIfNotExist(arrTreintaytres, verb);

        //removeElement
        removeElement(arrNone, verb);
        removeElement(arrSesentayseis, verb);
        removeElement(arrCien, verb);

        setCount('treintaytres', arrTreintaytres);
    }else if(Math.trunc(accurancy) === 66){
        addElementIfNotExist(arrSesentayseis, verb);

        //removeElement
        removeElement(arrNone, verb);
        removeElement(arrTreintaytres, verb);
        removeElement(arrCien, verb);

        setCount('sesentayseis', arrSesentayseis);
    }else{
        addElementIfNotExist(arrCien, verb);

        //removeElement
        removeElement(arrNone, verb);
        removeElement(arrTreintaytres, verb);
        removeElement(arrSesentayseis, verb);

        setCount('cien', arrCien);
    }

    guardarArreglos();
}

function setCount(element, array){
    document.getElementById(element).textContent = `${array.length}`;
}

function removeElement(arrayToRemoveElement, verb){
    let index = arrayToRemoveElement.indexOf(verb);
    if (index !== -1) {
        arrayToRemoveElement.splice(index, 1);
        console.log(arrayToRemoveElement);
    } 
}

function addElementIfNotExist(arrToAddElement, verb) {
    if (!arrToAddElement.includes(verb)) {
        arrToAddElement.push(verb);
    }
}

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
    playSound(sonidoClick);
    window.location.href = 'verbs.html';
}

document.getElementById('viewVerbs').addEventListener('click', goToVerbsPage);

function playSound(sonido) {
    sonido.currentTime = 0;
    sonido.play();
}

function verifiedIfExistElement(array, verb){
    console.log(verbsTemp);
    let index = array.indexOf(verb);
    if (index !== -1) {
        return true;
    }
    return false; 
}