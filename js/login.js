// VARIABLES GLOBALES (Al inicio del archivo)
let audio;            // Música principal (tocadiscos)
let isPlaying = false; // Estado música principal
let audioSeccion;     // Música de los apartados (apar1.mp3, etc)
let intervaloAmor;    // Para la lluvia de letras

const {
    gsap,
    gsap: { registerPlugin, set, to, timeline },
    MorphSVGPlugin,
    Draggable,
} = window;

// Registrar el plugin para el movimiento de la cuerda
registerPlugin(MorphSVGPlugin);

const AUDIO = {
    CLICK: new Audio("https://assets.codepen.io/605876/click.mp3"),
};

const ON = document.querySelector("#on");
const OFF = document.querySelector("#off");
const LOGIN_FORM = document.querySelector(".login-form");

let startX;
let startY;

const PROXY = document.createElement("div");
const CORDS = gsap.utils.toArray(".cords path");
const CORD_DURATION = 0.1;
const HIT = document.querySelector(".lamp__hit");
const DUMMY_CORD = document.querySelector(".cord--dummy");
const ENDX = DUMMY_CORD.getAttribute("x2");
const ENDY = DUMMY_CORD.getAttribute("y2");

const RESET = () => {
    set(PROXY, {
        x: ENDX,
        y: ENDY,
    });
};
RESET();

const STATE = {
    ON: false,
};

// Configuración inicial de ojos y posición
gsap.set([".cords", HIT], { x: -10 });
gsap.set(".lamp__eye", {
    rotate: 180,
    transformOrigin: "50% 50%",
    yPercent: 50,
});

// LÓGICA DE ENCENDIDO / APAGADO (Tu lógica original mejorada)
const CORD_TL = timeline({
    paused: true,
    onStart: () => {
        STATE.ON = !STATE.ON;
        
        // Sincroniza la variable CSS --on con el estado real
        set(document.documentElement, { "--on": STATE.ON ? 1 : 0 });

        // Cambio de color aleatorio de la lámpara (Shade)
        const hue = gsap.utils.random(0, 359);
        set(document.documentElement, { "--shade-hue": hue });

        const glowColor = `hsl(${hue}, 40%, 45%)`;
        const glowColorDark = `hsl(${hue}, 40%, 35%)`;
        set(document.documentElement, {
            "--glow-color": glowColor,
            "--glow-color-dark": glowColorDark,
        });

        // Giro de ojos
        set(".lamp__eye", { rotate: STATE.ON ? 0 : 180 });

        // Manejo de visibilidad de cuerdas
        set([DUMMY_CORD, HIT], { display: "none" });
        set(CORDS[0], { display: "block" });
        AUDIO.CLICK.play();

        // Control del formulario y radio buttons
        if (STATE.ON) {
            ON.checked = true;
            OFF.checked = false;
            LOGIN_FORM.classList.add("active"); // Muestra el form
                    // AÑADE ESTA LÍNEA:
  document.querySelector('.lamp').classList.add('lamp--small');
  
  // También asegúrate de que el formulario se active
  document.querySelector('.login-form').classList.add('active');
        } else {
            ON.checked = false;
            OFF.checked = true;
            LOGIN_FORM.classList.remove("active"); // Esconde el form
            // AÑADE ESTA LÍNEA:
  document.querySelector('.lamp').classList.remove('lamp--small');
  
  // Quita el formulario
  document.querySelector('.login-form').classList.remove('active');
        }

    },
    onComplete: () => {
        set([DUMMY_CORD, HIT], { display: "block" });
        set(CORDS[0], { display: "none" });
        RESET();
    },
});

// Animación de la cuerda (Morph)
for (let i = 1; i < CORDS.length; i++) {
    CORD_TL.add(
        to(CORDS[0], {
            morphSVG: CORDS[i],
            duration: CORD_DURATION,
            repeat: 1,
            yoyo: true,
        })
    );
}

// DRAGGABLE (Para estirar la cuerda con el dedo/mouse)
Draggable.create(PROXY, {
    trigger: HIT,
    type: "x,y",
    onPress: (e) => {
        startX = e.x;
        startY = e.y;
    },
    onDrag: function () {
        set(DUMMY_CORD, {
            attr: {
                x2: this.x,
                y2: Math.max(400, this.y),
            },
        });
    },
    onRelease: function (e) {
        const DISTX = Math.abs(e.x - startX);
        const DISTY = Math.abs(e.y - startY);
        const TRAVELLED = Math.sqrt(DISTX * DISTX + DISTY * DISTY);
        
        to(DUMMY_CORD, {
            attr: { x2: ENDX, y2: ENDY },
            duration: CORD_DURATION,
            onComplete: () => {
                if (TRAVELLED > 50) {
                    CORD_TL.restart();
                } else {
                    RESET();
                }
            },
        });
    },
});

gsap.set(".lamp", { display: "block" });

// --- LÓGICA DEL FORMULARIO DE JENNIFER ---
const btn = document.getElementById('login-btn');
const errorMsg = document.getElementById('error-message');
const userInput = document.getElementById('username');
const passInput = document.getElementById('password');

// Función de validación mejorada
// Función para crear la lluvia (ahora dentro de login.js)
// Variables para controlar y detener la lluvia
let intervaloPalabras;
let intervaloCorazones;

function iniciarLluvia() {
    const words = ["te quiero", "te quiero", "te quiero", "te quiero"];
    
    intervaloPalabras = setInterval(() => {
        const drop = document.createElement('div');
        drop.className = 'drop';
        drop.innerText = words[Math.floor(Math.random() * words.length)];
        drop.style.left = Math.random() * 100 + 'vw';
        drop.style.animationDuration = Math.random() * 2 + 3 + 's';
        document.body.appendChild(drop);
        drop.addEventListener('animationend', () => drop.remove());
    }, 300);

    intervaloCorazones = setInterval(() => {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.innerText = '❤';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = Math.random() * 2 + 3 + 's';
        document.body.appendChild(heart);
        heart.addEventListener('animationend', () => heart.remove());
    }, 500);
}

function detenerLluvia() {
    // Detenemos la creación de nuevos elementos
    clearInterval(intervaloPalabras);
    clearInterval(intervaloCorazones);
    
    // Opcional: Limpiar los que ya están cayendo para que la pantalla quede limpia para la carta
    const elementos = document.querySelectorAll('.drop, .heart');
    elementos.forEach(el => {
        el.style.transition = "opacity 1s";
        el.style.opacity = "0";
        setTimeout(() => el.remove(), 1000);
    });
}

function mostrarCarta() {
    document.body.classList.add('scroll-active');

    document.body.style.overflowY = "auto";

    const carta = document.createElement('div');
    carta.className = 'main-content';
    carta.style.opacity = "0";
    carta.style.transition = "opacity 2s ease-in";
    
    carta.innerHTML = `
        <h1>Para el amor de mi vida:</h1>
        <div id="gif-container">
            <img src="assets/arbol_crecimiento_transiciones_suaves.gif" alt="Árbol creciendo">
        </div>
        <div id="mensaje"></div>
        <div id="contador"></div>
    `;
    document.body.appendChild(carta);

    setTimeout(() => { carta.style.opacity = "1"; }, 100);

    const texto = `Si pudiera elegir un lugar seguro, sería contigo.\nCuanto más tiempo paso a tu lado, más te quiero...\ny más me doy cuenta de que contigo todo se siente mucho mejor.`;
    const destino = document.getElementById("mensaje");
    let i = 0;

    function escribir() {
        if (i < texto.length) {
            destino.innerHTML += texto.charAt(i) === "\n" ? "<br>" : texto.charAt(i);
            i++;
            setTimeout(escribir, 50);
        }
    }
    escribir();

    // NUEVA FECHA: 15 de Noviembre de 2025
    const inicio = new Date("2025-11-15T00:00:00");
    const contador = document.getElementById("contador");

    function actualizarContador() {
        const ahora = new Date();
        const diff = ahora - inicio;
        const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
        const horas = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutos = Math.floor((diff / (1000 * 60)) % 60);
        const segundos = Math.floor((diff / 1000) % 60);
        contador.innerHTML = `Mi amor por ti comenzó el 15/11/2025.<br>Han pasado <b>${dias}</b> días, <b>${horas}</b> horas, <b>${minutos}</b> minutos, <b>${segundos}</b> segundos.`;
    }
    actualizarContador();
    setInterval(actualizarContador, 1000);
}

const loginBtn = document.getElementById('login-btn');
loginBtn.addEventListener('click', () => {
    const user = document.getElementById('username').value.toLowerCase();
    const pass = document.getElementById('password').value;

    if (user === "jennifer" && pass === "151125") {
        reproducirMusicaInicial();
        gsap.to(".container, .guide-text", {
            duration: 0.8,
            opacity: 0,
            onComplete: () => {
                const container = document.querySelector('.container');
                const guide = document.querySelector('.guide-text');
                if(container) container.style.display = "none";
                if(guide) guide.style.display = "none";
                reinsertarMenu();
                inicializarReproductor();
                iniciarLluvia();

                // A los 5 segundos detenemos la lluvia y mostramos la carta
                setTimeout(() => {
                    detenerLluvia();
                    mostrarCarta();
                   const mainMenu = document.getElementById('main-menu');
                    const playerContainer = document.getElementById('player-container');
                    if(mainMenu) mainMenu.style.display = 'block';
                    if(playerContainer) playerContainer.style.display = 'block';
                }, 5000);
            }
        });
    } else {
        const errorMsg = document.getElementById('error-message');
        errorMsg.style.display = 'block';
        errorMsg.innerText = "¡Esa no es la niña más linda! Inténtalo de nuevo, mi amor. ❤️";
        errorMsg.style.color = "red";
    }
});

// BUSCA TU FUNCIÓN ANTIGUA Y REEMPLÁZALA CON ESTA
function cargarSeccionAmor() {
    // En lugar de cargar la sección, llamamos a nuestra nueva lógica
    proximamente('Amor', '15 de Junio');
}

function reinsertarMenu() {
    const menuHTML = `
    <div class="menu-wrap" id="main-menu" style="display:none">
        <input type="checkbox" class="toggler" id="menu-toggler">
        <div class="hamburger"><div></div></div>
        <div class="menu">
            <div>
                <div>
                // BUSCA ESTA PARTE DENTRO DE reinsertarMenu
                    <p style="
                        color: #ff4d6d; 
                        font-family: 'Dancing Script', cursive; 
                        font-size: 1.30rem; /* ESTE ES EL TAMAÑO: lo bajamos de 1.5 a 1.1 */
                        margin: 0 auto 15px auto; 
                        max-width: 80%; /* ESTO evita que las letras se salgan por los lados */
                        line-height: 1.2; 
                        text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
                    ">
                      ✨ Un nuevo capítulo se desbloquea cada día 15 ✨  
                    </p>
                    <ul style="list-style: none; padding: 0; margin: 0;">
    <style>
        /* Este bloque controla el tamaño de todos los enlaces del menú */
        #main-menu .menu ul li a {
            font-size: 1rem !important;   /* Ajusta este número (0.9, 0.8) para achicar más */
            padding: 8px !important;      /* Reduce el espacio entre opciones */
            display: block;
        }
    </style>
    <li><a href="#" style="opacity: 0.6; cursor: not-allowed;">1. Recuerdos (15 Mar)</a></li>
    <li><a href="#" style="opacity: 0.6; cursor: not-allowed;">2. Carta (15 Abr)</a></li>
    <li><a href="#" style="opacity: 0.6; cursor: not-allowed;">3. Nosotros (15 May)</a></li>
    <li><a href="#" style="opacity: 0.6; cursor: not-allowed;">4. Amor (15 Jun)</a></li>
    <li><a href="#" style="opacity: 0.6; cursor: not-allowed;">5. Corazón (15 Jul)</a></li>
    <li><a href="#" style="opacity: 0.6; cursor: not-allowed;">6. Flor (15 Ago)</a></li>
    <li><a href="#" style="opacity: 0.6; cursor: not-allowed;">7. Galaxia (15 Sep)</a></li>
    <li><a href="#" style="font-weight: bold;">8. PRÓXIMAMENTE...</a></li>
</ul>

                </div>
            </div>
        </div>
    </div>`;
    document.body.insertAdjacentHTML('afterbegin', menuHTML);
}

// Función para cerrar el menú automáticamente al hacer click en una opción
function cerrarMenu() {
    document.getElementById('menu-toggler').checked = false;
}

/* ============================================================
   FUNCIONES DEL TOCADISCOS (NUEVAS)
   ============================================================ */

/* ============================================================
   FUNCIONES DEL TOCADISCOS (ACTUALIZADAS)
   ============================================================ */

function reproducirMusicaInicial() {
    // Esta función se llama al hacer clic en login
    // Solo crea el objeto de audio si no existe
    if (!audio) {
        audio = new Audio("assets/musica.mp3");
        audio.loop = true;
    }
    audio.play().then(() => {
        isPlaying = true;
    }).catch(err => console.log("Audio esperando validación final..."));
}

function inicializarReproductor() {
    // Inyectamos solo la parte visual del disco, el audio ya se está procesando
    const playerHTML = `
        <div id="player-container" class="music-player" onclick="toggleMusic()">
            <img id="disc-ui" src="assets/tocadisco.png" class="disc-img disc-spinning" alt="Disco">
        </div>
    `;
    document.body.insertAdjacentHTML('afterbegin', playerHTML);
    
    // Si la música ya está sonando por el login, nos aseguramos que el disco gire
    const disco = document.getElementById('disc-ui');
    if (isPlaying) {
        disco.classList.add('disc-spinning');
    }
}

function toggleMusic() {
    const disco = document.getElementById('disc-ui');
    
    if (isPlaying) {
        audio.pause();
        disco.classList.remove('disc-spinning');
    } else {
        audio.play();
        disco.classList.add('disc-spinning');
    }
    isPlaying = !isPlaying;
}


/* ============================================================
   APARTADO 1: AMOR - VERSIÓN ULTRA-COMPATIBLE
   ============================================================ */
function cargarSeccionAmor() {
    console.log("Intentando cargar sección Amor...");

    // 1. Pausar música global (con validación)
    if (typeof audio !== 'undefined' && audio) {
        audio.pause();
        const discoUI = document.getElementById('disc-ui');
        if(discoUI) discoUI.classList.remove('disc-spinning');
    }

    // 2. Ocultar elementos (SOLO si existen para evitar el error de la consola)
    const elementosAOcultar = ['main-menu', 'main-content', 'container'];
    elementosAOcultar.forEach(idOrClass => {
        const el = document.getElementById(idOrClass) || document.querySelector('.' + idOrClass);
        if (el) {
            el.style.setProperty('display', 'none', 'important');
        }
    });

    // 3. Preparar el escenario overlay
    const overlay = document.getElementById('section-overlay');
    if (!overlay) {
        alert("Error: No se encontró el contenedor #section-overlay en el HTML");
        return;
    }
    
    overlay.style.display = 'block';
    overlay.innerHTML = `
        <div id="lluvia-container" style="position:absolute; width:100%; height:100%; top:0; left:0; overflow:hidden; background:black;"></div>
        <div class="amor-overlay">
            <div class="amor-message">TE QUIERO💖</div>
        </div>
        <div id="btn-cerrar" class="btn-cerrar-seccion" onclick="salirSeccion()">X</div>
    `;

    // 4. Música
    audioSeccion = new Audio("assets/apar1.mp3");
    audioSeccion.loop = true;

    // 5. Lluvia de letras (Sistema estable)
    const contenedor = document.getElementById('lluvia-container');
    
    function crearLetra() {
        if (!document.getElementById('lluvia-container')) return; // Detener si ya salimos
        
        const letra = document.createElement('div');
        letra.innerText = "TE AMO";
        letra.style.cssText = `
            position: absolute;
            color: #ff69b4;
            font-weight: bold;
            font-family: monospace;
            text-shadow: 0 0 8px #ff69b4;
            font-size: ${Math.random() * 20 + 15}px;
            left: ${Math.random() * 100}vw;
            top: -50px;
            white-space: nowrap;
            opacity: ${Math.random()};
            transition: top ${Math.random() * 3 + 2}s linear;
            pointer-events: none;
            z-index: 1;
        `;
        
        contenedor.appendChild(letra);

        setTimeout(() => {
            letra.style.top = '110vh';
        }, 50);

        setTimeout(() => letra.remove(), 5000);
    }

    intervaloAmor = setInterval(crearLetra, 200);

    // 6. Interacción
    overlay.onclick = (e) => {
        if (audioSeccion && audioSeccion.paused) {
            audioSeccion.play().catch(err => console.log("Esperando interacción..."));
        }
    };

    // 7. Aparecer X
    setTimeout(() => {
        const btn = document.getElementById('btn-cerrar');
        if(btn) btn.style.opacity = "1";
    }, 7000);
}

function salirSeccion() {
    console.log("Saliendo de la sección...");

    const overlay = document.getElementById('section-overlay');
    if (overlay) {
        overlay.style.display = 'none';
        overlay.innerHTML = ''; 
    }

    // Detener audio de la sección si existe
    if (window.audioSeccion) {
        window.audioSeccion.pause();
    }

    // --- CAMBIO AQUÍ ---
    // En lugar de manipular el margin por JS, dejamos que la clase CSS lo haga
    document.body.classList.add('scroll-active'); 
    // -------------------

    // Restaurar visibilidad de los elementos principales
    const mainContent = document.querySelector('.main-content');
    const container = document.querySelector('.container');
    const menuWrap = document.querySelector('.menu-wrap');

    if (mainContent) {
        mainContent.style.display = 'block';

    }
    
    if (container) {
        container.style.display = 'flex';
    }

    if (menuWrap) {
        menuWrap.style.display = 'block';
    }

    // RE-CENTRADO FINAL: Aplicamos la clase que permite el scroll y limpia el body
    document.body.classList.add('scroll-active');
    
    // Aseguramos que el body vuelva a estar en la parte superior
    window.scrollTo(0, 0); 
}

function proximamente(seccion, fecha, event) {
    // Evitamos que la página se recargue o salte al inicio
    if (event) event.preventDefault();

    // Lanzamos el mensaje
    alert("🔒 " + seccion + "\n\nEsta sorpresa se liberará el " + fecha + ". ❤️");
    
    // Al NO tocar el toggler, el menú se queda abierto tal como quieres
}

window.proximamente = function(seccion, fecha, event) {
    // Evita que el enlace haga scroll o cierre cosas
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    // El mensaje que aparecerá en pantalla
    const mensaje = "🔒 " + seccion + "\n\nEsta sorpresa se liberará el " + fecha + ". ❤️";
    alert(mensaje);
    
    return false; // Refuerzo para que no haga nada más
};