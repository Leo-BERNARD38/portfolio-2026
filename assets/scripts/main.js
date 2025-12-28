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
    PageTransition.init();
    initProjectModal();
    initParallax();
    initTextAnimations();
    initServiceCardsGlow();
    initBentoGlow();
    initLightbox();
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
    
    const progressBar = loader.querySelector('.loader__progress-bar');
    let progress = progressBar ? parseInt(progressBar.style.width) || 0 : 0;
    
    const updateProgress = (value) => {
        progress = Math.min(value, 100);
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
    };
    
    const hideLoader = () => {
        if (window.loaderInterval) clearInterval(window.loaderInterval);
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
    if (window.loaderInterval) clearInterval(window.loaderInterval);
    
    let simulatedProgress = progress;
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
    
    // Check for touch device or no hover capability
    if (window.matchMedia('(hover: none)').matches) {
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
        // Preserve inline markup (<em>, <u>, etc.) by wrapping existing nodes.
        // Also keep it idempotent if called multiple times.
        if (line.childNodes.length === 1 && line.firstElementChild?.tagName === 'SPAN') return;

        const wrapper = document.createElement('span');
        while (line.firstChild) {
            wrapper.appendChild(line.firstChild);
        }
        line.appendChild(wrapper);
    });
}

/* ----------------------------------------
   Page Transition Manager
   ---------------------------------------- */
const PageTransition = {
    element: null,
    panel: null,
    isAnimating: false,
    
    init() {
        this.element = document.querySelector('.page-transition');
        this.panel = document.querySelector('.page-transition__panel');
    },
    
    animate(callback, reverse = false) {
        if (this.isAnimating || !this.element) {
            if (callback) callback();
            return;
        }
        
        this.isAnimating = true;
        
        if (reverse) {
            this.element.classList.add('is-reverse');
        } else {
            this.element.classList.remove('is-reverse');
        }
        
        // Start In Animation
        this.element.classList.remove('is-animating-out');
        this.element.classList.add('is-animating-in');
        
        // Wait for In Animation (0.8s)
        setTimeout(() => {
            // Execute callback (change content)
            if (callback) callback();

            // Start Out Animation
            this.element.classList.remove('is-animating-in');
            this.element.classList.add('is-animating-out');
            
            // Reset after Out Animation (0.8s)
            setTimeout(() => {
                this.element.classList.remove('is-animating-out');
                this.element.classList.remove('is-reverse');
                this.isAnimating = false;
            }, 800);
            
        }, 800);
    }
};

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
            year: '03/2025 -> 08/2025',
            role: 'Full-Stack Developer & UX/UI Designer',
            context: 'Stage M2 - GreenWITS',
            description: `
                <p>OptiWITS™ est une plateforme SaaS qui accompagne la conception de parcs éoliens en combinant calculs d’optimisation et visualisations de données pour aider les équipes projet à prendre de meilleures décisions.</p>
                <p>Dans le cadre de mon stage, mon rôle a été d’accélérer la transformation d’une version bêta en produit professionnel : montée en qualité de l’interface, clarification des parcours, et amélioration de la réactivité perçue au quotidien.</p>
                <p>Concrètement, j’ai consolidé un design system, conçu/implémenté des composants UI réutilisables, et participé à l’industrialisation du front (structure, performances, micro-interactions) en lien étroit avec l’équipe produit/tech.</p>
                <p>Le défi : rendre une technologie dense et très technique compréhensible et agréable à utiliser, sans perdre la précision attendue par des experts métier.</p>
                <p>Ce que j’en retire : une meilleure maîtrise du travail en équipe sur un SaaS (priorisation, itération, feedback utilisateurs), et une approche plus mature de l’équilibre UX ↔ contraintes techniques ↔ performance.</p>
            `,
            tags: ['SAAS', 'UX/UI', 'FULL-STACK'],
            stack: ['React', 'JavaScript', 'Python', 'MongoDB', 'FastAPI', 'Figma', 'Docker', 'GitLab'],
            images: [
                'assets/images/project_optiwits_1.webp',
                'assets/images/project_optiwits_2.webp',
            ],
            links: [
                { url : 'https://www.greenwits.com/solutions/optiwits-software/', label: 'OptiWITS™', icon: 'link' }
            ]
        },
        ccp: {
            number: '02',
            title: 'Camping-Car Partner',
            subtitle: 'Application web B2B de gestion de dossiers (CRM & collaboration)',
            year: '05/2023 -> 10/2023 & 04/2024 -> 07/2024',
            role: 'Full-Stack Developer (Solo)',
            context: 'Stage Licence + Stage M1',
            description: `
                <p>Camping-Car Partner est une application web B2B (CRM / extranet) conçue pour centraliser et sécuriser la gestion de dossiers, et fluidifier la collaboration entre l’entreprise et ses partenaires (concessionnaires, téléconseillers).</p>
                <p>J’ai travaillé sur ce même produit sur deux stages successifs (Licence puis Master 1) : d’abord pour bâtir une première version utilisable, puis pour faire évoluer l’outil avec les retours du terrain et accompagner la montée en charge.</p>
                <p>En autonomie, j’ai assuré la conception UX/UI, le développement full-stack et la mise en production : structuration des données, pages métier, gestion des accès, fiabilisation et optimisation de l’expérience (réactivité, clarté des workflows, cohérence d’interface).</p>
                <p>Le défi principal : transformer un fonctionnement “tableur + échanges dispersés” en un outil web simple à prendre en main, robuste et adapté à des utilisateurs aux profils variés, tout en garantissant la sécurité et la stabilité.</p>
                <p>Ce que j’en retiens : une vision bout-en-bout d’un produit (besoin → solution → déploiement), le sens des priorités en contexte réel, et une progression nette sur la qualité logicielle (maintenance, performance, sécurité) et la communication avec des parties prenantes non-tech.</p>
            `,
            tags: ['B2B', 'CRM', 'PHP'],
            stack: ['PHP', 'MySQL', 'JavaScript', 'jQuery', 'Bootstrap', 'GitHub'],
            images: [],
            links: []
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
            stack: ['Laravel', 'React', 'TypeScript', 'MySQL', 'Mantine', 'Figma'],
            images: [],
            links: []
        },
        portfolio: {
            number: '04',
            title: 'Portfolio 2025',
            subtitle: 'Vitrine numérique personnelle',
            year: '2025',
            role: 'Designer & Developer',
            context: 'Projet Personnel',
            description: `
                <p>Mon ancien portfolio professionnel, conçu pour présenter mon parcours hybride entre développement et design. Une vitrine qui reflète mon approche : technique solide, créativité assumée.</p>
                <p>Ce projet m'a permis d'explorer Three.js et les effets WebGL pour créer une expérience immersive unique avec un effet water-plane en arrière-plan.</p>
                <p>L'architecture du site privilégie la performance et l'accessibilité tout en proposant des micro-interactions soignées.</p>
            `,
            tags: ['WEBGL', 'THREE.JS', 'DESIGN'],
            stack: ['HTML/CSS', 'JavaScript', 'Three.js', 'WebGL', 'Figma'],
            images: [],
            links: [
                { url: 'https://leo-bernard38.github.io/Portfolio-2025/', label: 'Portfolio 2025', icon: 'link' },
                { url: 'https://github.com/Leo-BERNARD38/Portfolio-2025', label: 'Code Source', icon: 'link' }
            ]
        },
        secret: {
            number: '05',
            title: 'Projet Secret 🤫',
            subtitle: 'Plateforme communautaire innovante',
            year: '2025',
            role: 'Co-fondateur & Lead Developer',
            context: 'Projet entre camarades',
            description: `
                <p>Un projet ambitieux lancé début 2025 avec un camarade de promotion : créer une plateforme communautaire révolutionnaire pour partager les meilleurs bons plans régionaux.</p>
                <p>L'innovation ? Une intelligence artificielle personnalisée qui analyse les préférences utilisateurs pour suggérer des recommandations pertinentes et contextuelles.</p>
                <p>Ce laboratoire d'innovation privé nous permet d'explorer les limites des technologies actuelles tout en construisant un produit avec un réel potentiel commercial. Plus d'infos bientôt... 👀</p>
            `,
            tags: ['STARTUP', 'IA', 'REACT', 'Python'],
            stack: ['React', 'TypeScript', 'Python', 'Mistral API', 'MySQL', 'Figma'],
            images: [],
            links: []
        },
        youtube: {
            number: '06',
            title: 'YouTube @WNT',
            subtitle: 'Création de contenu vidéo & VFX',
            year: '2016 - Présent',
            role: 'Créateur & Monteur',
            context: 'Projet Personnel',
            description: `
                <p>Depuis 2016, je développe ma chaîne YouTube où j'explore la création de contenu sous toutes ses formes : montage vidéo, effets visuels, storytelling et motion design.</p>
                <p>Ce projet personnel m'a permis de maîtriser la Suite Adobe (Premiere Pro, After Effects, Photoshop) et de développer un œil créatif qui nourrit aujourd'hui mon travail en UX/UI design.</p>
                <p>Au-delà des compétences techniques, cette expérience m'a appris l'importance du rythme, de la narration et de l'engagement utilisateur - des concepts directement transposables au design d'interfaces.</p>
            `,
            tags: ['PREMIERE PRO', 'AFTER EFFECTS', 'MOTION DESIGN'],
            stack: ['After Effects', 'Premiere Pro', 'Photoshop', 'Audition', 'Filmora', 'Topaz Labs'],
            images: [],
            links: [
                { url: 'https://www.youtube.com/@WNT_38', label: 'YouTube @WNT', icon: 'link' }
            ]
        }
    };
    
    const projectKeys = Object.keys(projectsData);
    let currentProjectIndex = 0;
    
    function openModal(projectId) {
        const project = projectsData[projectId];
        if (!project) return;
        
        PageTransition.animate(() => {
            currentProjectIndex = projectKeys.indexOf(projectId);
            updateModalContent(project);
            
            modal.classList.add('active');
            document.body.classList.add('modal-open');
            
            updateNavButtons();
        });
    }
    
    function closeModal() {
        PageTransition.animate(() => {
            modal.classList.remove('active');
            document.body.classList.remove('modal-open');
        }, true);
    }
    
    function updateModalContent(project) {
        modal.querySelector('.project-modal__number').textContent = project.number;
        modal.querySelector('.project-modal__title').textContent = project.title;
        modal.querySelector('.project-modal__subtitle').textContent = project.subtitle;
        modal.querySelector('.project-modal__year').textContent = project.year;
        modal.querySelector('.project-modal__role').textContent = project.role;
        modal.querySelector('.project-modal__context').textContent = project.context;
        modal.querySelector('.project-modal__description').innerHTML = project.description;
        
        // Handle Images
        const imageContainer = modal.querySelector('.project-modal__image');
        if (imageContainer) {
            imageContainer.innerHTML = ''; // Clear existing content
            imageContainer.className = 'project-modal__image'; // Reset classes
            
            if (project.images && Array.isArray(project.images) && project.images.length > 0) {
                // Add classes for grid layout
                imageContainer.classList.add(`has-${project.images.length}-images`);
                if (project.images.length > 1) imageContainer.classList.add('is-gallery');
                
                project.images.forEach(imgSrc => {
                    const imgWrapper = document.createElement('div');
                    imgWrapper.className = 'project-modal__image-wrapper';
                    imgWrapper.setAttribute('data-cursor', 'hover');
                    
                    const img = document.createElement('img');
                    img.src = imgSrc;
                    img.alt = project.title;
                    img.loading = 'lazy';
                    
                    // Overlay for hover effect
                    const overlay = document.createElement('div');
                    overlay.className = 'project-modal__image-overlay';
                    
                    imgWrapper.appendChild(img);
                    imgWrapper.appendChild(overlay);
                    imageContainer.appendChild(imgWrapper);

                    // Lightbox Event
                    imgWrapper.addEventListener('click', () => {
                        openLightbox(imgSrc, project.title);
                    });

                    // Custom Cursor Events
                    imgWrapper.addEventListener('mouseenter', () => {
                        const cursor = document.querySelector('.cursor');
                        const follower = document.querySelector('.cursor-follower');
                        if (cursor && follower) {
                            cursor.classList.add('active');
                            follower.classList.add('active');
                        }
                    });
                    
                    imgWrapper.addEventListener('mouseleave', () => {
                        const cursor = document.querySelector('.cursor');
                        const follower = document.querySelector('.cursor-follower');
                        if (cursor && follower) {
                            cursor.classList.remove('active');
                            follower.classList.remove('active');
                        }
                    });
                });
            }
        }

        const tagsContainer = modal.querySelector('.project-modal__tags');
        tagsContainer.innerHTML = project.tags.map(tag => 
            `<span class="tag mono-text">${tag}</span>`
        ).join('');
        
        const stackContainer = modal.querySelector('.project-modal__stack-list');
        stackContainer.innerHTML = project.stack.map(tech => 
            `<span class="tag mono-text">${tech}</span>`
        ).join('');
        
        const linksContainer = modal.querySelector('.project-modal__links');
        const linksWrapper = modal.querySelector('.project-modal__links-container');
        
        if (linksContainer && linksWrapper) {
            linksContainer.innerHTML = '';
            
            if (project.links && Array.isArray(project.links) && project.links.length > 0) {
                linksWrapper.style.display = 'block';
                
                project.links.forEach((link) => {
                    const btn = document.createElement('a');
                    btn.href = link.url;
                    btn.target = '_blank';
                    btn.className = 'project-modal__sidebar-link';
                    
                    let iconSvg = '';
                    if (link.icon === 'file') {
                        iconSvg = `
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
                                <polyline points="13 2 13 9 20 9"/>
                            </svg>
                        `;
                    } else {
                        // Default to link icon
                        iconSvg = `
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                                <polyline points="15 3 21 3 21 9"/>
                                <line x1="10" y1="14" x2="21" y2="3"/>
                            </svg>
                        `;
                    }
                    
                    btn.innerHTML = `
                        ${iconSvg}
                        <span>${link.label}</span>
                    `;
                    
                    // Add hover effect for custom cursor
                    btn.addEventListener('mouseenter', () => {
                        const cursor = document.querySelector('.cursor');
                        const follower = document.querySelector('.cursor-follower');
                        if (cursor && follower) {
                            cursor.classList.add('active');
                            follower.classList.add('active');
                        }
                    });
                    
                    btn.addEventListener('mouseleave', () => {
                        const cursor = document.querySelector('.cursor');
                        const follower = document.querySelector('.cursor-follower');
                        if (cursor && follower) {
                            cursor.classList.remove('active');
                            follower.classList.remove('active');
                        }
                    });
                    
                    linksContainer.appendChild(btn);
                });
            } else {
                linksWrapper.style.display = 'none';
            }
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
