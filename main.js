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
    let dragged = false;
    const wrapper = document.querySelector('.workers-slider-wrapper');
    let cards = Array.from(track.querySelectorAll('.wcard'));
    const originalCount = cards.length;
    const gap = 24;

    const getCardWidth = () => {
        return Math.round(track.querySelector('.wcard').getBoundingClientRect().width) + gap;
    };

    // 1. Inyectar imágenes en las tarjetas originales antes de clonar para que los clones hereden el contenido
    if (typeof images !== 'undefined') {
        cards.forEach((card, index) => {
            const avatar = card.querySelector('.wavatar');
            const key = 'imagen' + (index + 3);
            if (avatar && images[key]) avatar.innerHTML = `<img src="${images[key]}" alt="Worker">`;
        });
    }

    // 2. Clonar para efecto infinito: [ABC] -> [ABC][ABC][ABC]
    cards.forEach(card => track.appendChild(card.cloneNode(true)));
    // Usamos reverse para insertar al principio manteniendo el orden original A, B, C
    [...cards].reverse().forEach(card => track.insertBefore(card.cloneNode(true), track.firstChild));

    const allCards = track.querySelectorAll('.wcard');
    let cardWidth = getCardWidth();
    window.addEventListener('resize', () => { cardWidth = getCardWidth(); });

    // 3. Lógica de Enfoque (Focus) para desenfocar los laterales
    const updateFocus = () => {
        const centerX = wrapper.scrollLeft + (wrapper.offsetWidth / 2);
        allCards.forEach(card => {
            const cardCenter = card.offsetLeft + (card.offsetWidth / 2);
            const distance = Math.abs(centerX - cardCenter);
            if (distance < cardWidth / 2) {
                card.classList.add('focused');
            } else {
                card.classList.remove('focused');
            }
        });
    };

    // Lógica para voltear cartas al hacer click
    allCards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (dragged || e.target.closest('.w-wa-btn')) return;
            e.preventDefault();
            if (!this.classList.contains('flipped')) {
                this.classList.add('flipped');
                setTimeout(() => {
                    this.classList.remove('flipped');
                }, 5000);
            } else {
                this.classList.toggle('flipped');
            }
        });
    });

    // Crear Dots
    dotsContainer.innerHTML = '';
    for (let i = 0; i < originalCount; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            wrapper.scrollTo({ left: (i + originalCount) * cardWidth, behavior: 'smooth' });
            resetAutoScroll();
        });
        dotsContainer.appendChild(dot);
    }
    const dots = dotsContainer.querySelectorAll('.dot');

    // Listeners para flechas
    if (prevBtn) prevBtn.onclick = () => {
        wrapper.scrollTo({ left: wrapper.scrollLeft - cardWidth, behavior: 'smooth' });
        resetAutoScroll();
    };
    if (nextBtn) nextBtn.onclick = () => {
        wrapper.scrollTo({ left: wrapper.scrollLeft + cardWidth, behavior: 'smooth' });
        resetAutoScroll();
    };

    // Posicionamiento inicial
    wrapper.scrollLeft = originalCount * cardWidth;

    // Auto-scroll logic
    function startAutoScroll() {
        autoScrollInterval = setInterval(() => {
            wrapper.scrollBy({ left: cardWidth, behavior: 'smooth' });
        }, 5000);
    }
    function stopAutoScroll() { clearInterval(autoScrollInterval); }
    function resetAutoScroll() { stopAutoScroll(); startAutoScroll(); }

    // Scroll sync
  let isTicking = false;
  wrapper.addEventListener('scroll', () => {
        const currentScroll = wrapper.scrollLeft;
        const oneSetWidth = originalCount * cardWidth;

        // Teletransporte infinito: detectamos cuando salimos del set central
        // Dejamos un margen para que las animaciones de las flechas no se corten
        if (currentScroll < cardWidth) { 
            wrapper.scrollLeft = currentScroll + oneSetWidth;
            if (isDown) scrollLeft += oneSetWidth;
        } else if (currentScroll > oneSetWidth * 2) {
            wrapper.scrollLeft = currentScroll - oneSetWidth;
            if (isDown) scrollLeft -= oneSetWidth;
        }

    if (!isTicking) {
      window.requestAnimationFrame(() => {
        const activeIndex = Math.round(wrapper.scrollLeft / cardWidth) % originalCount;
        dots.forEach((d, i) => d.classList.toggle('active', i === activeIndex));
        updateFocus();
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

    startAutoScroll();
    updateFocus();
}
