document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       1. ANIMATION DE PLUIE D'ÉTINCELLES & CŒURS
       ========================================= */
    const canvas = document.getElementById("bg-sparkles");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        let particles = [];
        const particleCount = 45;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();

        class Particle {
            constructor() { this.reset(); }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * -canvas.height;
                this.size = Math.random() * 8 + 6;
                this.speedY = Math.random() * 0.8 + 0.3;
                this.speedX = Math.random() * 0.4 - 0.2;
                this.opacity = Math.random() * 0.6 + 0.3;
                this.isHeart = Math.random() < 0.4;
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
                    ctx.beginPath();
                    const topCurveHeight = this.size * 0.3;
                    ctx.moveTo(this.x, this.y + topCurveHeight);
                    ctx.bezierCurveTo(this.x, this.y, this.x - this.size / 2, this.y, this.x - this.size / 2, this.y + topCurveHeight);
                    ctx.bezierCurveTo(this.x - this.size / 2, this.y + (this.size + topCurveHeight) / 2, this.x, this.y + this.size, this.x, this.y + this.size);
                    ctx.bezierCurveTo(this.x, this.y + this.size, this.x + this.size / 2, this.y + (this.size + topCurveHeight) / 2, this.x + this.size / 2, this.y + topCurveHeight);
                    ctx.bezierCurveTo(this.x + this.size / 2, this.y, this.x, this.y, this.x, this.y + topCurveHeight);
                    ctx.closePath();
                    ctx.fill();
                } else {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size / 3, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.restore();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            requestAnimationFrame(animate);
        }
        animate();
    }

    /* =========================================
       2. OUVERTURE DIRECTE DU RIDEAU
       ========================================= */
    const curtainTrigger = document.getElementById("curtain-trigger");
    const introScreen = document.getElementById("intro-screen");

    if (curtainTrigger && introScreen) {
        let isOpened = false;
        
        document.body.style.overflow = "hidden";

        curtainTrigger.addEventListener("click", () => {
            if (isOpened) return;
            isOpened = true;

            introScreen.classList.add("open");

            setTimeout(() => {
                document.body.style.overflow = "auto";
                introScreen.style.pointerEvents = "none";
            }, 1400);

            setTimeout(() => {
                introScreen.style.display = "none";
            }, 1800);
        });
    }

    /* =========================================
       3. COMPTE À REBOURS
       ========================================= */
    const countdownContainer = document.getElementById("countdown");
    if (countdownContainer) {
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
       4. GOOGLE SHEETS RSVP & LIVRE D'OR
       ========================================= */
    const googleScriptUrl = 'https://script.google.com/macros/s/AKfycbz7aI8H_3zvgAr9E5cxwUFjit91s2xFgXGNHpMy0qb9yAZF9jh8kMERJbWRCamcpauw7w/exec';
    const guestCountElem = document.getElementById("guest-count");
    const carouselTrack = document.getElementById('carousel-track');

    function animateValue(id, start, end, duration) {
        if (!document.getElementById(id)) return;
        if (start === end) {
            document.getElementById(id).innerHTML = end;
            return;
        }
        let range = end - start;
        let current = start;
        let increment = end > start ? 1 : -1;
        let stepTime = Math.abs(Math.floor(duration / Math.max(Math.abs(range), 1)));
        let obj = document.getElementById(id);
        let timer = setInterval(function() {
            current += increment;
            obj.innerHTML = current;
            if (current == end) { clearInterval(timer); }
        }, stepTime);
    }

    function fetchGuestData() {
        fetch(googleScriptUrl)
            .then(res => res.json())
            .then(data => {
                let count = 0;
                if (data.totalOui !== undefined) count = data.totalOui;
                else if (data.totalGuests !== undefined) count = data.totalGuests;
                else if (data.count !== undefined) count = data.count;
                else if (data.messages && Array.isArray(data.messages)) count = data.messages.length;

                if (guestCountElem) {
                    animateValue("guest-count", 0, count, 1200);
                }

                if (carouselTrack && data.messages && data.messages.length > 0) {
                    carouselTrack.innerHTML = '';
                    data.messages.forEach(item => {
                        const msgDiv = document.createElement('div');
                        msgDiv.className = 'carousel-msg';
                        msgDiv.innerHTML = `
                            <p class="msg-text">"${item.message || item.msg}"</p>
                            <p class="msg-author">- ${item.nom || item.name}</p>
                        `;
                        carouselTrack.appendChild(msgDiv);
                    });
                    startCarousel();
                }
            })
            .catch(err => {
                console.error("Erreur récupération Google Sheets :", err);
                if (guestCountElem) guestCountElem.textContent = "11";
            });
    }

    function startCarousel() {
        let currentIndex = 0;
        const slides = document.querySelectorAll('.carousel-msg');
        const totalSlides = slides.length;
        if (totalSlides <= 1) return;
        setInterval(() => {
            currentIndex++;
            if (currentIndex >= totalSlides) { currentIndex = 0; }
            if (carouselTrack) carouselTrack.style.transform = `translateX(${currentIndex * -100}%)`;
        }, 4500);
    }

    fetchGuestData();

    // Soumission du formulaire RSVP
    const rsvpForm = document.getElementById("rsvp-form");
    const formMessage = document.getElementById("form-message");

    if (rsvpForm) {
        rsvpForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const btn = rsvpForm.querySelector("button[type='submit']");
            if (btn) btn.innerText = "Envoi en cours...";

            fetch(rsvpForm.action, {
                method: "POST",
                body: new FormData(rsvpForm)
            })
            .then(res => {
                rsvpForm.classList.add("hidden");
                if (formMessage) {
                    formMessage.classList.remove("hidden");
                }
                fetchGuestData();
            })
            .catch(err => {
                console.error("Erreur envoi RSVP :", err);
                if (btn) btn.innerText = "Erreur, réessayez";
            });
        });
    }

});