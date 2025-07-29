// Main initialization file
import { Fairy } from './modules/fairy.js';
import { ZoneManager } from './modules/zones.js';
import { DynamicLighting } from './modules/lighting.js';
import { DistortionEffect } from './modules/distortion.js';
import { StoryManager } from './modules/story.js';
import { HandDrawnCursor } from './modules/cursor.js';
import { AthulanMode } from './modules/athulan.js';
import { MusicManager } from './modules/music.js';
import { LanguageManager } from './modules/language.js';
import { LanguageUI } from './modules/languageUI.js';

class EsolrineGame {
    constructor() {
        this.fairy = null;
        this.zoneManager = null;
        this.lighting = null;
        this.distortion = null;
        this.storyManager = null;
        this.cursor = null;
        this.athulanMode = null;
        this.musicManager = null;
        this.languageManager = null;
        this.languageUI = null;

        this.init();
    }

    init() {
        // Initialize language manager first
        this.languageManager = new LanguageManager();

        // Initialize language UI
        this.languageUI = new LanguageUI(this.languageManager);

        // Check for Athulan mode
        this.athulanMode = new AthulanMode();

        // Initialize all modules
        this.lighting = new DynamicLighting();
        this.storyManager = new StoryManager();
        this.musicManager = new MusicManager();

        // Connect language manager to story manager
        this.storyManager.setLanguageManager(this.languageManager);

        this.fairy = new Fairy(this.lighting);
        this.zoneManager = new ZoneManager(this.fairy, this.lighting, this.storyManager);

        this.distortion = new DistortionEffect();
        this.cursor = new HandDrawnCursor();

        // Connect modules
        this.fairy.setZoneManager(this.zoneManager);
        this.storyManager.setZoneManager(this.zoneManager);

        // Start distortion effect by default
        this.distortion.start();

        // Monitor URL changes
        this.setupURLMonitoring();

        // Observer pour détecter les changements d'attribut sur body
        this.setupRealmObserver();
    }

    setupURLMonitoring() {
        // Check on page load
        this.athulanMode.checkURL();

        // Monitor hash changes
        window.addEventListener('hashchange', () => {
            this.athulanMode.checkURL();
        });

        // Monitor pushState/replaceState
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        history.pushState = function() {
            originalPushState.apply(history, arguments);
            window.esolrineGame.athulanMode.checkURL();
        };

        history.replaceState = function() {
            originalReplaceState.apply(history, arguments);
            window.esolrineGame.athulanMode.checkURL();
        };
    }

    // NOUVEAU: Observer pour détecter quand le realm change
    setupRealmObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-realm') {
                    const newRealm = document.body.getAttribute('data-realm');
                    if (newRealm === 'athulan' && this.zoneManager) {
                        // Forcer la vérification quand on passe en mode Athulan
                        setTimeout(() => {
                            this.zoneManager.checkForAthulanActivation();
                        }, 100);
                    }
                }
            });
        });

        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['data-realm']
        });
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.esolrineGame = new EsolrineGame();
});