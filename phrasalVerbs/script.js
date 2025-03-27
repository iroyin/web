let verbs = [];
let verbsTemp = [];
let currentVerb = {};
let answered = false; // Flag para controlar el estado de la respuesta
let totalAttempts = 0;
let totalCorrect = 0;

let arrNonePhasalVerbs = [];
let arrCincuentaPhasalVerbs = [];
let arrCienPhasalVerbs = [];

const sonidoClick = new Audio("click.mp3");
const sonidoResultado = new Audio("resultado.mp3");

// Función para guardar en localStorage
function guardarArreglos() {
    localStorage.setItem("arrNonePhasalVerbs", JSON.stringify(arrNonePhasalVerbs));
    localStorage.setItem("arrCincuentaPhasalVerbs", JSON.stringify(arrCincuentaPhasalVerbs));
    localStorage.setItem("arrCienPhasalVerbs", JSON.stringify(arrCienPhasalVerbs));
    localStorage.setItem("verbsTemp", JSON.stringify(verbsTemp));
}

// Función para recuperar los datos del localStorage
function cargarArreglos() {

    setCount('totalVerbs', verbs);
    setCount('totalVerbsNote', verbs);

    arrNonePhasalVerbs = JSON.parse(localStorage.getItem("arrNonePhasalVerbs")) || [];
    arrCincuentaPhasalVerbs = JSON.parse(localStorage.getItem("arrCincuentaPhasalVerbs")) || [];
    arrCienPhasalVerbs = JSON.parse(localStorage.getItem("arrCienPhasalVerbs")) || [];
    verbsTemp = JSON.parse(localStorage.getItem("verbsTemp")) || [];

    if(verbsTemp.length >= verbs.length){
        verbsTemp = [];
    }

    setCount('none', arrNonePhasalVerbs);
    setCount('cincuenta', arrCincuentaPhasalVerbs);
    setCount('cien', arrCienPhasalVerbs);
}

document.addEventListener("DOMContentLoaded", function () {
    cargarArreglos();
});

// Importa los verbos directamente desde el archivo verbs.js
verbs = window.verbs;
getRandomVerb();

function getRandomVerb() {
    currentVerb = verbs[Math.floor(Math.random() * verbs.length)];
    
    if(verifiedIfExistElement(verbsTemp, currentVerb.inSpanish)){
        getRandomVerb();
    }
    
    // Muestra el significado del verbo en español
    document.getElementById('verb-meaning').textContent = currentVerb.inSpanish;
    
    // Resetea los campos de entrada y mensajes
    document.getElementById('onePhase').value = '';
    document.getElementById('twoPhase').value = '';
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
        const oneInput = document.getElementById('onePhase');
        const twoInput = document.getElementById('twoPhase');

        const onePhase = oneInput.value.trim().toLowerCase();
        const twoPhase = twoInput.value.trim().toLowerCase();

        let isCorrect = true;
        let correctCount = 0; // Contador de respuestas correctas

        // Verificar respuestas y cambiar el borde
        if (onePhase === currentVerb.phaseOne) {
            oneInput.style.borderColor = 'green';
            correctCount++;
        } else {
            oneInput.style.borderColor = 'red';
            isCorrect = false;
        }

        if (twoPhase === currentVerb.phaseTwo) {
            twoInput.style.borderColor = 'green';
            correctCount++;
        } else {
            twoInput.style.borderColor = 'red';
            isCorrect = false;
        }

        // Calcular el porcentaje de acierto
        let accuracy = (correctCount / 2) * 100;
        totalAttempts++;
        totalCorrect += accuracy;

        document.getElementById('resultCore').textContent = `Acierto: ${accuracy.toFixed(2)}%`;
        verificarResultado(accuracy.toFixed(2), currentVerb.inSpanish);

        if (isCorrect) {
            document.getElementById('resultMessage').textContent = '¡Correcto!';
            document.getElementById('resultMessage').className = 'correct';
        } else {
            document.getElementById('resultMessage').textContent = 
                `Incorrecto, la respuesta correcta es: ${currentVerb.phaseOne}, ${currentVerb.phaseTwo}`;
            document.getElementById('resultMessage').className = 'incorrect';
        }

        playSound(sonidoResultado);
        
        document.getElementById('checkAnswer').textContent = 'Continuar';
        answered = true;

        addElementIfNotExist(verbsTemp, currentVerb.inSpanish);
    } else {
        getRandomVerb();
    }
});

function verificarResultado(accurancy, verb){
    if(Math.trunc(accurancy) === 0){
        addElementIfNotExist(arrNonePhasalVerbs, verb);

        //removeElement
        removeElement(arrCincuentaPhasalVerbs, verb);
        removeElement(arrCienPhasalVerbs, verb);

        setCount('none', arrNonePhasalVerbs);
    }else if(Math.trunc(accurancy) === 50){
        addElementIfNotExist(arrCincuentaPhasalVerbs, verb);

        //removeElement
        removeElement(arrNonePhasalVerbs, verb);
        removeElement(arrCienPhasalVerbs, verb);

        setCount('cincuenta', arrCincuentaPhasalVerbs);
    }else{
        addElementIfNotExist(arrCienPhasalVerbs, verb);

        //removeElement
        removeElement(arrNonePhasalVerbs, verb);
        removeElement(arrCincuentaPhasalVerbs, verb);

        setCount('cien', arrCienPhasalVerbs);
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
    document.getElementById('onePhase').style.borderColor = '';
    document.getElementById('twoPhase').style.borderColor = '';
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