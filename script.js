// --- GESTION DE L'OUVERTURE DU RIDEAU ---
const introScreen = document.getElementById('intro-screen');
const curtainTrigger = document.getElementById('curtain-trigger');
const mainContent = document.getElementById('main-content');
let isOpened = false;

// Bloque le défilement au chargement
document.body.style.overflow = 'hidden';

if (curtainTrigger) {
    curtainTrigger.addEventListener('click', function() {
        if (!isOpened) {
            isOpened = true;
            
            // 1. Déclenche l'écartement des volets du rideau
            introScreen.classList.add('open');

            // 2. Après l'animation, débloque le scroll et supprime l'écran d'intro
            setTimeout(() => {
                document.body.style.overflow = 'auto';
                introScreen.style.display = 'none';
            }, 1400); 
        }
    });
}

// --- COMPTE À REBOURS ---
const dateMariage = new Date("Nov 20, 2026 09:00:00").getTime();

const compteARebours = setInterval(function() {
    const maintenant = new Date().getTime();
    const distance = dateMariage - maintenant;
    
    const jours = Math.floor(distance / (1000 * 60 * 60 * 24));
    const heures = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const secondes = Math.floor((distance % (1000 * 60)) / 1000);
    
    const divCountdown = document.getElementById("countdown");
    
    if (divCountdown) {
        if (distance > 0) {
            divCountdown.innerHTML = `
                <div class="c-item"><span class="c-num">${jours}</span><span class="c-label">Jours</span></div>
                <div class="c-item"><span class="c-num">${heures}</span><span class="c-label">Heures</span></div>
                <div class="c-item"><span class="c-num">${minutes}</span><span class="c-label">Min</span></div>
                <div class="c-item"><span class="c-num">${secondes}</span><span class="c-label">Sec</span></div>
            `;
        } else {
            clearInterval(compteARebours);
            divCountdown.innerHTML = "<div class='c-num' style='font-size:2.5rem;'>C'est le grand jour !</div>";
        }
    }
}, 1000);

// --- GESTION DU FORMULAIRE RSVP (GOOGLE SHEETS) ---
const form = document.getElementById('rsvp-form');
const formMessage = document.getElementById('form-message');

if (form) {
    form.addEventListener('submit', e => {
        e.preventDefault(); 
        const btn = form.querySelector('button[type="submit"]');
        btn.innerText = "Envoi en cours..."; 
        
        fetch(form.action, { method: 'POST', body: new FormData(form) })
        .then(response => {
            form.style.display = 'none'; 
            formMessage.classList.remove('hidden'); 
            fetchMessages(); 
        })
        .catch(error => {
            console.error('Erreur!', error.message);
            btn.innerText = "Erreur, réessayez";
        });
    });
}

// --- RECUPERATION DES DONNEES (COMPTEUR OUI + LIVRE D'OR) ---
const carouselTrack = document.getElementById('carousel-track');
const googleScriptUrl = 'https://script.google.com/macros/s/AKfycbz7aI8H_3zvgAr9E5cxwUFjit91s2xFgXGNHpMy0qb9yAZF9jh8kMERJbWRCamcpauw7w/exec';

function animateValue(id, start, end, duration) {
    if (start === end) {
        document.getElementById(id).innerHTML = end;
        return;
    }
    let range = end - start;
    let current = start;
    let increment = end > start ? 1 : -1;
    let stepTime = Math.abs(Math.floor(duration / Math.max(range, 1))); 
    let obj = document.getElementById(id);
    let timer = setInterval(function() {
        current += increment;
        obj.innerHTML = current;
        if (current == end) { clearInterval(timer); }
    }, stepTime);
}

function fetchMessages() {
    fetch(googleScriptUrl)
        .then(response => response.json())
        .then(data => {
            if (document.getElementById('guest-count')) {
                animateValue("guest-count", 0, data.totalOui || 0, 1500); 
            }
            if (carouselTrack) {
                if (data.messages && data.messages.length > 0) {
                    carouselTrack.innerHTML = ''; 
                    data.messages.forEach(item => {
                        const msgDiv = document.createElement('div');
                        msgDiv.className = 'carousel-msg';
                        msgDiv.innerHTML = `
                            <p class="msg-text">"${item.message}"</p>
                            <p class="msg-author">- ${item.nom}</p>
                        `;
                        carouselTrack.appendChild(msgDiv);
                    });
                    startCarousel(); 
                } else {
                    carouselTrack.innerHTML = '<div class="carousel-msg"><p class="msg-text">Soyez le premier à laisser un message !</p></div>';
                }
            }
        })
        .catch(error => {
            console.error("Erreur:", error);
            if(carouselTrack) carouselTrack.innerHTML = '<div class="carousel-msg"><p class="msg-text">Impossible de charger les messages.</p></div>';
        });
}

function startCarousel() {
    let currentIndex = 0;
    const slides = document.querySelectorAll('.carousel-msg');
    const totalSlides = slides.length;
    if(totalSlides <= 1) return;
    setInterval(() => {
        currentIndex++;
        if (currentIndex >= totalSlides) { currentIndex = 0; }
        const translateX = currentIndex * -100;
        carouselTrack.style.transform = `translateX(${translateX}%)`;
    }, 4500); 
}

if (carouselTrack) { fetchMessages(); }