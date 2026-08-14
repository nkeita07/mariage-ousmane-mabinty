// --- GESTION DE L'ENVELOPPE ET DE L'AFFICHAGE ---
const btnOpen = document.getElementById('btn-open');
const btnDiscover = document.getElementById('btn-discover');
const welcomeCover = document.getElementById('welcome-cover');
const envelopeModal = document.getElementById('envelope-modal');
const mainContent = document.getElementById('main-content');

if (btnOpen) {
    btnOpen.addEventListener('click', function() {
        envelopeModal.classList.remove('hidden');
    });
}

if (btnDiscover) {
    btnDiscover.addEventListener('click', function() {
        envelopeModal.classList.add('hidden');
        welcomeCover.style.display = 'none';
        mainContent.classList.remove('hidden');
        mainContent.classList.add('fade-in');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// --- COMPTE À REBOURS ---
const dateMariage = new Date("Nov 27, 2026 09:00:00").getTime();

const compteARebours = setInterval(function() {
    const maintenant = new Date().getTime();
    const distance = dateMariage - maintenant;
    
    const jours = Math.floor(distance / (1000 * 60 * 60 * 24));
    const heures = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const secondes = Math.floor((distance % (1000 * 60)) / 1000);
    
    const divCountdown = document.getElementById("countdown");
    
    if (divCountdown) {
        divCountdown.innerHTML = `
            <div>${jours}<span>Jours</span></div>
            <div>${heures}<span>Heures</span></div>
            <div>${minutes}<span>Min</span></div>
            <div>${secondes}<span>Sec</span></div>
        `;
        
        if (distance < 0) {
            clearInterval(compteARebours);
            divCountdown.innerHTML = "<div style='width:100%; font-size:1.5rem;'>C'est le grand jour !</div>";
        }
    }
}, 1000);

// --- GESTION DE L'ENVOI DU FORMULAIRE VERS GOOGLE SHEETS ---
const form = document.getElementById('rsvp-form');
const formMessage = document.getElementById('form-message');

if (form) {
    form.addEventListener('submit', e => {
        e.preventDefault(); 
        
        const btn = form.querySelector('button[type="submit"]');
        btn.innerText = "Envoi en cours..."; 
        
        fetch(form.action, {
            method: 'POST',
            body: new FormData(form)
        })
        .then(response => {
            form.style.display = 'none'; 
            formMessage.classList.remove('hidden'); 
            // Optionnel : Recharger les données pour mettre à jour le compteur en direct
            fetchMessages();
        })
        .catch(error => {
            console.error('Erreur!', error.message);
            btn.innerText = "Erreur, réessayez";
        });
    });
}

// --- RECUPERATION DES DONNEES (COMPTEUR + CARROUSEL) ---
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
    let stepTime = Math.abs(Math.floor(duration / Math.max(range, 1))); // Eviter division par 0
    let obj = document.getElementById(id);
    let timer = setInterval(function() {
        current += increment;
        obj.innerHTML = current;
        if (current == end) {
            clearInterval(timer);
        }
    }, stepTime);
}

function fetchMessages() {
    fetch(googleScriptUrl)
        .then(response => response.json())
        .then(data => {
            // 1. Mise à jour du compteur
            if (document.getElementById('guest-count')) {
                animateValue("guest-count", 0, data.totalOui || 0, 1500); 
            }

            // 2. Affichage des messages
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
            console.error("Erreur de chargement des données:", error);
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
        if (currentIndex >= totalSlides) {
            currentIndex = 0; 
        }
        const translateX = currentIndex * -100;
        carouselTrack.style.transform = `translateX(${translateX}%)`;
    }, 4000); 
}

// On lance la récupération dès l'ouverture de la page
if (carouselTrack) {
    fetchMessages();
}