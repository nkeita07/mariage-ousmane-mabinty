document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       1. ANIMATION DE PLUIE D'ÉTINCELLES & CŒURS
       ========================================= */
    const canvas = document.getElementById("bg-sparkles");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        let particles = [];
        const particleCount = 45; // Nombre de particules à l'écran

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * -canvas.height;
                this.size = Math.random() * 8 + 6; // Taille de l'élément
                this.speedY = Math.random() * 0.8 + 0.3; // Vitesse de descente douce
                this.speedX = Math.random() * 0.4 - 0.2; // Légère oscillation horizontale
                this.opacity = Math.random() * 0.6 + 0.3;
                
                // 40% de chance d'être un cœur, 60% d'être une étincelle/flocon
                this.isHeart = Math.random() < 0.4;
                
                // Couleurs dorées et bordeaux
                const colors = ['#C99B41', '#E8CA88', '#622229', '#D4AF37'];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            update() {
                this.y += this.speedY;
                this.x += this.speedX;

                if (this.y > canvas.height + 20) {
                    this.reset();
                    this.y = -10;
                }
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                ctx.fillStyle = this.color;

                if (this.isHeart) {
                    // DESSIN D'UN CŒUR
                    ctx.beginPath();
                    const topCurveHeight = this.size * 0.3;
                    ctx.moveTo(this.x, this.y + topCurveHeight);
                    // Courbe gauche
                    ctx.bezierCurveTo(
                        this.x, this.y, 
                        this.x - this.size / 2, this.y, 
                        this.x - this.size / 2, this.y + topCurveHeight
                    );
                    ctx.bezierCurveTo(
                        this.x - this.size / 2, this.y + (this.size + topCurveHeight) / 2, 
                        this.x, this.y + this.size, 
                        this.x, this.y + this.size
                    );
                    // Courbe droite
                    ctx.bezierCurveTo(
                        this.x, this.y + this.size, 
                        this.x + this.size / 2, this.y + (this.size + topCurveHeight) / 2, 
                        this.x + this.size / 2, this.y + topCurveHeight
                    );
                    ctx.bezierCurveTo(
                        this.x + this.size / 2, this.y, 
                        this.x, this.y, 
                        this.x, this.y + topCurveHeight
                    );
                    ctx.closePath();
                    ctx.fill();
                } else {
                    // DESSIN D'UNE ÉTINCELLE RONDE
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size / 3, 0, Math.PI * 2);
                    ctx.fill();
                }

                ctx.restore();
            }
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animate);
        }

        initParticles();
        animate();
    }

    /* =========================================
       2. OUVERTURE DE L'ENVELOPPE D'INVITATION
       ========================================= */
    const envelopeTrigger = document.getElementById("envelope-trigger");
    const introScreen = document.getElementById("intro-screen");
    const flap = document.getElementById("flap-3d");
    const seal = document.getElementById("seal-3d");
    const card = document.querySelector(".envelope-card-inner");
    const clickText = document.getElementById("click-text");

    if (envelopeTrigger && introScreen) {
        let isOpening = false;

        envelopeTrigger.addEventListener("click", () => {
            if (isOpening) return;
            isOpening = true;

            // Masquer les textes d'instruction
            if (clickText) clickText.classList.add("text-hidden");

            // Pop du Sceau
            if (seal) seal.classList.add("seal-popped");

            // Ouverture du rabat supérieur
            setTimeout(() => {
                if (flap) flap.classList.add("flap-open");
            }, 300);

            // Sortie de la carte
            setTimeout(() => {
                if (card) card.classList.add("card-out");
            }, 800);

            // Disparition douce de l'écran d'intro
            setTimeout(() => {
                introScreen.style.opacity = "0";
                introScreen.style.transform = "scale(1.05)";
                
                setTimeout(() => {
                    introScreen.classList.add("hidden");
                }, 1000);
            }, 2200);
        });
    }

    /* =========================================
       3. COMPTE À REBOURS (COUNTDOWN)
       ========================================= */
    const countdownContainer = document.getElementById("countdown");
    if (countdownContainer) {
        // Date du mariage : 20 Novembre 2026 à 09:00:00
        const weddingDate = new Date("2026-11-20T09:00:00").getTime();

        function updateCountdown() {
            const now = new Date().getTime();
            const difference = weddingDate - now;

            if (difference < 0) {
                countdownContainer.innerHTML = "<p style='font-size: 1.5rem; color: var(--text-burgundy); font-family: \"Cormorant Garamond\", serif;'>C'est le grand jour ! ❤️</p>";
                return;
            }

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            countdownContainer.innerHTML = `
                <div class="c-item"><span class="c-num">${days}</span><span class="c-label">Jours</span></div>
                <div class="c-item"><span class="c-num">${hours}</span><span class="c-label">Heures</span></div>
                <div class="c-item"><span class="c-num">${minutes}</span><span class="c-label">Minutes</span></div>
                <div class="c-item"><span class="c-num">${seconds}</span><span class="c-label">Secondes</span></div>
            `;
        }

        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    /* =========================================
       4. GESTION DU FORMULAIRE RSVP & GOOGLE SHEETS
       ========================================= */
    const rsvpForm = document.getElementById("rsvp-form");
    const formMessage = document.getElementById("form-message");
    const guestCountElem = document.getElementById("guest-count");

    if (rsvpForm) {
        // Charger le nombre de personnes ayant répondu
        fetch("https://script.google.com/macros/s/AKfycbz7aI8H_3zvgAr9E5cxwUFjit91s2xFgXGNHpMy0qb9yAZF9jh8kMERJbWRCamcpauw7w/exec")
            .then(res => res.json())
            .then(data => {
                if (data && data.totalGuests !== undefined && guestCountElem) {
                    guestCountElem.textContent = data.totalGuests;
                }
            })
            .catch(err => console.log("Erreur chargement compteur :", err));

        // Soumission du formulaire
        rsvpForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const btn = rsvpForm.querySelector("button[type='submit']");
            if (btn) btn.disabled = true;

            const formData = new FormData(rsvpForm);

            fetch(rsvpForm.action, {
                method: "POST",
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                rsvpForm.reset();
                rsvpForm.classList.add("hidden");
                if (formMessage) formMessage.classList.remove("hidden");
                if (guestCountElem && data.totalGuests !== undefined) {
                    guestCountElem.textContent = data.totalGuests;
                }
            })
            .catch(err => {
                console.error("Erreur d'envoi RSVP :", err);
                alert("Une erreur est survenue lors de l'envoi. Veuillez réessayer.");
                if (btn) btn.disabled = false;
            });
        });
    }

});