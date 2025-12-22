/* ========================================
   PORTFOLIO 2026 - Awwwards Creative Design
   Advanced Interactions & Animations
   Version 3.0
   ======================================== */

// Initialize immediately
initLoader();

document.addEventListener('DOMContentLoaded', () => {
    initCustomCursor();
    initSmoothScroll();
    initNavigation();
    initFullscreenMenu();
    initRevealAnimations();
    initMagneticElements();
    initProjectModal();
    initParallax();
    initTextAnimations();
    initServiceCardsGlow();
    initBentoGlow();
});

/* ----------------------------------------
   Loader / Preloader
   ---------------------------------------- */
function initLoader() {
    document.body.classList.add('loading');
    
    const loader = document.getElementById('loader');
    if (!loader) return;
    
    const MIN_LOADER_TIME = 2000;
    const loaderStartTime = Date.now();
    
    let progress = 0;
    const progressBar = loader.querySelector('.loader__progress-bar');
    
    const updateProgress = (value) => {
        progress = Math.min(value, 100);
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
    };
    
    const hideLoader = () => {
        const elapsedTime = Date.now() - loaderStartTime;
        const remainingTime = Math.max(0, MIN_LOADER_TIME - elapsedTime);
        
        setTimeout(() => {
            loader.classList.add('loaded');
            document.body.classList.remove('loading');
            
            // Trigger hero animations after loader
            setTimeout(() => {
                animateHeroEntrance();
            }, 200);
            
            setTimeout(() => {
                loader.style.display = 'none';
            }, 1000);
        }, remainingTime);
    };
    
    window.addEventListener('load', () => {
        updateProgress(100);
        hideLoader();
    });
    
    // Fallback
    setTimeout(() => {
        if (!loader.classList.contains('loaded')) {
            updateProgress(100);
            hideLoader();
        }
    }, 5000);
    
    // Progress simulation
    let simulatedProgress = 0;
    const simulateProgress = setInterval(() => {
        const increment = Math.random() * 15;
        simulatedProgress += increment;
        
        if (simulatedProgress < 90) {
            updateProgress(simulatedProgress);
        }
        
        if (simulatedProgress >= 100) {
            clearInterval(simulateProgress);
        }
    }, 100);
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
function initCustomCursor() {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    
    if (!cursor || !follower) return;
    
    // Check for touch device
    if ('ontouchstart' in window || window.matchMedia('(max-width: 1024px)').matches) {
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
    
    function animateCursor() {
        // Cursor with slight smoothing
        cursorX += (mouseX - cursorX) * 0.3;
        cursorY += (mouseY - cursorY) * 0.3;
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;
        
        // Follower with more delay
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        follower.style.left = `${followerX}px`;
        follower.style.top = `${followerY}px`;
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
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
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            // Close mobile menu if open
            const menu = document.querySelector('.fullscreen-menu');
            const menuBtn = document.querySelector('.nav__menu-btn');
            if (menu && menu.classList.contains('active')) {
                menu.classList.remove('active');
                menuBtn?.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
            
            // Si c'est juste "#", retour en haut
            if (targetId === '#') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }
            
            const target = document.querySelector(targetId);
            if (target) {
                const headerOffset = 0;
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
    const navLinks = document.querySelectorAll('.nav__link:not(.nav__link--cta)');
    const sections = document.querySelectorAll('section[id]');
    let lastScroll = 0;
    let ticking = false;
    
    // Active link based on scroll position
    function updateActiveLink() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
        
        // Remove active if at top (hero)
        if (scrollY < 300) {
            navLinks.forEach(link => link.classList.remove('active'));
        }
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateActiveLink();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Initial check
    updateActiveLink();
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
    
    // Also add reveal to key sections
    const sections = document.querySelectorAll('.section-header, .bento-item, .service-card, .about__image-col, .about__content-col, .testimonial');
    
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
   Magnetic Elements
   ---------------------------------------- */
function initMagneticElements() {
    const magneticElements = document.querySelectorAll('.magnetic-btn, .nav__link--cta');
    
    if (window.matchMedia('(max-width: 1024px)').matches) return;
    
    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        
        el.addEventListener('mouseleave', () => {
            el.style.transform = 'translate(0, 0)';
            el.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        });
        
        el.addEventListener('mouseenter', () => {
            el.style.transition = 'transform 0.1s ease';
        });
    });
}

/* ----------------------------------------
   Parallax Effects
   ---------------------------------------- */
function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    const heroBgText = document.querySelector('.hero__bg-text');
    
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                
                // Hero background text parallax
                if (heroBgText) {
                    heroBgText.style.transform = `translate(-50%, calc(-50% + ${scrolled * 0.3}px))`;
                }
                
                // Generic parallax elements
                parallaxElements.forEach(el => {
                    const speed = el.dataset.parallax || 0.5;
                    const yPos = scrolled * speed;
                    el.style.transform = `translateY(${yPos}px)`;
                });
                
                ticking = false;
            });
            ticking = true;
        }
    });
}

/* ----------------------------------------
   Text Animations
   ---------------------------------------- */
function initTextAnimations() {
    // Split text animation for hero title
    const heroTitleLines = document.querySelectorAll('.hero__title-line');
    
    heroTitleLines.forEach(line => {
        const text = line.textContent;
        line.innerHTML = `<span>${text}</span>`;
    });
}

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
        modnation: {
            number: '03',
            title: 'ModNation',
            subtitle: 'Plateforme communautaire automobile',
            year: '2025',
            role: 'Full-Stack Developer',
            context: 'Projet Personnel',
            description: `
                <p>ModNation est une plateforme communautaire dédiée aux passionnés de l'automobile, permettant de partager leurs "builds" (projets de modification de véhicules) et d'inspirer la communauté.</p>
                <p>Le projet intègre une base de données collaborative de pièces compatibles, facilitant la recherche et le partage d'informations techniques entre passionnés.</p>
                <p>Stack technique moderne avec Laravel pour le backend robuste, React et TypeScript pour une interface réactive et typée, et MySQL pour la gestion des données relationnelles complexes.</p>
            `,
            tags: ['LARAVEL', 'REACT', 'TYPESCRIPT'],
            stack: ['Laravel', 'React', 'TypeScript', 'MySQL', 'Tailwind CSS'],
            links: {}
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
        youtube: {
            number: '06',
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
        }
    };
    
    const projectKeys = Object.keys(projectsData);
    let currentProjectIndex = 0;
    
    function openModal(projectId) {
        const project = projectsData[projectId];
        if (!project) return;
        
        currentProjectIndex = projectKeys.indexOf(projectId);
        updateModalContent(project);
        
        modal.classList.add('active');
        document.body.classList.add('modal-open');
        
        updateNavButtons();
    }
    
    function closeModal() {
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
    }
    
    function updateModalContent(project) {
        modal.querySelector('.project-modal__number').textContent = project.number;
        modal.querySelector('.project-modal__title').textContent = project.title;
        modal.querySelector('.project-modal__subtitle').textContent = project.subtitle;
        modal.querySelector('.project-modal__year').textContent = project.year;
        modal.querySelector('.project-modal__role').textContent = project.role;
        modal.querySelector('.project-modal__context').textContent = project.context;
        modal.querySelector('.project-modal__description').innerHTML = project.description;
        
        const tagsContainer = modal.querySelector('.project-modal__tags');
        tagsContainer.innerHTML = project.tags.map(tag => 
            `<span class="tag mono-text">${tag}</span>`
        ).join('');
        
        const stackContainer = modal.querySelector('.project-modal__stack-list');
        stackContainer.innerHTML = project.stack.map(tech => 
            `<span class="tag mono-text">${tech}</span>`
        ).join('');
        
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
    
    closeBtn?.addEventListener('click', closeModal);
    backdrop?.addEventListener('click', closeModal);
    prevBtn?.addEventListener('click', goToPrevProject);
    nextBtn?.addEventListener('click', goToNextProject);
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowLeft') goToPrevProject();
        if (e.key === 'ArrowRight') goToNextProject();
    });
}

/* ----------------------------------------
   Service Cards Glow Effect
   ---------------------------------------- */
function initServiceCardsGlow() {
    const cards = document.querySelectorAll('.service-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            card.style.setProperty('--mouse-x', `${x}%`);
            card.style.setProperty('--mouse-y', `${y}%`);
        });
    });
}

// Bento Items Glow Effect
function initBentoGlow() {
    const bentoItems = document.querySelectorAll('.bento-item');
    
    bentoItems.forEach(item => {
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            item.style.setProperty('--mouse-x', `${x}%`);
            item.style.setProperty('--mouse-y', `${y}%`);
        });
    });
}

/* ----------------------------------------
   Bento Grid Hover Effect
   ---------------------------------------- */
document.querySelectorAll('.bento-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.zIndex = '10';
    });
    
    item.addEventListener('mouseleave', function() {
        setTimeout(() => {
            this.style.zIndex = '1';
        }, 300);
    });
});

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

    👋 Open to work
    📧 leobernard712@gmail.com
    
    `,
    'font-family: sans-serif; font-size: 24px; font-weight: 800; color: #fff; background: #0a0a0a; line-height: 1.2;',
    'font-family: monospace; font-size: 12px; color: #888; line-height: 1.6;',
    'font-family: sans-serif; font-size: 13px; color: #ff4d00; font-weight: bold; line-height: 1.6;'
);
