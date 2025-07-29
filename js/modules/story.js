export class StoryManager {
    constructor() {
        this.languageManager = null; // Sera défini dans main.js
        this.currentOverlay = null;
        this.currentZoneNumber = null;
        this.isMobile = false;
        this.zoneManager = null; // Sera défini plus tard
        this.setupStyles();
    }

    setLanguageManager(languageManager) {
        this.languageManager = languageManager;

        // Écouter les changements de langue
        window.addEventListener('languageChanged', () => {
            // Si une histoire est ouverte, la rafraîchir
            if (this.currentOverlay && this.currentZoneNumber) {
                this.closeStoryOverlay(this.currentOverlay);
                setTimeout(() => {
                    this.openStory(this.currentZoneNumber, this.isMobile);
                }, 300);
            }
        });
    }

    setZoneManager(zoneManager) {
        this.zoneManager = zoneManager;
    }

    setupStyles() {
        if (!document.querySelector('#typewriter-styles')) {
            const style = document.createElement('style');
            style.id = 'typewriter-styles';
            style.textContent = `
                @keyframes fadeInChar {
                    0% { opacity: 0; transform: translateY(10px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeOut {
                    0% { opacity: 1; }
                    100% { opacity: 0; }
                }
                
                /* Cursed text effect for Athulan */
                .story-text.cursed-text {
                    font-family: 'Caveat', 'Kalam', cursive;
                    text-shadow: 
                        0 0 3px rgba(138, 43, 226, 0.5),
                        0 0 6px rgba(138, 43, 226, 0.3),
                        2px 2px 4px rgba(0, 0, 0, 0.8);
                    letter-spacing: 1px;
                }
                
                .story-text.cursed-text span {
                    display: inline-block;
                    animation: cursedGlitch 0.5s ease-in-out infinite;
                    animation-delay: calc(var(--char-index) * 0.05s);
                }
                
                @keyframes cursedGlitch {
                    0%, 90%, 100% {
                        transform: translateX(0) translateY(0) rotate(0deg);
                        opacity: 1;
                    }
                    92% {
                        transform: translateX(-2px) translateY(1px) rotate(-1deg);
                        opacity: 0.8;
                    }
                    94% {
                        transform: translateX(2px) translateY(-1px) rotate(1deg);
                        opacity: 0.9;
                    }
                    96% {
                        transform: translateX(-1px) translateY(0) rotate(0deg);
                        opacity: 0.7;
                    }
                }
                
                .story-title.cursed-title {
                    animation: titleCorruption 4s ease-in-out infinite;
                    text-shadow:
                        0 0 10px rgba(138, 43, 226, 0.8),
                        0 0 20px rgba(138, 43, 226, 0.6),
                        0 0 30px rgba(138, 43, 226, 0.4),
                        2px 2px 4px rgba(0, 0, 0, 1);
                }
                
                @keyframes titleCorruption {
                    0%, 100% {
                        transform: rotate(-1deg) skewX(-2deg) translateX(0px);
                        filter: blur(0px);
                    }
                    25% {
                        transform: rotate(-0.5deg) skewX(-3deg) translateX(2px);
                        filter: blur(0.5px);
                    }
                    50% {
                        transform: rotate(-1.5deg) skewX(-1deg) translateX(-1px);
                        filter: blur(0.2px);
                    }
                    75% {
                        transform: rotate(-0.8deg) skewX(-2.5deg) translateX(1px);
                        filter: blur(0.3px);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    openStory(zoneNumber, isMobile = false) {
        const existingOverlay = document.querySelector('.story-overlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }

        // Utiliser le gestionnaire de langues pour obtenir l'histoire
        const story = this.languageManager ?
            this.languageManager.getStory(zoneNumber) :
            this.getDefaultStory(zoneNumber);

        if (!story) return;

        this.currentZoneNumber = zoneNumber;
        this.isMobile = isMobile;
        this.createStoryOverlay(story, zoneNumber);
    }

    // Garder l'ancienne méthode comme fallback
    getDefaultStory(zoneNumber) {
        const defaultStories = {
            1: {
                title: "Je suis impuissante",
                text: "Elle se trouvait à terre, couvée entre les ronces d'un buisson...",
                image: "assets/img/Tristesse.jpg"
            },
            2: {
                title: "Les Cristaux Chantants",
                text: "De nouveau seule, j'entendis les pas de l'organisatrice s'éloigner...",
                image: "assets/img/Mariage.jpg"
            },
            3: {
                title: "Pour mon enfant",
                text: "Les bruits de pas sur la pierre rythmaient mon ascension...",
                image: "assets/img/Colere.jpg"
            },
            4: {
                title: "Célesticide",
                text: "Ses jambes la lâchèrent, et la créature percuta le sol...",
                image: "assets/img/Peur.jpg"
            },
            5: {
                title: "Mon █████",
                text: "Par endroits, sa peau était couverte d'écailles...",
                image: "assets/img/Espoir.jpg"
            },
            athulan: {
                title: "█████",
                text: "̺̾W̴̤̋ȟ̴̫á̸̺t̷̖̿ ̴̘͆î̸̦s̷̩̀ ̴̪͑█̴͔̍█̸̞͒█̸̙͌█̵̘̈́█̷̗̌ ̵̰͝?̸̱͌",
                image: "assets/img/athulan.jpg"
            }
        };
        return defaultStories[zoneNumber];
    }

    createStoryOverlay(story, zoneNumber) {
        // Create main overlay
        const overlay = document.createElement('div');
        overlay.className = 'story-overlay';

        // Add special class for Athulan story
        if (zoneNumber === 'athulan') {
            overlay.classList.add('athulan-story');
        }

        // Create background image
        const background = document.createElement('div');
        background.className = 'story-background distortion-active';
        background.style.backgroundImage = `url('${story.image}')`;

        // Create particles
        const particles = document.createElement('div');
        particles.className = 'story-particles';

        // Generate particles
        for (let i = 0; i < 40; i++) {
            const particle = document.createElement('div');
            particle.className = 'story-particle';
            if (i % 3 === 0) {
                particle.classList.add('distortion-active');
            }
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 20 + 's';
            particle.style.animationDuration = (18 + Math.random() * 7) + 's';
            particles.appendChild(particle);
        }

        // Create content container
        const content = document.createElement('div');
        content.className = 'story-content';

        // Create text container
        const textContainer = document.createElement('div');
        textContainer.className = 'story-text-container distortion-active';

        // Add image mask
        const imageMask = document.createElement('div');
        imageMask.className = 'story-image-mask';
        imageMask.style.backgroundImage = `url('${story.image}')`;
        textContainer.appendChild(imageMask);

        // Create title
        const title = document.createElement('h1');
        title.className = 'story-title distortion-active';
        if (zoneNumber === 'athulan') {
            title.classList.add('cursed-title');
        }
        title.textContent = story.title;

        // Create text area
        const storyText = document.createElement('div');
        storyText.className = 'story-text';
        if (zoneNumber === 'athulan') {
            storyText.classList.add('cursed-text');
        }

        // Create cursor
        const cursor = document.createElement('span');
        cursor.className = 'typewriter-cursor';

        // Create decorative elements
        const decorLeft = document.createElement('div');
        decorLeft.className = 'story-decor-left';
        const decorRight = document.createElement('div');
        decorRight.className = 'story-decor-right';

        // Create close button
        const closeButton = document.createElement('div');
        closeButton.className = 'story-close-button';

        // Assemble elements
        textContainer.appendChild(decorLeft);
        textContainer.appendChild(title);
        textContainer.appendChild(storyText);
        textContainer.appendChild(decorRight);

        content.appendChild(textContainer);

        overlay.appendChild(background);
        overlay.appendChild(particles);
        overlay.appendChild(content);
        overlay.appendChild(closeButton);

        document.body.appendChild(overlay);

        // Animate appearance
        setTimeout(() => {
            overlay.classList.add('active');
        }, 100);

        // Start typewriter effect
        setTimeout(() => {
            this.typeWriterEffect(storyText, story.text, cursor, zoneNumber === 'athulan');
        }, 1500);

        // Event handlers
        closeButton.addEventListener('click', () => {
            this.closeStoryOverlay(overlay);
        });

        // Escape key handler
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                this.closeStoryOverlay(overlay);
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);

        this.currentOverlay = overlay;
    }

    closeStoryOverlay(overlay) {
        overlay.classList.remove('active');

        // Informer le ZoneManager si on est sur mobile
        if (this.isMobile && this.zoneManager && this.currentZoneNumber) {
            setTimeout(() => {
                this.zoneManager.onMobileStoryClosed(this.currentZoneNumber);
            }, 300);
        }

        // Nettoyer les animations
        const animatedElements = overlay.querySelectorAll('[style*="animation"]');
        animatedElements.forEach(el => {
            el.style.animation = 'none';
        });

        // Nettoyer les particules
        const particles = overlay.querySelector('.story-particles');
        if (particles) {
            particles.innerHTML = '';
        }

        setTimeout(() => {
            overlay.remove();
        }, 800);
    }

    typeWriterEffect(element, text, cursor = null, isCursed = false) {
        element.textContent = '';

        // Option 1 : Affichage par paragraphes (BEAUCOUP plus performant)
        const paragraphs = text.split('\n').filter(p => p.trim());
        let paragraphIndex = 0;

        const showParagraph = () => {
            if (paragraphIndex < paragraphs.length) {
                const p = document.createElement('p');
                p.textContent = paragraphs[paragraphIndex];
                p.style.opacity = '0';
                p.style.animation = 'fadeInParagraph 0.8s ease forwards';

                if (isCursed) {
                    p.classList.add('cursed-paragraph');
                }

                element.appendChild(p);
                paragraphIndex++;

                // Délai réduit entre paragraphes
                setTimeout(showParagraph, 600);
            }
        };

        setTimeout(showParagraph, 500);
    }
}