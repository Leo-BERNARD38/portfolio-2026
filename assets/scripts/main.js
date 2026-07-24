/* ========================================
   PORTFOLIO 2026 - Awwwards Creative Design
   Advanced Interactions & Animations
   Version 3.0
   ======================================== */

// Initialize immediately
initLoader();

document.addEventListener('DOMContentLoaded', () => {
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches ||
                          'ontouchstart' in window ||
                          navigator.maxTouchPoints > 0;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    initAmbientCanvas(prefersReducedMotion);
    initCustomCursor(isTouchDevice);
    initSmoothScroll();
    initNavigation();
    initFullscreenMenu();
    initRevealAnimations();
    PageTransition.init();
    initProjectModal();
    initImageParallax(prefersReducedMotion);
    initTitleReveal(prefersReducedMotion);
    initScrollFX(prefersReducedMotion);
    initServiceCardsGlow(isTouchDevice);
    initButtonGlow(isTouchDevice);
    initBentoGlow(isTouchDevice);
    initLightbox();
    initServicesCarousel();
    initAnimationPause();
});

/* ----------------------------------------
   Animations décoratives infinies (marquee,
   étoile, pulses…) mises en pause quand
   l'élément sort du viewport
   ---------------------------------------- */
function initAnimationPause() {
    const els = document.querySelectorAll(
        '.marquee, .spin-star, .hero__scroll-line, .about__badge-dot, .contact__status-dot'
    );
    if (!els.length) return;

    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            entry.target.classList.toggle('anim-paused', !entry.isIntersecting);
        });
    });
    els.forEach(el => io.observe(el));
}

/* ----------------------------------------
   Title Reveal - mot à mot
   Découpe les titres de sections en mots
   et les révèle en cascade (blur + translate)
   ---------------------------------------- */
function initTitleReveal(prefersReducedMotion) {
    if (prefersReducedMotion) return;

    const titles = document.querySelectorAll('.section-header__title, .contact__title');
    if (!titles.length) return;

    const splitWords = (el, counter) => {
        Array.from(el.childNodes).forEach(child => {
            if (child.nodeType === Node.TEXT_NODE) {
                const parts = child.textContent.split(/(\s+)/);
                const frag = document.createDocumentFragment();
                parts.forEach(part => {
                    if (!part) return;
                    if (/^\s+$/.test(part)) {
                        frag.appendChild(document.createTextNode(part));
                    } else {
                        const span = document.createElement('span');
                        span.className = 'word';
                        span.style.setProperty('--wi', counter.i++);
                        span.textContent = part;
                        frag.appendChild(span);
                    }
                });
                el.replaceChild(frag, child);
            } else if (child.nodeType === Node.ELEMENT_NODE) {
                splitWords(child, counter);
            }
        });
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('title-revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    titles.forEach(title => {
        const container = title.closest('.section-header') ||
                          title.closest('.contact__main') ||
                          title.parentElement;
        splitWords(title, { i: 0 });
        container.classList.add('title-anim');
        observer.observe(container);
    });
}

/* ----------------------------------------
   Scroll FX - progression + marquee réactif
   Une seule boucle rAF : barre de lecture
   et skew du marquee selon la vélocité
   ---------------------------------------- */
function initScrollFX(prefersReducedMotion) {
    const bar = document.querySelector('.scroll-progress');
    const marquee = document.querySelector('.marquee');
    const heroBgText = document.querySelector('.hero__bg-text');
    if (!bar && !marquee && !heroBgText) return;

    let max = 1;
    const measure = () => {
        max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    };
    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('load', measure);

    let lastY = window.scrollY;
    let lastProgress = -1;
    let skew = 0;

    Ticker.add({
        write() {
            const y = window.scrollY;
            let active = y !== lastY;

            if (bar) {
                const p = +(y / max).toFixed(4);
                if (p !== lastProgress) {
                    bar.style.transform = `scaleX(${p})`;
                    lastProgress = p;
                }
            }

            if (marquee && !prefersReducedMotion) {
                const target = Math.max(-6, Math.min(6, (y - lastY) * 0.35));
                skew += (target - skew) * 0.1;
                if (Math.abs(skew) < 0.02 && target === 0) skew = 0;
                else active = true;
                marquee.style.transform = `rotate(-1.2deg) skewX(${skew.toFixed(2)}deg)`;
            }

            if (heroBgText && !prefersReducedMotion && y < window.innerHeight) {
                heroBgText.style.transform = `translate(-50%, calc(-50% + ${(y * 0.3).toFixed(1)}px))`;
            }

            lastY = y;
            return active ? true : false;
        }
    });
    Ticker.wake();
}

/* ----------------------------------------
   Ticker unifié — une seule boucle rAF pour
   tous les effets. Phase lecture (layout)
   puis phase écriture (styles), jamais
   entrelacées. S'endort quand tous les
   abonnés sont stabilisés ; réveillé par
   les événements (scroll, mousemove, IO).
   ---------------------------------------- */
const Ticker = {
    subs: [],
    rafId: null,

    // sub : { read?(), write() -> false quand stabilisé }
    add(sub) {
        this.subs.push(sub);
        return sub;
    },

    wake() {
        if (!Ticker.rafId) Ticker.rafId = requestAnimationFrame(Ticker.frame);
    },

    frame() {
        Ticker.rafId = null;
        let active = false;
        for (const s of Ticker.subs) if (s.read) s.read();
        for (const s of Ticker.subs) if (s.write() !== false) active = true;
        if (active) Ticker.rafId = requestAnimationFrame(Ticker.frame);
    }
};

window.addEventListener('scroll', Ticker.wake, { passive: true });
window.addEventListener('resize', Ticker.wake, { passive: true });

// Borne un handler à une exécution par frame (les événements souris
// peuvent dépasser 60/s) — la dernière valeur reçue gagne
function rafThrottle(fn) {
    let pending = false;
    let lastArgs = null;
    return function (...args) {
        lastArgs = args;
        if (pending) return;
        pending = true;
        requestAnimationFrame(() => {
            pending = false;
            fn.apply(this, lastArgs);
        });
    };
}

/* ----------------------------------------
   Ambient Canvas
   Halos oranges dessinés en très basse
   résolution (l'upscale CSS fait office de
   blur gratuit) - remplace filter: blur(100px)
   ---------------------------------------- */
function initAmbientCanvas(prefersReducedMotion) {
    const canvas = document.querySelector('.ambient-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const scale = 0.06;
    let w = 0;
    let h = 0;

    const resize = () => {
        w = canvas.width = Math.max(24, Math.ceil(window.innerWidth * scale));
        h = canvas.height = Math.max(24, Math.ceil(window.innerHeight * scale));
    };
    resize();
    window.addEventListener('resize', resize);

    const blobs = [
        { x: 0.88, y: 0.10, r: 0.52, a: 0.11, dx: 0.9,  dy: 1.3, ph: 0.0 },
        { x: 0.06, y: 0.78, r: 0.42, a: 0.07, dx: 1.2,  dy: 0.7, ph: 2.1 },
        { x: 0.50, y: 0.45, r: 0.58, a: 0.03, dx: 0.6,  dy: 0.9, ph: 4.2 }
    ];

    const draw = (t) => {
        ctx.clearRect(0, 0, w, h);
        const base = Math.max(w, h);
        for (const b of blobs) {
            const bx = (b.x + Math.sin(t * b.dx + b.ph) * 0.07) * w;
            const by = (b.y + Math.cos(t * b.dy + b.ph) * 0.09) * h;
            const r = b.r * base;
            const g = ctx.createRadialGradient(bx, by, 0, bx, by, r);
            g.addColorStop(0, `rgba(255, 77, 0, ${b.a})`);
            g.addColorStop(1, 'rgba(255, 77, 0, 0)');
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, w, h);
        }
    };

    if (prefersReducedMotion) {
        draw(0);
        return;
    }

    let t = 0;
    let raf = null;

    const frame = () => {
        t += 0.0035;
        draw(t);
        raf = requestAnimationFrame(frame);
    };

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(raf);
            raf = null;
        } else if (!raf) {
            raf = requestAnimationFrame(frame);
        }
    });

    raf = requestAnimationFrame(frame);
}

/* ----------------------------------------
   Image Parallax (lissé au lerp)
   S'applique aux images [data-parallax-img]
   dans un conteneur overflow:hidden
   ---------------------------------------- */
function initImageParallax(prefersReducedMotion) {
    const imgs = document.querySelectorAll('[data-parallax-img]');
    if (!imgs.length) return;

    if (prefersReducedMotion) {
        imgs.forEach(img => { img.style.transform = 'none'; });
        return;
    }

    const items = Array.from(imgs).map(img => ({
        img,
        wrap: img.parentElement,
        y: 0,
        visible: false,
        rect: null
    }));

    // Le rect n'est mesuré que lorsque le conteneur est à l'écran,
    // et uniquement en phase lecture (pas de reflow forcé)
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const it = items.find(i => i.wrap === entry.target);
            if (it) it.visible = entry.isIntersecting;
        });
        Ticker.wake();
    }, { rootMargin: '100px 0px' });
    items.forEach(it => io.observe(it.wrap));

    Ticker.add({
        read() {
            for (const it of items) {
                it.rect = it.visible ? it.wrap.getBoundingClientRect() : null;
            }
        },
        write() {
            const vh = window.innerHeight;
            let active = false;
            for (const it of items) {
                if (!it.rect) continue;
                const rect = it.rect;

                // Progression -1 (sous le viewport) -> 1 (au-dessus)
                const progress = (rect.top + rect.height / 2 - vh / 2) / (vh / 2 + rect.height / 2);
                const target = -progress * rect.height * 0.07;
                it.y += (target - it.y) * 0.12;
                if (Math.abs(target - it.y) < 0.05) it.y = target;
                else active = true;
                it.img.style.transform = `translate3d(0, ${it.y.toFixed(2)}px, 0) scale(1.14)`;
            }
            return active ? true : false;
        }
    });
}

/* ----------------------------------------
   Bento Grid - Glow suit le curseur
   ---------------------------------------- */
function initBentoGlow(isTouchDevice) {
    if (isTouchDevice) return;

    const bentoItems = document.querySelectorAll('.bento-item');

    bentoItems.forEach(item => {
        item.addEventListener('mousemove', rafThrottle((e) => {
            const rect = item.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            item.style.setProperty('--mouse-x', `${x}%`);
            item.style.setProperty('--mouse-y', `${y}%`);
        }), { passive: true });

        item.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });

        item.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
        });
    });
}

/* ----------------------------------------
   Loader / Preloader
   ---------------------------------------- */
function initLoader() {
    document.body.classList.add('loading');
    
    const loader = document.getElementById('loader');
    if (!loader) return;
    
    const progressBar = loader.querySelector('.loader__progress-bar');
    const percentText = loader.querySelector('.loader__percent');
    
    const MIN_LOADER_TIME = 1000;
    const loaderStartTime = Date.now();
    let progress = 0;
    let targetProgress = 0;
    let animationFrame = null;
    
    // Déclencher l'animation du SVG
    setTimeout(() => {
        loader.classList.add('is-animating');
    }, 100);
    
    const updateProgressSmooth = () => {
        const diff = targetProgress - progress;
        // On accélère l'attrape si on est loin, on ralentit si on est proche
        const factor = diff > 10 ? 0.1 : 0.05;
        progress += diff * factor;
        
        const displayProgress = Math.min(Math.round(progress), 100);
        if (progressBar) progressBar.style.transform = `scaleX(${(progress / 100).toFixed(4)})`;
        if (percentText) percentText.textContent = `${displayProgress}%`;
        
        if (Math.abs(diff) > 0.05) {
            animationFrame = requestAnimationFrame(updateProgressSmooth);
        } else {
            animationFrame = null;
        }
    };
    
    // Simulation temporelle plus précise
    const duration = 900; // Temps pour atteindre 90%
    const startSim = Date.now();
    
    const simulate = () => {
        const elapsed = Date.now() - startSim;
        const ratio = Math.min(elapsed / duration, 1);
        
        // Courbe de progression (accélère puis ralentit vers la fin)
        const easeRatio = 1 - Math.pow(1 - ratio, 2); 
        targetProgress = easeRatio * 92;
        
        if (!animationFrame) {
            animationFrame = requestAnimationFrame(updateProgressSmooth);
        }
        
        if (ratio < 1) {
            setTimeout(simulate, 50);
        }
    };
    
    simulate();
    
    const hideLoader = () => {
        const elapsedTime = Date.now() - loaderStartTime;
        const remainingTime = Math.max(0, MIN_LOADER_TIME - elapsedTime);
        
        // Attendre le délai minimal ET la fin du chargement réel
        setTimeout(() => {
            targetProgress = 100;
            if (!animationFrame) {
                animationFrame = requestAnimationFrame(updateProgressSmooth);
            }
            
            // Petit délai pour laisser la barre finir son animation à 100%
            setTimeout(() => {
                loader.classList.add('loaded');
                document.body.classList.remove('loading');

                // Le rideau démarre à 250ms (après l'envol du contenu)
                setTimeout(() => {
                    animateHeroEntrance();
                }, 400);

                setTimeout(() => {
                    loader.style.display = 'none';
                    if (animationFrame) cancelAnimationFrame(animationFrame);
                }, 1100);
            }, 300);
        }, remainingTime);
    };
    
    window.addEventListener('load', () => {
        hideLoader();
    });
    
    // Fallback
    setTimeout(() => {
        if (!loader.classList.contains('loaded')) {
            hideLoader();
        }
    }, 5000);
}

/* ----------------------------------------
   Hero Entrance Animation
   ---------------------------------------- */
function animateHeroEntrance() {
    const heroElements = document.querySelectorAll('.hero__label, .hero__title-line, .hero__description, .hero__cta, .hero__stats');
    
    heroElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        
        setTimeout(() => {
            el.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 100 + (index * 100));
    });
}

/* ----------------------------------------
   Custom Cursor
   ---------------------------------------- */
function initCustomCursor(isTouchDevice) {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    
    if (!cursor || !follower) return;
    
    // Check for touch device or no hover capability
    if (isTouchDevice) {
        cursor.style.display = 'none';
        follower.style.display = 'none';
        return;
    }
    
    let mouseX = -100;
    let mouseY = -100;
    let fx = -100;
    let fy = -100;
    let hasMoved = false;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        hasMoved = true;
        Ticker.wake();
    }, { passive: true });

    Ticker.add({
        write() {
            if (!hasMoved) return false;

            // Point : collé au pointeur, zéro latence
            cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;

            // Anneau : traîne courte, s'endort une fois convergé
            fx += (mouseX - fx) * 0.22;
            fy += (mouseY - fy) * 0.22;
            const settled = Math.abs(mouseX - fx) < 0.3 && Math.abs(mouseY - fy) < 0.3;
            if (settled) {
                fx = mouseX;
                fy = mouseY;
            }
            follower.style.transform = `translate3d(${fx.toFixed(1)}px, ${fy.toFixed(1)}px, 0)`;
            if (settled) return false;
        }
    });
    
    // Interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .bento-item, [data-cursor="hover"]');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('active');
            follower.classList.add('active');
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('active');
            follower.classList.remove('active');
        });
    });
    
    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        follower.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
        follower.style.opacity = '1';
    });
}

/* ----------------------------------------
   Smooth Scroll
   ---------------------------------------- */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // Close mobile menu if open
            const menu = document.querySelector('.fullscreen-menu');
            const menuBtn = document.querySelector('.nav__menu-btn');
            if (menu && menu.classList.contains('active')) {
                menu.classList.remove('active');
                menuBtn?.classList.remove('active');
                document.body.classList.remove('menu-open');
            }

            // Si c'est juste "#", retour en haut ; sinon navigation
            // native (scroll-behavior: smooth défini en CSS)
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });
}

/* ----------------------------------------
   Navigation
   ---------------------------------------- */
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav__link:not(.nav__link--cta)');
    const sections = document.querySelectorAll('section[id]');
    if (!navLinks.length || !sections.length) return;

    const visible = new Set();

    // Bande "active" ≈ tiers haut du viewport ; aucune section dans
    // la bande (haut du hero) -> aucun lien actif
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) visible.add(entry.target.id);
            else visible.delete(entry.target.id);
        });

        let current = null;
        for (const section of sections) {
            if (visible.has(section.id)) {
                current = section.id;
                break;
            }
        }

        navLinks.forEach(link => {
            link.classList.toggle('active', current !== null && link.getAttribute('href') === `#${current}`);
        });
    }, { rootMargin: '-25% 0px -55% 0px' });

    sections.forEach(section => io.observe(section));
}

/* ----------------------------------------
   Fullscreen Menu
   ---------------------------------------- */
function initFullscreenMenu() {
    const menuBtn = document.querySelector('.nav__menu-btn');
    const menu = document.querySelector('.fullscreen-menu');
    
    if (!menuBtn || !menu) return;
    
    menuBtn.addEventListener('click', () => {
        const isActive = menu.classList.contains('active');
        
        if (isActive) {
            menu.classList.remove('active');
            menuBtn.classList.remove('active');
            document.body.classList.remove('menu-open');
        } else {
            menu.classList.add('active');
            menuBtn.classList.add('active');
            document.body.classList.add('menu-open');
        }
    });
    
    // Close menu on link click
    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('active');
            menuBtn.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
    
    // Close on escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menu.classList.contains('active')) {
            menu.classList.remove('active');
            menuBtn.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
}

/* ----------------------------------------
   Reveal Animations (Intersection Observer)
   ---------------------------------------- */
function initRevealAnimations() {
    const revealElements = document.querySelectorAll('[data-reveal]');
    const staggerElements = document.querySelectorAll('[data-stagger]');
    const revealImages = document.querySelectorAll('.reveal-img');

    // Also add reveal to key sections
    // (les .section-header sont animés par initTitleReveal)
    const sections = document.querySelectorAll('.bento-item, .service-card, .about__content-col, .testimonial');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    revealElements.forEach(el => observer.observe(el));
    staggerElements.forEach(el => observer.observe(el));

    // Les .reveal-img sont masqués par clip-path : leur rect visible est vide,
    // l'observer ne se déclencherait jamais sur eux. On observe donc le parent.
    const imgObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.reveal-img').forEach(el => {
                    el.classList.add('revealed');
                });
                imgObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealImages.forEach(el => {
        imgObserver.observe(el.parentElement || el);
    });
    
    // For sections without data-reveal
    sections.forEach((el, index) => {
        if (!el.hasAttribute('data-reveal')) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(40px)';
            el.style.transition = `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.05}s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.05}s`;
            
            const sectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        sectionObserver.unobserve(entry.target);
                    }
                });
            }, observerOptions);
            
            sectionObserver.observe(el);
        }
    });
}

/* ----------------------------------------
   Page Transition Manager
   ---------------------------------------- */
const PageTransition = {
    element: null,
    kicker: null,
    word: null,
    isAnimating: false,
    COVER_MS: 720,  // durée réelle de curtainIn (0.72s)
    OUT_MS: 820,    // curtainOut 0.72s + délai 0.09s + marge

    init() {
        this.element = document.querySelector('.page-transition');
        this.kicker = document.querySelector('.page-transition__kicker');
        this.word = document.querySelector('.page-transition__word');
    },

    // label : { kicker, word } — cartouche affiché pendant que l'écran est couvert
    animate(callback, reverse = false, label = null) {
        if (this.isAnimating || !this.element) {
            if (callback) callback();
            return;
        }

        this.isAnimating = true;

        if (this.kicker) this.kicker.textContent = label?.kicker || '';
        if (this.word) this.word.textContent = label?.word || '';

        this.element.classList.toggle('is-reverse', reverse);
        this.element.classList.remove('is-animating-out');
        this.element.classList.add('is-animating-in');

        setTimeout(() => {
            // Contenu échangé pendant que l'écran est couvert
            if (callback) callback();

            this.element.classList.remove('is-animating-in');
            this.element.classList.add('is-animating-out');

            setTimeout(() => {
                this.element.classList.remove('is-animating-out', 'is-reverse');
                this.isAnimating = false;
            }, this.OUT_MS);
        }, this.COVER_MS);
    }
};

/* ----------------------------------------
   Project Modal System
   ---------------------------------------- */
function initProjectModal() {
    const modal = document.getElementById('projectModal');
    if (!modal) return;

    const container = modal.querySelector('.project-modal__container');
    const backdrop = modal.querySelector('.project-modal__backdrop');
    const closeBtn = modal.querySelector('.project-modal__close');
    const prevBtn = modal.querySelector('.pm-footer__prev');
    const nextBtn = modal.querySelector('.pm-footer__next');
    const heroEl = modal.querySelector('.pm-hero');
    const bodyEl = modal.querySelector('.pm-body');
    const projectItems = document.querySelectorAll('.work [data-project]');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Données projets — chaque projet compose son propre layout via `blocks`
    // Types de blocs : intro (chapô), chapter (chapitre numéroté), image (figure
    // légendée, variante full/left/right), duo (deux images), quote (citation)
    const projectsData = {
        optiwits: {
            number: '01',
            title: 'OptiWITS™',
            subtitle: 'Plateforme SaaS d\'optimisation de parcs éoliens',
            year: '03/2025 -> 08/2025',
            role: 'Full-Stack Developer & UX/UI Designer',
            context: 'Stage M2 - GreenWITS',
            tags: ['SAAS', 'UX/UI', 'FULL-STACK'],
            stack: ['React', 'JavaScript', 'Python', 'MongoDB', 'FastAPI', 'Figma', 'Docker', 'GitLab'],
            links: [
                { url : 'https://www.greenwits.com/solutions/optiwits-software/', label: 'OptiWITS™', icon: 'link' }
            ],
            blocks: [
                { type: 'intro', text: 'OptiWITS™ est une plateforme SaaS qui accompagne la conception de parcs éoliens en combinant calculs d’optimisation et visualisations de données pour aider les équipes projet à prendre de meilleures décisions.' },
                { type: 'image', src: 'assets/images/project_optiwits_1.webp', caption: 'Vue d’ensemble de la plateforme', variant: 'full' },
                { type: 'chapter', label: 'Ma mission', paragraphs: [
                    'Dans le cadre de mon stage, mon rôle a été d’accélérer la transformation d’une version bêta en produit professionnel : montée en qualité de l’interface, clarification des parcours, et amélioration de la réactivité perçue au quotidien.',
                    'Concrètement, j’ai consolidé un design system, conçu et implémenté des composants UI réutilisables, et participé à l’industrialisation du front (structure, performances, micro-interactions) en lien étroit avec l’équipe produit/tech.'
                ]},
                { type: 'quote', text: 'Rendre une technologie dense et très technique compréhensible et agréable à utiliser, sans perdre la précision attendue par des experts métier.', cite: 'Le défi' },
                { type: 'image', src: 'assets/images/project_optiwits_2.webp', caption: 'Aperçu de l’interface', variant: 'right' },
                { type: 'chapter', label: 'Ce que j’en retire', paragraphs: [
                    'Une meilleure maîtrise du travail en équipe sur un SaaS (priorisation, itération, feedback utilisateurs), et une approche plus mature de l’équilibre UX ↔ contraintes techniques ↔ performance.'
                ]}
            ]
        },
        ccp: {
            number: '02',
            title: 'Camping-Car Partner',
            subtitle: 'Application web B2B de gestion de dossiers (CRM & collaboration)',
            year: '05/2023 -> 10/2023 & 04/2024 -> 07/2024',
            role: 'Full-Stack Developer (Solo)',
            context: 'Stage Licence + Stage M1',
            tags: ['B2B', 'CRM', 'PHP'],
            stack: ['PHP', 'MySQL', 'JavaScript', 'jQuery', 'Bootstrap', 'GitHub'],
            links: [
                { url : 'https://campingcarpartner.fr/', label: 'Camping-Car Partner', icon: 'link' }
            ],
            blocks: [
                { type: 'intro', text: 'Camping-Car Partner est une application web B2B (CRM / extranet) conçue pour centraliser et sécuriser la gestion de dossiers, et fluidifier la collaboration entre l’entreprise et ses partenaires (concessionnaires, téléconseillers).' },
                { type: 'image', src: 'assets/images/project_ccp_1.webp', caption: 'Aperçu de l’application', variant: 'full' },
                { type: 'chapter', label: 'Deux stages, un produit', paragraphs: [
                    'J’ai travaillé sur ce même produit sur deux stages successifs (Licence puis Master 1) : d’abord pour bâtir une première version utilisable, puis pour faire évoluer l’outil avec les retours du terrain et accompagner la montée en charge.',
                    'En autonomie, j’ai assuré la conception UX/UI, le développement full-stack et la mise en production : structuration des données, pages métier, gestion des accès, fiabilisation et optimisation de l’expérience (réactivité, clarté des workflows, cohérence d’interface).'
                ]},
                { type: 'quote', text: 'Transformer un fonctionnement « tableur + échanges dispersés » en un outil web simple à prendre en main, robuste et adapté à des utilisateurs aux profils variés.', cite: 'Le défi' },
                { type: 'image', src: 'assets/images/project_ccp_2.webp', caption: 'Interface de gestion', variant: 'left' },
                { type: 'chapter', label: 'Ce que j’en retiens', paragraphs: [
                    'Une vision bout-en-bout d’un produit (besoin → solution → déploiement), le sens des priorités en contexte réel, et une progression nette sur la qualité logicielle (maintenance, performance, sécurité) et la communication avec des parties prenantes non-tech.'
                ]}
            ]
        },
        modnation: {
            number: '03',
            title: 'ModNation',
            subtitle: 'Plateforme communautaire automobile',
            year: '2025',
            role: 'Full-Stack Developer',
            context: 'Projet Personnel',
            tags: ['LARAVEL', 'REACT', 'TYPESCRIPT'],
            stack: ['Laravel', 'React', 'TypeScript', 'MySQL', 'Mantine', 'Figma'],
            links: [
                { url : 'https://modnation.fr', label: 'ModNation', icon: 'link' }
            ],
            blocks: [
                { type: 'intro', text: 'ModNation est une plateforme communautaire dédiée aux passionnés de l\'automobile, permettant de partager leurs "builds" (projets de modification de véhicules) et d\'inspirer la communauté.' },
                { type: 'image', src: 'assets/images/project_modnation_1.webp', caption: 'Page d’accueil de la plateforme', variant: 'full' },
                { type: 'chapter', label: 'Une base collaborative', paragraphs: [
                    'Le projet intègre une base de données collaborative de pièces compatibles, facilitant la recherche et le partage d\'informations techniques entre passionnés.'
                ]},
                { type: 'duo', images: ['assets/images/project_modnation_2.webp', 'assets/images/project_modnation_3.webp'], caption: 'Vues de la plateforme' },
                { type: 'chapter', label: 'Stack technique', paragraphs: [
                    'Stack technique moderne avec Laravel pour le backend robuste, React et TypeScript pour une interface réactive et typée, et MySQL pour la gestion des données relationnelles complexes.'
                ]},
                { type: 'image', src: 'assets/images/project_modnation_4.webp', caption: 'Détail de l’interface', variant: 'right' }
            ]
        },
        portfolio: {
            number: '04',
            title: 'Portfolio 2025',
            subtitle: 'Vitrine numérique personnelle',
            year: '2025',
            role: 'Designer & Developer',
            context: 'Projet Personnel',
            tags: ['WEBGL', 'THREE.JS', 'DESIGN'],
            stack: ['HTML/CSS', 'JavaScript', 'Three.js', 'WebGL', 'Figma'],
            links: [
                { url: 'https://leo-bernard38.github.io/Portfolio-2025/', label: 'Portfolio 2025', icon: 'link' },
                { url: 'https://github.com/Leo-BERNARD38/Portfolio-2025', label: 'Code Source', icon: 'link' }
            ],
            blocks: [
                { type: 'intro', text: 'Mon ancien portfolio professionnel, conçu pour présenter mon parcours hybride entre développement et design.' },
                { type: 'quote', text: 'Technique solide, créativité assumée.', cite: 'L’approche' },
                { type: 'chapter', label: 'Exploration WebGL', paragraphs: [
                    'Ce projet m\'a permis d\'explorer Three.js et les effets WebGL pour créer une expérience immersive unique avec un effet water-plane en arrière-plan.'
                ]},
                { type: 'chapter', label: 'Performance & accessibilité', paragraphs: [
                    'L\'architecture du site privilégie la performance et l\'accessibilité tout en proposant des micro-interactions soignées.'
                ]}
            ]
        },
        secret: {
            number: '05',
            title: 'Projet Secret 🤫',
            subtitle: 'Plateforme communautaire innovante',
            year: '2025',
            role: 'Co-fondateur & Lead Developer',
            context: 'Projet entre camarades',
            tags: ['STARTUP', 'IA', 'REACT', 'Python'],
            stack: ['React', 'TypeScript', 'Python', 'Mistral API', 'MySQL', 'Figma'],
            links: [],
            blocks: [
                { type: 'intro', text: 'Un projet ambitieux lancé début 2025 avec un camarade de promotion : créer une plateforme communautaire révolutionnaire pour partager les meilleurs bons plans régionaux.' },
                { type: 'chapter', label: 'L’innovation', paragraphs: [
                    'Une intelligence artificielle personnalisée qui analyse les préférences utilisateurs pour suggérer des recommandations pertinentes et contextuelles.'
                ]},
                { type: 'chapter', label: 'Le laboratoire', paragraphs: [
                    'Ce laboratoire d\'innovation privé nous permet d\'explorer les limites des technologies actuelles tout en construisant un produit avec un réel potentiel commercial.'
                ]},
                { type: 'quote', text: 'Plus d’infos bientôt… 👀', cite: 'Statut — confidentiel' }
            ]
        },
        youtube: {
            number: '06',
            title: 'YouTube @WNT',
            subtitle: 'Création de contenu vidéo & VFX',
            year: '2016 - Présent',
            role: 'Créateur & Monteur',
            context: 'Projet Personnel',
            tags: ['PREMIERE PRO', 'AFTER EFFECTS', 'MOTION DESIGN'],
            stack: ['After Effects', 'Premiere Pro', 'Photoshop', 'Audition', 'Filmora', 'Topaz Labs'],
            links: [
                { url: 'https://www.youtube.com/@WNT_38', label: 'YouTube @WNT', icon: 'link' }
            ],
            blocks: [
                { type: 'intro', text: 'Depuis 2016, je développe ma chaîne YouTube où j\'explore la création de contenu sous toutes ses formes : montage vidéo, effets visuels, storytelling et motion design.' },
                { type: 'chapter', label: 'La Suite Adobe', paragraphs: [
                    'Ce projet personnel m\'a permis de maîtriser la Suite Adobe (Premiere Pro, After Effects, Photoshop) et de développer un œil créatif qui nourrit aujourd\'hui mon travail en UX/UI design.'
                ]},
                { type: 'quote', text: 'Le rythme, la narration, l’engagement utilisateur — des concepts directement transposables au design d’interfaces.', cite: 'Ce que ça m’apporte' }
            ]
        }
    };

    const projectKeys = Object.keys(projectsData);
    const pad = (n) => String(n).padStart(2, '0');
    let currentProjectIndex = 0;
    let freshUntil = 0;

    function bindCursorHover(el) {
        el.addEventListener('mouseenter', () => {
            document.querySelector('.cursor')?.classList.add('active');
            document.querySelector('.cursor-follower')?.classList.add('active');
        });
        el.addEventListener('mouseleave', () => {
            document.querySelector('.cursor')?.classList.remove('active');
            document.querySelector('.cursor-follower')?.classList.remove('active');
        });
    }

    // Révélation des blocs au scroll — root = conteneur scrollable de la modale.
    // Juste après un changement de contenu (freshUntil), les blocs visibles
    // reçoivent un délai en cascade pour une entrée orchestrée.
    const blockObserver = new IntersectionObserver((entries) => {
        const fresh = performance.now() < freshUntil;
        let order = 0;
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.style.transitionDelay = fresh ? `${Math.min(250 + order * 90, 850)}ms` : '';
            if (fresh) order++;
            entry.target.classList.add('is-in');
            blockObserver.unobserve(entry.target);
        });
    }, { root: container, threshold: 0.06, rootMargin: '0px 0px -4% 0px' });

    function watchReveal(el) {
        if (!el || prefersReducedMotion) return;
        el.classList.add('pm-reveal');
        el.classList.remove('is-in');
        el.style.transitionDelay = '';
        blockObserver.unobserve(el);
        blockObserver.observe(el);
    }

    function makeFigure(src, alt, variant) {
        const fig = document.createElement('figure');
        fig.className = 'pm-figure' + (variant ? ` pm-figure--${variant}` : '');
        const frame = document.createElement('div');
        frame.className = 'pm-figure__frame';
        const img = document.createElement('img');
        img.src = src;
        img.alt = alt;
        img.loading = 'lazy';
        img.decoding = 'async';
        const overlay = document.createElement('div');
        overlay.className = 'pm-figure__overlay';
        frame.appendChild(img);
        frame.appendChild(overlay);
        frame.addEventListener('click', () => openLightbox(src, alt));
        bindCursorHover(frame);
        fig.appendChild(frame);
        return fig;
    }

    function renderBlocks(project) {
        bodyEl.innerHTML = '';
        let chapterCount = 0;
        let figCount = 0;

        (project.blocks || []).forEach(block => {
            let el = null;

            if (block.type === 'intro') {
                el = document.createElement('div');
                el.className = 'pm-intro';
                el.innerHTML = `<p>${block.text}</p>`;
            }

            if (block.type === 'chapter') {
                chapterCount++;
                el = document.createElement('section');
                el.className = 'pm-chapter';
                el.innerHTML = `
                    <div class="pm-chapter__side">
                        <span class="pm-chapter__num">${pad(chapterCount)}</span>
                        <span class="pm-chapter__label mono-text">${block.label}</span>
                    </div>
                    <div class="pm-chapter__text">
                        ${block.paragraphs.map(p => `<p>${p}</p>`).join('')}
                    </div>
                `;
            }

            if (block.type === 'image') {
                figCount++;
                el = makeFigure(block.src, project.title, block.variant);
                const cap = document.createElement('figcaption');
                cap.className = 'pm-figure__caption mono-text';
                cap.innerHTML = `<span class="pm-figure__num">Fig. ${pad(figCount)}</span>${block.caption || project.title}`;
                el.appendChild(cap);
            }

            if (block.type === 'duo') {
                el = document.createElement('div');
                el.className = 'pm-duo';
                block.images.forEach(src => {
                    figCount++;
                    el.appendChild(makeFigure(src, project.title));
                });
                const cap = document.createElement('div');
                cap.className = 'pm-figure__caption pm-duo__caption mono-text';
                cap.innerHTML = `<span class="pm-figure__num">Fig. ${pad(figCount - 1)}–${pad(figCount)}</span>${block.caption || project.title}`;
                el.appendChild(cap);
            }

            if (block.type === 'quote') {
                el = document.createElement('blockquote');
                el.className = 'pm-quote';
                el.innerHTML = `<p>${block.text}</p>${block.cite ? `<cite class="mono-text">${block.cite}</cite>` : ''}`;
            }

            if (el) {
                bodyEl.appendChild(el);
                watchReveal(el);
            }
        });
    }

    function updateModalContent(project) {
        heroEl.classList.remove('is-in');

        modal.querySelector('.project-modal__number').textContent = project.number;
        modal.querySelector('.pm-hero__index-current').textContent = project.number;
        modal.querySelector('.pm-hero__index-total').textContent = `/${pad(projectKeys.length)}`;
        modal.querySelector('.project-modal__title').textContent = project.title;
        modal.querySelector('.project-modal__subtitle').textContent = project.subtitle;
        modal.querySelector('.project-modal__year').textContent = project.year;
        modal.querySelector('.project-modal__role').textContent = project.role;
        modal.querySelector('.project-modal__context').textContent = project.context;

        modal.querySelector('.project-modal__tags').innerHTML = project.tags.map(tag =>
            `<span class="tag mono-text">${tag}</span>`
        ).join('');

        modal.querySelector('.project-modal__stack-list').innerHTML = project.stack.map(tech =>
            `<span class="tag mono-text">${tech}</span>`
        ).join('');

        // Liens dans le colophon
        const linksContainer = modal.querySelector('.project-modal__links');
        const linksWrapper = modal.querySelector('.project-modal__links-container');
        if (linksContainer && linksWrapper) {
            linksContainer.innerHTML = '';
            if (project.links && project.links.length > 0) {
                linksWrapper.style.display = '';
                project.links.forEach((link) => {
                    const btn = document.createElement('a');
                    btn.href = link.url;
                    btn.target = '_blank';
                    btn.rel = 'noopener';
                    btn.className = 'project-modal__sidebar-link';
                    btn.innerHTML = `
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                            <polyline points="15 3 21 3 21 9"/>
                            <line x1="10" y1="14" x2="21" y2="3"/>
                        </svg>
                        <span>${link.label}</span>
                    `;
                    bindCursorHover(btn);
                    linksContainer.appendChild(btn);
                });
            } else {
                linksWrapper.style.display = 'none';
            }
        }

        renderBlocks(project);

        // Navigation bas de page (boucle sur les 6 projets)
        const n = projectKeys.length;
        const prevProject = projectsData[projectKeys[(currentProjectIndex - 1 + n) % n]];
        const nextProject = projectsData[projectKeys[(currentProjectIndex + 1) % n]];
        modal.querySelector('.pm-footer__prev-title').textContent = prevProject.title;
        modal.querySelector('.pm-footer__next-num').textContent = `№ ${nextProject.number}`;
        modal.querySelector('.pm-footer__next-name').textContent = nextProject.title;

        // Révélation des éléments fixes
        watchReveal(modal.querySelector('.pm-colophon'));
        watchReveal(modal.querySelector('.project-modal__stack'));
        watchReveal(modal.querySelector('.pm-footer'));

        container.scrollTop = 0;
        freshUntil = performance.now() + 1400;

        if (prefersReducedMotion) {
            heroEl.classList.add('is-in');
        } else {
            requestAnimationFrame(() => requestAnimationFrame(() => heroEl.classList.add('is-in')));
        }
    }

    function openModal(projectId) {
        const project = projectsData[projectId];
        if (!project) return;

        PageTransition.animate(() => {
            currentProjectIndex = projectKeys.indexOf(projectId);
            updateModalContent(project);

            modal.classList.add('active');
            document.body.classList.add('modal-open');
        }, false, { kicker: `Étude de cas — № ${project.number}`, word: project.title });
    }

    function closeModal() {
        PageTransition.animate(() => {
            modal.classList.remove('active');
            document.body.classList.remove('modal-open');
        }, true, { kicker: 'Retour au sommaire', word: 'Léo Bernard' });
    }

    function goToProject(index) {
        currentProjectIndex = (index + projectKeys.length) % projectKeys.length;
        updateModalContent(projectsData[projectKeys[currentProjectIndex]]);
    }

    // Event listeners
    projectItems.forEach(item => {
        item.addEventListener('click', () => {
            openModal(item.dataset.project);
        });

        // Accessibilité clavier pour les <article role="button">
        item.addEventListener('keydown', (e) => {
            if (item.tagName === 'BUTTON') return;
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openModal(item.dataset.project);
            }
        });
    });

    closeBtn?.addEventListener('click', closeModal);
    backdrop?.addEventListener('click', closeModal);
    prevBtn?.addEventListener('click', () => goToProject(currentProjectIndex - 1));
    nextBtn?.addEventListener('click', () => goToProject(currentProjectIndex + 1));

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active')) return;

        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowLeft') goToProject(currentProjectIndex - 1);
        if (e.key === 'ArrowRight') goToProject(currentProjectIndex + 1);
    });
}

/* ----------------------------------------
   Lightbox System
   ---------------------------------------- */
function initLightbox() {
    // Create Lightbox DOM
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.id = 'lightbox';
    lightbox.innerHTML = `
        <button class="lightbox__close" aria-label="Fermer">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
        </button>
        <div class="lightbox__content">
            <img src="" alt="" class="lightbox__img">
        </div>
    `;
    document.body.appendChild(lightbox);

    const closeBtn = lightbox.querySelector('.lightbox__close');
    const img = lightbox.querySelector('.lightbox__img');

    // Close functions
    const closeLightbox = () => {
        lightbox.classList.remove('active');
        setTimeout(() => {
            img.src = '';
        }, 400);

        // Reset cursor state when closing
        const cursor = document.querySelector('.cursor');
        const follower = document.querySelector('.cursor-follower');
        if (cursor && follower) {
            cursor.classList.remove('active');
            follower.classList.remove('active');
        }
    };

    closeBtn.addEventListener('click', closeLightbox);

    // Custom Cursor for Close Button
    closeBtn.addEventListener('mouseenter', () => {
        const cursor = document.querySelector('.cursor');
        const follower = document.querySelector('.cursor-follower');
        if (cursor && follower) {
            cursor.classList.add('active');
            follower.classList.add('active');
        }
    });
    
    closeBtn.addEventListener('mouseleave', () => {
        const cursor = document.querySelector('.cursor');
        const follower = document.querySelector('.cursor-follower');
        if (cursor && follower) {
            cursor.classList.remove('active');
            follower.classList.remove('active');
        }
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}

function openLightbox(src, alt) {
    const lightbox = document.getElementById('lightbox');
    const img = lightbox.querySelector('.lightbox__img');
    
    if (!lightbox || !img) return;

    img.src = src;
    img.alt = alt || '';
    lightbox.classList.add('active');
}

/* ----------------------------------------
   Service Cards Glow Effect
   ---------------------------------------- */
function initServiceCardsGlow(isTouchDevice) {
    if (isTouchDevice) return;
    
    const cards = document.querySelectorAll('.service-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', rafThrottle((e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            card.style.setProperty('--mouse-x', `${x}%`);
            card.style.setProperty('--mouse-y', `${y}%`);
        }), { passive: true });
    });
}

/* ----------------------------------------
   Button Glow Effect (follows cursor)
   ---------------------------------------- */
function initButtonGlow(isTouchDevice) {
    if (isTouchDevice) return;
    
    const wrappers = document.querySelectorAll('.btn-wrapper');
    const PARALLAX_STRENGTH = 20; // pixels
    
    wrappers.forEach(wrapper => {
        const btn = wrapper.querySelector('.btn');

        wrapper.addEventListener('mousemove', rafThrottle((e) => {
            const rect = wrapper.getBoundingClientRect();
            // Normalize to -1 to 1 range (center = 0)
            const normalizedX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
            const normalizedY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

            // Inverse parallax: mouse goes right, text goes left
            const translateX = -normalizedX * PARALLAX_STRENGTH;
            const translateY = -normalizedY * PARALLAX_STRENGTH;

            wrapper.style.setProperty('--translate-x', `${translateX}px`);
            wrapper.style.setProperty('--translate-y', `${translateY}px`);

            // Effet magnétique : le bouton suit légèrement le curseur
            if (btn) {
                btn.style.transform =
                    `translate(${(normalizedX * 5).toFixed(1)}px, ${(normalizedY * 5).toFixed(1)}px) scale(1.02)`;
            }
        }), { passive: true });

        wrapper.addEventListener('mouseleave', () => {
            // Smooth return to center
            wrapper.style.setProperty('--translate-x', '0px');
            wrapper.style.setProperty('--translate-y', '0px');
            if (btn) btn.style.transform = '';
        });
    });
}

/* ----------------------------------------
   Services Carousel Navigation
   ---------------------------------------- */
function initServicesCarousel() {
    const grid = document.querySelector('.services__grid');
    const dots = document.querySelectorAll('.services__dot');
    const prevBtn = document.querySelector('.services__nav-btn--prev');
    const nextBtn = document.querySelector('.services__nav-btn--next');
    const cards = document.querySelectorAll('.service-card');
    
    if (!grid || !dots.length || !cards.length) return;
    
    let currentIndex = 0;
    const totalCards = cards.length;
    
    // Update active dot
    const updateDots = (index) => {
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    };
    
    // Scroll to card
    const scrollToCard = (index) => {
        if (index < 0) index = 0;
        if (index >= totalCards) index = totalCards - 1;
        
        currentIndex = index;
        const card = cards[index];
        
        if (card) {
            card.scrollIntoView({
                behavior: 'smooth',
                inline: 'center',
                block: 'nearest'
            });
        }
        
        updateDots(currentIndex);
    };
    
    // Dot clicks
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            scrollToCard(index);
        });
    });
    
    // Arrow clicks
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            scrollToCard(currentIndex - 1);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            scrollToCard(currentIndex + 1);
        });
    }
    
    // Detect scroll and update dots
    let scrollTimeout;
    grid.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const gridRect = grid.getBoundingClientRect();
            const gridCenter = gridRect.left + gridRect.width / 2;
            
            let closestIndex = 0;
            let closestDistance = Infinity;
            
            cards.forEach((card, index) => {
                const cardRect = card.getBoundingClientRect();
                const cardCenter = cardRect.left + cardRect.width / 2;
                const distance = Math.abs(gridCenter - cardCenter);
                
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestIndex = index;
                }
            });
            
            if (closestIndex !== currentIndex) {
                currentIndex = closestIndex;
                updateDots(currentIndex);
            }
        }, 50);
    }, { passive: true });
}

/* ----------------------------------------
   Console Easter Egg
   ---------------------------------------- */
console.log(
`%c
LÉO BERNARD
Web Developer & UX/UI Designer
%c

    • Stack: HTML5, CSS3 (BEM), Vanilla JS
    • Performance: Critical CSS, Defer Loading
    • Animation: Custom RAF & Observers
    %c

    📧 leobernard712@gmail.com
    
    `,
    'font-family: sans-serif; font-size: 24px; font-weight: 800; color: #fff; background: #0a0a0a; line-height: 1.2;',
    'font-family: monospace; font-size: 12px; color: #888; line-height: 1.6;',
    'font-family: sans-serif; font-size: 13px; color: #ff4d00; font-weight: bold; line-height: 1.6;'
);
