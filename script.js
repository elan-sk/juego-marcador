let equipos = [];
let puntajes = [];
let rondaActual = 1;
let turnoActual = 0;
let totalRondas = 0;
let preguntasPorEquipo = 0;
let tiempoPorPregunta = 30;
let numeroPregunta = 1;
let valorBase = 5;
let puntos = 0;
let timer;
let cronometroPausado = false;


function iniciarJuego() {
  const numEquipos = parseInt(document.getElementById("numEquipos").value);
  let numPreguntas = parseInt(document.getElementById("numPreguntas").value);
  tiempoPorPregunta = parseInt(document.getElementById("tiempoPregunta").value);
  valorBase = parseInt(document.getElementById("valorPregunta").value);
  if (numPreguntas % numEquipos !== 0 && numPreguntas < numEquipos) {
    alert('El número de preguntas es insuficiente para los equipos, las preguntas deben ser como mínimo iguales que los equipos')
    return
  } else {
    numPreguntas = numEquipos * Math.floor(numPreguntas / numEquipos);
  }

  equipos = [];
  puntajes = [];
  for (let i = 0; i < numEquipos; i++) {
    const nombre = document.getElementById(`equipo-${i}`).value || `Equipo ${i + 1}`;
    equipos.push(nombre);
    puntajes.push(0);
  }
  preguntasPorEquipo = numPreguntas / numEquipos;
  totalRondas = preguntasPorEquipo;

  document.getElementById("configuracion").classList.add("oculto");
  document.getElementById("juego").classList.remove("oculto");
  document.getElementById("totalRondas").textContent = totalRondas;
  document.getElementById("NumeroPregunta").textContent = numeroPregunta;
  document.getElementById("valorBase").textContent = valorBase;

  actualizarMarcador();
  actualizarEstado();
}

function abrirVentanaPequena() {
  const anchoVentana = screen.width;
  const altoVentana = 100;

  window.open(
    `${window.location.href}?emergente=1`,
    '_blank',
    `width=${anchoVentana},height=${altoVentana},resizable=yes,scrollbars=yes`
  );
}
function actualizarMarcador() {
  const marcador = document.getElementById("marcador");
  marcador.innerHTML = "";
  equipos.forEach((equipo, i) => {
    const equipoDiv = document.createElement("div");
    equipoDiv.className = `equipo ${i === turnoActual ? 'turno' : ''}`;
    equipoDiv.innerHTML = `<h2><strong>${equipo}:</strong> <span id="puntos-${i}">${puntajes[i]}pt</span></h2> <button class="botonAbrirModal btn-neutro" onclick="abrirModalEdicion(${i})">➕</button>`;
    marcador.appendChild(equipoDiv);
  });
}

function actualizarEstado() {
  document.getElementById("equipoActual").textContent = equipos[turnoActual];
  document.getElementById("rondaActual").textContent = rondaActual;
}

function iniciarCronometro() {
  limpiarTimer();
  tiempoRestante = tiempoPorPregunta;
  actualizarTiempo();
  cronometroPausado = false;

  const audioTick = document.getElementById("sound-tick");
  audioTick.pause();
  audioTick.currentTime = 0;
  audioTick.play();

  const audioSuspense = document.getElementById("sound-suspense");
  audioSuspense.pause();
  audioSuspense.currentTime = 0;


  timer = setInterval(() => {
    if (!cronometroPausado) {
      tiempoRestante--;

      if (tiempoRestante === 10) {
        const audio = document.getElementById("sound-suspense");
        audio.pause();
        audio.currentTime = 0;
        audio.play();
      }

      if (tiempoRestante === 1) {
        audioTick.pause();
        audioTick.currentTime = 0;

        const audio = document.getElementById("sound-end");
        audio.pause();
        audio.currentTime = 0;
        audio.play();
      }

      if (tiempoRestante <= 0) {
        document.getElementById("sound-suspense").pause();
        document.getElementById("sound-suspense").currentTime = 0;
        limpiarTimer();
      }

      actualizarTiempo();
    }
  }, 1000);
}

function pausarReanudarCronometro() {
  cronometroPausado = !cronometroPausado;

  if (cronometroPausado) {
    document.getElementById("sound-tick").pause();
    document.getElementById("sound-suspense").pause();
  } else {
    if (tiempoRestante > 1) {
      const audioTick = document.getElementById("sound-tick");
      audioTick.pause();
      audioTick.currentTime = 0;
      audioTick.play();
    }
    if (tiempoRestante <= 10) {
      const audioSuspense = document.getElementById("sound-suspense");
      audioSuspense.pause();
      audioSuspense.currentTime = 0;
      audioSuspense.play();
    }
  }
}

function actualizarTiempo() {
  const m = String(Math.floor(tiempoRestante / 60)).padStart(2, '0');
  const s = String(tiempoRestante % 60).padStart(2, '0');
  document.getElementById("tiempoRestante").textContent = `${m}:${s}`;
}

function limpiarTimer() {
  clearInterval(timer);
  timer = null;
}

function abrirModalEdicion(indice) {
  const modal = document.getElementById("modalEditar");
  modal.setAttribute("data-equipo", indice);
  modal.classList.remove("oculto");
  document.getElementById("juego").classList.add("oculto");
  document.getElementById("modalSumar").select();
  document.getElementById("modalNombreEquipo").textContent = equipos[indice];
  document.getElementById("modalPuntaje").textContent = puntajes[indice];
}

function abrirModalTiempo() {
  const modal = document.getElementById("modalTiempo");
  document.getElementById("ModalTiempoPregunta").value = tiempoPorPregunta;
  modal.classList.remove("oculto");
  document.getElementById("juego").classList.add("oculto");
  document.getElementById("ModalTiempoPregunta").select();
}

function cerrarModalEdicion() {
  document.getElementById("modalTiempo").classList.add("oculto");
  document.getElementById("modalEditar").classList.add("oculto");
  document.getElementById("juego").classList.remove("oculto");
}

function sumarPuntaje() {
  const indice = parseInt(document.getElementById("modalEditar").getAttribute("data-equipo"));
  const putajeSumar = document.getElementById("modalSumar").value;
  puntajes[indice] += parseInt(putajeSumar);

  actualizarMarcador();
  cerrarModalEdicion();

  const puntajeAnimar = document.querySelector(`#marcador .equipo:nth-child(${indice+1}) h2`);
  console.log(puntajeAnimar)
  puntajeAnimar.classList.remove("animar-cambio-puntaje");
  void puntajeAnimar.offsetWidth;
  puntajeAnimar.classList.add("animar-cambio-puntaje");

}

function cambiarTiempo() {
  tiempoPorPregunta = parseInt(document.getElementById("ModalTiempoPregunta").value);
  cerrarModalEdicion();
}

function calcularValorRonda() {
  const tercio = Math.ceil(totalRondas / 3);
  if (rondaActual <= tercio) return valorBase;
  if (rondaActual <= tercio * 2) return valorBase * 2;
  return valorBase * 3;
}

function respuestaCorrecta() {
  const audio = document.getElementById("sound-correct");
  audio.pause();
  audio.currentTime = 0;
  audio.play();

  const puntos = calcularValorRonda();
  puntajes[turnoActual] += puntos;

  actualizarMarcador();

  const puntajeAnimar = document.querySelector(".equipo.turno h2");
  puntajeAnimar.classList.remove("animar-cambio-puntaje");
  void puntajeAnimar.offsetWidth;
  puntajeAnimar.classList.add("animar-cambio-puntaje");

  // Esperar por la duración de la animación (ej. 800ms)
  setTimeout(() => {
    limpiarTimer();
    siguienteTurno();
  }, 800);
}

function respuestaIncorrecta() {
  const audio = document.getElementById("sound-wrong");
  audio.pause();
  audio.currentTime = 0;
  audio.play();
  limpiarTimer();
  siguienteTurno();
}

function siguienteTurno() {
  turnoActual++;
  numeroPregunta++;
  const audioTick = document.getElementById("sound-tick");
  audioTick.pause();
  audioTick.currentTime = 0;

  const audioSuspense = document.getElementById("sound-suspense");
  audioSuspense.pause();
  audioSuspense.currentTime = 0;

  if (turnoActual >= equipos.length) {
    turnoActual = 0;
    rondaActual++;
  }
  if (rondaActual > totalRondas) return finalizarJuego();
  actualizarEstado();
  actualizarMarcador();
  limpiarTimer();
  document.getElementById("NumeroPregunta").textContent = numeroPregunta;
  document.getElementById("valorBase").textContent = calcularValorRonda();
  document.getElementById("tiempoRestante").textContent = "00:00";
}



function calcularValorRonda() {
  const tercio = Math.ceil(totalRondas / 3);
  if (rondaActual <= tercio) return valorBase;
  if (rondaActual <= tercio * 2) return valorBase * 2;
  return valorBase * 3;
}

function lanzarConfetiCelebracion() {
  // Efecto básico
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { x: 0.5, y: 0.1 }
  });

  // Extra: confeti en ráfagas
  const duration = 3 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    confetti({
      ...defaults,
      particleCount: 30,
      origin: {
        x: Math.random(),
        y: Math.random() - 0.2
      }
    });
  }, 250);
}


function finalizarJuego() {
  const maxPuntos = Math.max(...puntajes);
  const ganadores = equipos.filter((_, i) => puntajes[i] === maxPuntos);
  const textoGanador = ganadores.length === 1 ? `🏆 ${ganadores[0]}<br>¡ha ganado!` : `🏆 ¡Empate entre...<br>!${ganadores.join(" y ")}`;
  const audio = document.getElementById("sound-game-over")
  audio.pause();
  audio.currentTime = 0;
  audio.play();
  const divGanador = document.getElementById("ganadorFinal");
  divGanador.querySelector("p").innerHTML = textoGanador;
  divGanador.classList.remove("oculto");
  divGanador.querySelector(".panel").classList.add("animacion-ganador");
  document.getElementById("juego").classList.add("oculto");
  lanzarConfetiCelebracion();
}

function reiniciarJuego() {
  location.reload();
}

function aplicarClaseSiEmergente() {
  const urlParams = new URLSearchParams(window.location.search);
  const esEmergente = urlParams.get('emergente') === '1';

  if (esEmergente) {
    document.body.classList.add('modo-acoplado');
  }
}

document.addEventListener('DOMContentLoaded', aplicarClaseSiEmergente);
window.addEventListener('resize', aplicarClaseSiEmergente);

// Generar inputs de nombre de equipos según número seleccionado
document.getElementById("numEquipos").addEventListener("change", () => {
  const contenedor = document.getElementById("nombresEquipos");
  contenedor.innerHTML = "";
  const num = parseInt(document.getElementById("numEquipos").value);
  for (let i = 0; i < num; i++) {
    contenedor.innerHTML += `<label>Nombre del equipo ${i + 1}:
      <input type="text" id="equipo-${i}" placeholder="Equipo ${i + 1}">
    </label>`;
  }
});
