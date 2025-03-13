document.addEventListener("DOMContentLoaded", () => {
    const modoOscuroBtn = document.getElementById("modoOscuroBtn");
    const voiceCommandBtn = document.getElementById("voiceCommandBtn");
    const guardarBtn = document.getElementById("guardarBtn");
    const inputs = {
        "nombre": document.getElementById("nombre"),
        "apellido": document.getElementById("apellido"),
        "cédula": document.getElementById("cedula"),
        "correo": document.getElementById("correo"),
        "teléfono": document.getElementById("telefono"),
        "dirección": document.getElementById("direccion")
    };

    // Modo oscuro
    modoOscuroBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
    });

    // Reconocimiento de voz
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "es-ES";
    recognition.continuous = true;
    recognition.interimResults = false;

    let isListening = false;

    voiceCommandBtn.addEventListener("click", () => {
        if (isListening) {
            recognition.stop();
            voiceCommandBtn.classList.remove("listening");
            voiceCommandBtn.textContent = "Activar Voz";
            isListening = false;
        } else {
            recognition.start();
            voiceCommandBtn.classList.add("listening");
            voiceCommandBtn.textContent = "Escuchando...";
            isListening = true;
        }
    });

    recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
        console.log("Reconocido:", transcript);
        
        if (transcript.includes("guardar formulario")) {
            guardarFormulario();
            return;
        }
        
        const palabras = transcript.split(" ");
        const campoDicho = palabras.shift();
        const valor = palabras.join(" ");
        
        const campoEncontrado = Object.keys(inputs).find(key => campoDicho.includes(key));
        
        if (campoEncontrado) {
            inputs[campoEncontrado].value = valor;
        }
    };

    recognition.onend = () => {
        if (isListening) {
            recognition.start(); // Reinicia la escucha automáticamente
        }
    };

    recognition.onerror = (event) => {
        console.error("Error en el reconocimiento de voz: ", event.error);
        voiceCommandBtn.classList.remove("listening");
        voiceCommandBtn.textContent = "Activar Voz";
        isListening = false;
    };

    function guardarFormulario() {
        const datos = {
            nombre: inputs.nombre.value,
            apellido: inputs.apellido.value,
            cedula: inputs["cédula"].value,
            correo: inputs.correo.value,
            telefono: inputs["teléfono"].value,
            direccion: inputs["dirección"].value
        };
        localStorage.setItem("formData", JSON.stringify(datos));
        window.location.href = "datos.html";
    }

    guardarBtn.addEventListener("click", guardarFormulario);
});
