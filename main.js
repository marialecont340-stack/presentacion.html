/* ── PARTICLE CANVAS ── */
const c = document.getElementById('bgc');
const ctx = c.getContext('2d');
let W, H, pts = [];
function resize(){ W = c.width = window.innerWidth; H = c.height = window.innerHeight }
resize(); window.addEventListener('resize', resize);
class P {
    constructor(){ this.reset() }
    reset(){
        this.x = Math.random()*W; this.y = Math.random()*H;
        this.s = Math.random()*1.4+.3;
        this.vx = (Math.random()-.5)*.25; this.vy = -(Math.random()*.3+.04);
        this.life = 0; this.maxL = Math.random()*220+80;
        const cols=['61,142,245','34,201,138','167,139,250','0,200,255'];
        this.col = cols[Math.floor(Math.random()*cols.length)];
    }
    tick(){
        this.life++; if(this.life>this.maxL) this.reset();
        this.x+=this.vx; this.y+=this.vy;
        const a = Math.sin((this.life/this.maxL)*Math.PI)*.5;
        ctx.beginPath(); ctx.arc(this.x,this.y,this.s,0,Math.PI*2);
        ctx.fillStyle=`rgba(${this.col},${a})`; ctx.fill();
    }
}
for(let i=0;i<90;i++){const p=new P();p.life=Math.floor(Math.random()*p.maxL);pts.push(p)}
function loop(){ ctx.clearRect(0,0,W,H); pts.forEach(p=>p.tick()); requestAnimationFrame(loop) }
loop();

/* ── SCROLL REVEAL ── */
const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('on');obs.unobserve(e.target)}});
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));

/* ── NAV SHRINK ── */
window.addEventListener('scroll',()=>{
    document.querySelector('nav').style.padding = window.scrollY>60 ? '8px 32px' : '12px 32px';
});

/* ── HAMBURGER ── */
function toggleMenu(){
    document.getElementById('burger').classList.toggle('open');
    document.getElementById('mobileMenu').classList.toggle('open');
    document.body.style.overflow = document.getElementById('mobileMenu').classList.contains('open') ? 'hidden' : '';
}
function closeMenu(){
    document.getElementById('burger').classList.remove('open');
    document.getElementById('mobileMenu').classList.remove('open');
    document.body.style.overflow = '';
}

/* ── ACTIVE NAV LINK ── */
const navLinks = document.querySelectorAll('.nav-links a');
const mobileLinks = document.querySelectorAll('.nav-mobile a:not(.nav-mobile-cta)');
const sections = document.querySelectorAll('section[id]');
const observer2 = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
        if(e.isIntersecting){
            navLinks.forEach(a=>{
                a.classList.toggle('active', a.getAttribute('href')==='#'+e.target.id);
            });
            mobileLinks.forEach(a=>{
                const isActive = a.getAttribute('href')==='#'+e.target.id;
                a.style.color = isActive ? 'var(--cyan)' : '';
                a.style.textShadow = isActive ? '0 0 28px rgba(0,200,255,.5)' : '';
            });
        }
    });
},{rootMargin:'-40% 0px -55% 0px'});
sections.forEach(s=>observer2.observe(s));

/* ── STATS ANIMATION ── */
const stats = document.querySelectorAll('.stat-num');
const animateStats = () => {
    stats.forEach(stat => {
        const target = +stat.getAttribute('data-target');
        const suffix = stat.getAttribute('data-suffix') || '';
        const duration = 2000; 
        const increment = target / (duration / 16);
        let current = 0;
        const updateCount = () => {
            current += increment;
            if (current < target) {
                stat.textContent = Math.ceil(current) + suffix;
                requestAnimationFrame(updateCount);
            } else {
                stat.textContent = target + suffix;
            }
        };
        updateCount();
    });
};
window.addEventListener('load', animateStats);

/* ── ENVÍO WHATSAPP ── */
function enviarWhatsApp(event) {
    event.preventDefault();
    const nombre = document.getElementById('name').value;
    const tel = document.getElementById('whatsapp_user').value;
    const email = document.getElementById('email').value;
    const vol = document.getElementById('volume').value;
    const msg = document.getElementById('textarea').value;

    const miNumero = "51982247314";
    const texto = `*NUEVO LEAD NISSI TECH*%0A*Nombre:* ${nombre}%0A*WhatsApp:* ${tel}%0A*Email:* ${email}%0A*Volumen:* ${vol}%0A*Interés:* ${msg}`;

    window.open(`https://wa.me/${miNumero}?text=${texto}`, '_blank');
}

/* ── INYECCIÓN DE IMÁGENES Y SLIDER ── */
document.addEventListener("DOMContentLoaded", () => {
    if (typeof images === 'undefined') return;

    // 1. Hero Banner
    const hero = document.getElementById('hero-banner');
    if (hero && images.imagen1) {
        const img = document.createElement('img');
        img.src = images.imagen1;
        img.className = 'banner-img';
        img.alt = 'Hero Banner';
        hero.insertBefore(img, hero.firstChild);
    }

    // 2. Logo Navbar
    const brand = document.querySelector('.nav-brand');
    if (brand && images.imagen2) {
        const img = document.createElement('img');
        img.src = images.imagen2;
        img.className = 'nav-logo';
        img.alt = 'Nissi Tech Logo';
        brand.insertBefore(img, brand.firstChild);
    }

    // 3. Inyectar imágenes en los Workers originales antes de clonar
    const avatars = document.querySelectorAll('.wavatar');
    avatars.forEach((el, index) => {
        const key = 'imagen' + (index + 3);
        if (images[key]) {
            el.innerHTML = `<img src="${images[key]}" alt="Worker">`;
        }
    });

    // 4. Inicializar Slider (ahora los clones tendrán las imágenes)
    initWorkersSlider();
});

function initWorkersSlider() {
    const track = document.getElementById('workersTrack');
    const dotsContainer = document.getElementById('sliderDots');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    if (!track) return;

    let autoScrollInterval;
    let scrollDirection = 1; // 1 para derecha, -1 para izquierda
    let dragged = false;
    const wrapper = document.querySelector('.workers-slider-wrapper');
    const cards = Array.from(track.querySelectorAll('.wcard'));
    const totalCards = cards.length;
    const gap = 24;
    let cardWidth = 0;
    let cardCenters = [];

    const calculateLayout = () => {
        const firstCard = track.querySelector('.wcard');
        if (!firstCard) return;

        // Calculamos el ancho real de la tarjeta
        const pureCardWidth = Math.round(firstCard.getBoundingClientRect().width);
        cardWidth = pureCardWidth + gap;

        // Calculamos el padding necesario para que la tarjeta quede centrada al inicio y al final
        const wrapperWidth = wrapper.offsetWidth;
        const sidePadding = (wrapperWidth - pureCardWidth) / 2;

        track.style.paddingLeft = `${sidePadding}px`;
        track.style.paddingRight = `${sidePadding}px`;

        // Cacheamos los centros para optimizar el scroll
        cardCenters = cards.map(card => card.offsetLeft + (card.offsetWidth / 2));
    };

    // Lógica de Enfoque (Focus) optimizada
    const updateFocus = () => {
        const scrollCenter = wrapper.scrollLeft + (wrapper.offsetWidth / 2);
        cards.forEach((card, i) => {
            const distance = Math.abs(scrollCenter - cardCenters[i]);
            if (distance < cardWidth / 1.5) {
                card.classList.add('focused');
            } else {
                card.classList.remove('focused');
            }
        });
    };

    const updateButtonStates = () => {
        const maxScroll = wrapper.scrollWidth - wrapper.clientWidth;
        if (prevBtn) prevBtn.classList.toggle('disabled', wrapper.scrollLeft <= 5);
        if (nextBtn) nextBtn.classList.toggle('disabled', wrapper.scrollLeft >= maxScroll - 5);
    };

    // Lógica para voltear cartas al hacer click
    cards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (dragged || e.target.closest('.w-wa-btn')) return;
            e.preventDefault();
            this.classList.toggle('flipped');
        });
    });

    // Crear Dots
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalCards; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            wrapper.scrollTo({ left: i * cardWidth, behavior: 'smooth' });
            resetAutoScroll();
        });
        dotsContainer.appendChild(dot);
    }
    const dots = dotsContainer.querySelectorAll('.dot');

    // Listeners para flechas
    if (prevBtn) prevBtn.onclick = () => {
        wrapper.scrollBy({ left: -cardWidth, behavior: 'smooth' });
        resetAutoScroll();
    };
    if (nextBtn) nextBtn.onclick = () => {
        wrapper.scrollBy({ left: cardWidth, behavior: 'smooth' });
        resetAutoScroll();
    };

    // Auto-scroll logic
    function startAutoScroll() {
        autoScrollInterval = setInterval(() => {
            const maxScroll = wrapper.scrollWidth - wrapper.clientWidth;

            // Si llega al final, cambia dirección a la izquierda
            if (scrollDirection === 1 && wrapper.scrollLeft >= maxScroll - 20) {
                scrollDirection = -1;
            } 
            // Si llega al inicio, cambia dirección a la derecha
            else if (scrollDirection === -1 && wrapper.scrollLeft <= 20) {
                scrollDirection = 1;
            }

            wrapper.scrollBy({ left: cardWidth * scrollDirection, behavior: 'smooth' });
        }, 5000);
    }
    function stopAutoScroll() { clearInterval(autoScrollInterval); }
    function resetAutoScroll() { stopAutoScroll(); startAutoScroll(); }

    // Scroll sync
    let isTicking = false;
    wrapper.addEventListener('scroll', () => {
    if (!isTicking) {
      window.requestAnimationFrame(() => {
        const activeIndex = Math.round(wrapper.scrollLeft / cardWidth);
        dots.forEach((d, i) => d.classList.toggle('active', i === activeIndex));
        updateFocus();
        updateButtonStates();
        isTicking = false;
      });
      isTicking = true;
    }
    });

    // Drag events
    let isDown = false, startX, scrollLeft;
    wrapper.addEventListener('mousedown', (e) => {
        isDown = true; dragged = false; stopAutoScroll();
        startX = e.pageX - wrapper.getBoundingClientRect().left;
        scrollLeft = wrapper.scrollLeft;
        wrapper.style.scrollSnapType = 'none'; // Desactivar snap para suavidad al arrastrar
        wrapper.style.scrollBehavior = 'auto'; // Evitar conflictos de suavidad nativa
        wrapper.style.cursor = 'grabbing';
    });
    
    const endDragging = () => {
        if (!isDown) return;
        isDown = false;
        wrapper.style.scrollSnapType = 'x mandatory';
        wrapper.style.scrollBehavior = 'smooth';
        wrapper.style.cursor = 'grab';
        resetAutoScroll();
    };

    wrapper.addEventListener('mouseleave', endDragging);
    wrapper.addEventListener('mouseup', endDragging);

    wrapper.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - wrapper.getBoundingClientRect().left;
        if (Math.abs(x - startX) > 5) dragged = true;
        const walk = (x - startX) * 2;
        wrapper.scrollLeft = scrollLeft - walk;
    });

    // Inicialización
    calculateLayout();
    window.addEventListener('resize', () => {
        calculateLayout();
        updateFocus();
        updateButtonStates();
    });
    startAutoScroll();
    updateFocus();
    updateButtonStates();
}
