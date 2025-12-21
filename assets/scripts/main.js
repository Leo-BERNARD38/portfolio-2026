/* ========================================
   PORTFOLIO 2026 - Main JavaScript
   Micro-interactions & Animations
   ======================================== */

// Initialize loader immediately
initLoader();

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initCustomCursor();
    initSmoothScroll();
    initNavigation();
    initScrollAnimations();
    initParallax();
    initMagneticButtons();
    initProjectModal();
});

/* ----------------------------------------
   Loader / Preloader
   ---------------------------------------- */
function initLoader() {
    // Add loading class immediately
    document.body.classList.add('loading');
    
    const loader = document.getElementById('loader');
    if (!loader) return;
    
    // Minimum display time for good UX (even on fast connections)
    const MIN_LOADER_TIME = 1800; // 1.8 seconds minimum
    const loaderStartTime = Date.now();
    
    // Track loading progress
    let progress = 0;
    let isLoaded = false;
    const progressBar = loader.querySelector('.loader__progress-bar');
    
    // Simulate loading with actual resource tracking
    const updateProgress = (value) => {
        progress = Math.min(value, 100);
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
    };
    
    // Check if all resources are loaded
    const hideLoader = () => {
        const elapsedTime = Date.now() - loaderStartTime;
        const remainingTime = Math.max(0, MIN_LOADER_TIME - elapsedTime);
        
        // Wait for minimum time before hiding
        setTimeout(() => {
            loader.classList.add('loaded');
            document.body.classList.remove('loading');
            
            // Remove loader from DOM after animation
            setTimeout(() => {
                loader.style.display = 'none';
            }, 800);
        }, remainingTime);
    };
    
    // Wait for window load (all resources)
    window.addEventListener('load', () => {
        isLoaded = true;
        updateProgress(100);
        hideLoader();
    });
    
    // Fallback: hide loader after max 4 seconds
    setTimeout(() => {
        if (!loader.classList.contains('loaded')) {
            updateProgress(100);
            hideLoader();
        }
    }, 4000);
    
    // Progressive loading simulation for smoother UX
    let simulatedProgress = 0;
    const simulateProgress = setInterval(() => {
        // Slow down near the end if not yet loaded
        const increment = isLoaded ? 20 : Math.random() * 10;
        simulatedProgress += increment;
        
        if (simulatedProgress < 85 || isLoaded) {
            updateProgress(Math.min(simulatedProgress, 100));
        }
        
        if (simulatedProgress >= 100) {
            clearInterval(simulateProgress);
        }
    }, 120);
}

/* ----------------------------------------
   Custom Cursor
   ---------------------------------------- */
function initCustomCursor() {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    
    if (!cursor || !follower) return;
    
    // Check for touch device
    if ('ontouchstart' in window) {
        cursor.style.display = 'none';
        follower.style.display = 'none';
        return;
    }
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let followerX = 0;
    let followerY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Smooth cursor animation
    function animateCursor() {
        // Cursor follows instantly
        cursorX += (mouseX - cursorX) * 0.5;
        cursorY += (mouseY - cursorY) * 0.5;
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;
        
        // Follower has delay
        followerX += (mouseX - followerX) * 0.15;
        followerY += (mouseY - followerY) * 0.15;
        follower.style.left = `${followerX}px`;
        follower.style.top = `${followerY}px`;
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Cursor interactions
    const interactiveElements = document.querySelectorAll('a, button, .bento-item');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(2)';
            cursor.style.backgroundColor = '#CCF077';
            follower.style.width = '60px';
            follower.style.height = '60px';
            follower.style.borderColor = '#CCF077';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.backgroundColor = '#1A1A1A';
            follower.style.width = '40px';
            follower.style.height = '40px';
            follower.style.borderColor = '#1A1A1A';
        });
    });
}

/* ----------------------------------------
   Smooth Scroll
   ---------------------------------------- */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ----------------------------------------
   Navigation
   ---------------------------------------- */
function initNavigation() {
    const header = document.querySelector('.header');
    const menuBtn = document.querySelector('.nav__menu-btn');
    const navLinks = document.querySelector('.nav__links');
    
    // Header scroll effect
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.boxShadow = '0 2px 20px rgba(26, 26, 26, 0.05)';
        } else {
            header.style.boxShadow = 'none';
        }
        
        // Hide/show header on scroll
        if (currentScroll > lastScroll && currentScroll > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });
    
    // Mobile menu toggle
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('active');
            navLinks?.classList.toggle('active');
        });
    }
}

/* ----------------------------------------
   Scroll Animations (Intersection Observer)
   ---------------------------------------- */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.section-header, .bento-item, .service-card, .about__image-col, .about__content-col, .testimonial'
    );
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Add initial styles
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
    
    // Add CSS for animated state
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

/* ----------------------------------------
   Parallax Effects
   ---------------------------------------- */
function initParallax() {
    const heroVisual = document.querySelector('.hero__visual');
    const heroContent = document.querySelector('.hero__content');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.3;
        
        if (heroVisual) {
            heroVisual.style.transform = `translateY(${rate}px)`;
        }
        
        if (heroContent) {
            heroContent.style.transform = `translateY(${rate * 0.5}px)`;
        }
    });
}

/* ----------------------------------------
   Magnetic Buttons
   ---------------------------------------- */
function initMagneticButtons() {
    const magneticElements = document.querySelectorAll('.btn--primary, .btn--large, .nav__link--cta');
    
    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });
        
        el.addEventListener('mouseleave', () => {
            el.style.transform = 'translate(0, 0)';
        });
    });
}

/* ----------------------------------------
   Text Reveal Animation (optional)
   ---------------------------------------- */
function splitTextToSpans(element) {
    const text = element.textContent;
    element.innerHTML = '';
    
    text.split('').forEach((char, i) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.animationDelay = `${i * 0.03}s`;
        span.classList.add('char');
        element.appendChild(span);
    });
}

/* ----------------------------------------
   Counter Animation
   ---------------------------------------- */
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const updateCounter = () => {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + (element.dataset.suffix || '');
        }
    };
    
    updateCounter();
}

/* ----------------------------------------
   Image Lazy Loading
   ---------------------------------------- */
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

/* ----------------------------------------
   Bento Grid Hover Effect
   ---------------------------------------- */
document.querySelectorAll('.bento-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.zIndex = '10';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.zIndex = '1';
    });
});

/* ----------------------------------------
   Project Modal System
   ---------------------------------------- */
function initProjectModal() {
    const modal = document.getElementById('projectModal');
    if (!modal) return;
    
    const backdrop = modal.querySelector('.project-modal__backdrop');
    const closeBtn = modal.querySelector('.project-modal__close');
    const prevBtn = modal.querySelector('.project-modal__nav-btn--prev');
    const nextBtn = modal.querySelector('.project-modal__nav-btn--next');
    const projectItems = document.querySelectorAll('.bento-item[data-project]');
    
    // Project data
    const projectsData = {
        optiwits: {
            number: '01',
            title: 'OptiWITS™',
            subtitle: 'Plateforme SaaS d\'optimisation de parcs éoliens',
            year: '2025',
            role: 'UX/UI Designer & Full-Stack Developer',
            context: 'Stage M2 — GreenWITS',
            description: `
                <p>OptiWITS™ est une plateforme SaaS innovante permettant aux exploitants de parcs éoliens d'optimiser la performance de leurs installations grâce à des algorithmes prédictifs et des visualisations de données avancées.</p>
                <p>Ma mission : transformer une version bêta fonctionnelle en un produit commercialisable. J'ai mené la refonte complète de l'expérience utilisateur, repensé l'architecture front-end et implémenté de nouvelles fonctionnalités métier critiques.</p>
                <p>Le défi principal était de rendre accessible une technologie complexe à des utilisateurs non-techniques, tout en conservant la profondeur d'analyse nécessaire aux experts.</p>
            `,
            tags: ['SAAS', 'UX/UI', 'FULL-STACK'],
            stack: ['React', 'TypeScript', 'Python', 'PostgreSQL', 'Figma', 'Docker'],
            links: {}
        },
        ccp: {
            number: '02',
            title: 'Camping-Car Partner',
            subtitle: 'Extranet B2B avec CRM intégré',
            year: '2023 — 2024',
            role: 'Full-Stack Developer (Solo)',
            context: 'Stage Licence + Stage M1',
            description: `
                <p>Conception et développement complet d'un extranet B2B pour Camping-Car Partner, intégrant un CRM sur-mesure pour la gestion de la relation client et des outils collaboratifs internes.</p>
                <p>Particularité de ce projet : j'étais seul à porter l'ensemble du développement, de la phase de maquettage jusqu'au déploiement en production. Cette autonomie m'a permis de développer une vision globale du cycle de vie d'un projet.</p>
                <p>Fonctionnalités clés : gestion des dossiers clients, outils de communication interne, tableaux de bord analytiques, système de notifications, et intégration avec les outils existants de l'entreprise.</p>
            `,
            tags: ['B2B', 'CRM', 'PHP'],
            stack: ['PHP', 'MySQL', 'JavaScript', 'jQuery', 'Bootstrap', 'Figma'],
            links: {}
        },
        youtube: {
            number: '03',
            title: 'YouTube @WNT',
            subtitle: 'Création de contenu vidéo & VFX',
            year: '2016 — Présent',
            role: 'Créateur & Monteur',
            context: 'Projet Personnel',
            description: `
                <p>Depuis 2016, je développe ma chaîne YouTube où j'explore la création de contenu sous toutes ses formes : montage vidéo, effets visuels, storytelling et motion design.</p>
                <p>Ce projet personnel m'a permis de maîtriser la Suite Adobe (Premiere Pro, After Effects, Photoshop) et de développer un œil créatif qui nourrit aujourd'hui mon travail en UX/UI design.</p>
                <p>Au-delà des compétences techniques, cette expérience m'a appris l'importance du rythme, de la narration et de l'engagement utilisateur — des concepts directement transposables au design d'interfaces.</p>
            `,
            tags: ['MOTION', 'AFTER EFFECTS', 'PREMIERE PRO'],
            stack: ['After Effects', 'Premiere Pro', 'Photoshop', 'Audition', 'Blender'],
            links: {
                site: 'https://www.youtube.com/@WNT_38'
            }
        },
        portfolio: {
            number: '04',
            title: 'Portfolio 2024',
            subtitle: 'Vitrine numérique personnelle',
            year: '2024',
            role: 'Designer & Developer',
            context: 'Projet Personnel',
            description: `
                <p>Mon premier portfolio professionnel, conçu pour présenter mon parcours hybride entre développement et design. Une vitrine qui reflète mon approche : technique solide, créativité assumée.</p>
                <p>Ce projet m'a permis d'explorer Three.js et les effets WebGL pour créer une expérience immersive unique avec un effet water-plane en arrière-plan.</p>
                <p>L'architecture du site privilégie la performance et l'accessibilité tout en proposant des micro-interactions soignées.</p>
            `,
            tags: ['WEBGL', 'THREE.JS', 'DESIGN'],
            stack: ['HTML/CSS', 'JavaScript', 'Three.js', 'GSAP', 'Figma'],
            links: {
                github: 'https://github.com/Leo-BERNARD38/Portfolio-2025'
            }
        },
        secret: {
            number: '05',
            title: 'Projet Secret 🤫',
            subtitle: 'Plateforme communautaire innovante',
            year: '2025',
            role: 'Co-fondateur & Lead Developer',
            context: 'Startup en développement',
            description: `
                <p>Un projet ambitieux lancé début 2025 avec un camarade de promotion : créer une plateforme communautaire révolutionnaire pour partager les meilleurs bons plans régionaux.</p>
                <p>L'innovation ? Une intelligence artificielle personnalisée qui analyse les préférences utilisateurs pour suggérer des recommandations pertinentes et contextuelles.</p>
                <p>Ce laboratoire d'innovation privé nous permet d'explorer les limites des technologies actuelles tout en construisant un produit avec un réel potentiel commercial. Plus d'infos bientôt... 👀</p>
            `,
            tags: ['STARTUP', 'IA', 'REACT'],
            stack: ['Next.js', 'TypeScript', 'Python', 'OpenAI API', 'MongoDB', 'Figma'],
            links: {}
        },
        others: {
            number: '06',
            title: 'Autres Projets',
            subtitle: 'Explorations créatives et techniques',
            year: '2022 — Présent',
            role: 'Developer & Designer',
            context: 'Projets Académiques & Personnels',
            description: `
                <p>Au fil de mon parcours, j'ai exploré de nombreuses technologies et approches créatives à travers des projets variés : applications web, expériences interactives, prototypes d'interfaces...</p>
                <p>Ces projets académiques et personnels m'ont permis de construire une base technique solide tout en développant ma sensibilité design. Chaque projet est une opportunité d'apprendre et d'expérimenter.</p>
                <p>De la data visualisation au développement mobile, en passant par les expériences WebGL, ma curiosité me pousse à explorer constamment de nouveaux territoires.</p>
            `,
            tags: ['REACT', 'FIGMA', 'THREE.JS'],
            stack: ['React', 'Angular', 'Python', 'Java', 'Figma', 'Three.js', 'GSAP'],
            links: {
                github: 'https://github.com/Leo-BERNARD38'
            }
        }
    };
    
    const projectKeys = Object.keys(projectsData);
    let currentProjectIndex = 0;
    
    // Open modal
    function openModal(projectId) {
        const project = projectsData[projectId];
        if (!project) return;
        
        currentProjectIndex = projectKeys.indexOf(projectId);
        updateModalContent(project);
        
        modal.classList.add('active');
        document.body.classList.add('modal-open');
        
        updateNavButtons();
    }
    
    // Close modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
    }
    
    // Update modal content
    function updateModalContent(project) {
        modal.querySelector('.project-modal__number').textContent = project.number;
        modal.querySelector('.project-modal__title').textContent = project.title;
        modal.querySelector('.project-modal__subtitle').textContent = project.subtitle;
        modal.querySelector('.project-modal__year').textContent = project.year;
        modal.querySelector('.project-modal__role').textContent = project.role;
        modal.querySelector('.project-modal__context').textContent = project.context;
        modal.querySelector('.project-modal__description').innerHTML = project.description;
        
        // Tags
        const tagsContainer = modal.querySelector('.project-modal__tags');
        tagsContainer.innerHTML = project.tags.map(tag => 
            `<span class="tag mono-text">${tag}</span>`
        ).join('');
        
        // Stack
        const stackContainer = modal.querySelector('.project-modal__stack-list');
        stackContainer.innerHTML = project.stack.map(tech => 
            `<span class="tag mono-text">${tech}</span>`
        ).join('');
        
        // Links
        const siteLink = modal.querySelector('.project-modal__link--site');
        const githubLink = modal.querySelector('.project-modal__link--github');
        
        if (project.links.site) {
            siteLink.href = project.links.site;
            siteLink.style.display = 'inline-flex';
        } else {
            siteLink.style.display = 'none';
        }
        
        if (project.links.github) {
            githubLink.href = project.links.github;
            githubLink.style.display = 'inline-flex';
        } else {
            githubLink.style.display = 'none';
        }
    }
    
    // Navigation between projects
    function updateNavButtons() {
        prevBtn.disabled = currentProjectIndex === 0;
        nextBtn.disabled = currentProjectIndex === projectKeys.length - 1;
    }
    
    function goToPrevProject() {
        if (currentProjectIndex > 0) {
            currentProjectIndex--;
            const projectId = projectKeys[currentProjectIndex];
            updateModalContent(projectsData[projectId]);
            updateNavButtons();
        }
    }
    
    function goToNextProject() {
        if (currentProjectIndex < projectKeys.length - 1) {
            currentProjectIndex++;
            const projectId = projectKeys[currentProjectIndex];
            updateModalContent(projectsData[projectId]);
            updateNavButtons();
        }
    }
    
    // Event listeners
    projectItems.forEach(item => {
        item.addEventListener('click', () => {
            const projectId = item.dataset.project;
            openModal(projectId);
        });
    });
    
    closeBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);
    prevBtn.addEventListener('click', goToPrevProject);
    nextBtn.addEventListener('click', goToNextProject);
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowLeft') goToPrevProject();
        if (e.key === 'ArrowRight') goToNextProject();
    });
}

/* ----------------------------------------
   Form Validation (if needed)
   ---------------------------------------- */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/* ----------------------------------------
   Console Easter Egg
   ---------------------------------------- */
console.log(`
%c⚡ Portfolio 2026 ⚡
%cDesigned & Developed with passion
%c→ Looking for the source code? Let's talk!

`, 
'font-size: 24px; font-weight: bold; color: #CCF077; background: #1A1A1A; padding: 10px;',
'font-size: 14px; color: #1A1A1A; padding: 5px;',
'font-size: 12px; color: #2C3E50; padding: 5px;'
);
