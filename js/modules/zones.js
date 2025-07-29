import { isMobile } from '../utils/helpers.js';

export class ZoneManager {
    constructor(fairy, lighting, storyManager) {
        this.fairy = fairy;
        this.lighting = lighting;
        this.storyManager = storyManager;

        this.zones = document.querySelectorAll('.clickable-zone');
        this.currentZone = null;
        this.zoneTimer = null;
        this.stayTimer = null;
        this.progressTimer = null;

        this.loadingTime = 5000; // 5 seconds
        this.activatedZones = new Set();

        // Mobile specific
        this.isMobile = isMobile();
        this.mobileZoneOrder = ['1', '2', '3', '4', '5'];
        this.currentMobileZoneIndex = 0;
        this.allNormalZonesCompleted = false;

        this.init();
    }

    init() {
        this.setupZoneClickHandlers();

        // Sur mobile, activer automatiquement la première zone
        if (this.isMobile) {
            this.initMobileSequence();
        }

        // Écouter l'événement Athulan
        window.addEventListener('athulanAwakened', () => {
            this.checkForAthulanActivation();
        });
    }

    initMobileSequence() {
        // Cacher la fée sur mobile
        if (this.fairy && this.fairy.element) {
            this.fairy.element.style.display = 'none';
        }

        // Si Athulan est déjà actif et toutes les zones sont complétées, activer Athulan
        if (document.body.getAttribute('data-realm') === 'athulan') {
            // Vérifier si toutes les zones normales sont déjà activées (cas du rechargement de page)
            const allActivated = this.mobileZoneOrder.every(zoneNum => {
                const zone = document.querySelector(`.zone-${zoneNum}`);
                return zone && zone.classList.contains('permanently-activated');
            });

            if (allActivated) {
                this.allNormalZonesCompleted = true;
                this.currentMobileZoneIndex = this.mobileZoneOrder.length;
                // Activer Athulan directement
                setTimeout(() => {
                    this.checkForAthulanActivation();
                }, 1500);
                return;
            }
        }

        // Sinon, commencer la séquence normale
        setTimeout(() => {
            this.activateNextMobileZone();
        }, 1500);
    }

    activateNextMobileZone() {
        console.log('[Mobile] Activating next zone. Current index:', this.currentMobileZoneIndex);

        if (this.currentMobileZoneIndex >= this.mobileZoneOrder.length) {
            // Toutes les zones normales sont activées
            this.allNormalZonesCompleted = true;
            console.log('[Mobile] All normal zones completed!');

            // Forcer une vérification immédiate d'Athulan
            setTimeout(() => {
                this.checkForAthulanActivation();
            }, 500);
            return;
        }

        const zoneNumber = this.mobileZoneOrder[this.currentMobileZoneIndex];
        const zone = document.querySelector(`.zone-${zoneNumber}`);

        if (zone && !this.activatedZones.has(zoneNumber)) {
            this.activateMobileZone(zone);
        } else {
            // Si la zone est déjà activée, passer à la suivante
            this.currentMobileZoneIndex++;
            this.activateNextMobileZone();
        }
    }

    activateMobileZone(zone) {
        const zoneNumber = zone.dataset.zone;

        // Animation d'activation progressive
        zone.classList.add('activating', 'loading-progress');
        this.startProgressiveLoading(zone);

        // Activer la zone après le temps de chargement
        setTimeout(() => {
            this.activateZone(zone);

            // Sur mobile, on attend que l'utilisateur clique sur le livre
            this.waitingForStoryRead = true;

            // Ajouter une animation pour attirer l'attention sur le livre
            zone.classList.add('book-pulse');
        }, this.loadingTime);
    }

    checkZoneCollision(fairyPosition) {
        // Sur mobile, pas de collision avec la fée
        if (this.isMobile) {
            return;
        }

        let foundZone = null;

        this.zones.forEach(zone => {
            // Skip hidden zones
            if (window.getComputedStyle(zone).display === 'none') {
                return;
            }

            const zoneRect = zone.getBoundingClientRect();

            if (fairyPosition.x >= zoneRect.left &&
                fairyPosition.x <= zoneRect.right &&
                fairyPosition.y >= zoneRect.top &&
                fairyPosition.y <= zoneRect.bottom) {
                foundZone = zone;
            }
        });

        if (foundZone !== this.currentZone) {
            this.stopZoneProgress();
            if (foundZone) {
                this.startZoneProgress(foundZone);
            }
        }
    }

    startZoneProgress(zone) {
        const zoneNumber = zone.dataset.zone;

        if (this.activatedZones.has(zoneNumber)) {
            return;
        }

        this.currentZone = zone;
        zone.classList.add('activating', 'loading-progress');

        this.startProgressiveLoading(zone);

        this.zoneTimer = setTimeout(() => {
            this.activateZone(zone);
        }, this.loadingTime);

        if (this.fairy && !this.isMobile) {
            this.fairy.startLoadingAnimation();
        }
    }

    stopZoneProgress() {
        if (this.zoneTimer) {
            clearTimeout(this.zoneTimer);
            this.zoneTimer = null;
        }

        if (this.stayTimer) {
            clearTimeout(this.stayTimer);
            this.stayTimer = null;
        }

        if (this.progressTimer) {
            cancelAnimationFrame(this.progressTimer);
            this.progressTimer = null;
        }

        if (this.currentZone) {
            this.currentZone.classList.remove('activating', 'loading-progress');
            this.resetZoneProgress(this.currentZone);
            this.currentZone = null;
        }

        if (this.fairy && !this.isMobile) {
            this.fairy.stopLoadingAnimation();
        }
    }

    activateZone(zone) {
        zone.classList.remove('activating', 'loading-progress');
        zone.classList.add('permanently-activated');

        const zoneNumber = zone.dataset.zone;
        this.activatedZones.add(zoneNumber);

        if (this.lighting && zoneNumber !== 'athulan') {
            this.lighting.illuminateZone(parseInt(zoneNumber));
        }

        setTimeout(() => {
            zone.classList.add('fade-in');
            this.addZoneClickHandler(zone);
        }, 500);

        if (this.fairy && !this.isMobile) {
            this.fairy.completeZone();
        }
    }

    startProgressiveLoading(zone) {
        const zoneNumber = zone.dataset.zone;
        const startTime = Date.now();

        const borderColors = {
            1: 'rgba(255, 130, 110, ',
            2: 'rgba(190, 130, 255, ',
            3: 'rgba(130, 255, 190, ',
            4: 'rgba(130, 210, 255, ',
            5: 'rgba(255, 225, 130, ',
            athulan: 'rgba(138, 43, 226, '
        };

        const updateProgress = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / this.loadingTime, 1);

            const borderColor = borderColors[zoneNumber] || 'rgba(255, 255, 255, ';
            zone.style.borderColor = borderColor + (progress * 0.8) + ')';

            zone.style.setProperty('--question-opacity', progress * 0.8);
            zone.style.setProperty('--question-glow', progress * 0.6);
            zone.style.setProperty('--question-color', `rgba(255, 255, 255, ${progress * 0.8})`);
            zone.style.setProperty('--question-shadow', `
                0 0 15px rgba(255, 255, 255, ${progress * 0.6}),
                0 0 30px rgba(255, 255, 255, ${progress * 0.6 * 0.7}),
                0 0 45px rgba(255, 255, 255, ${progress * 0.6 * 0.5})
            `);

            if (progress < 1) {
                this.progressTimer = requestAnimationFrame(updateProgress);
            }
        };

        updateProgress();
    }

    resetZoneProgress(zone) {
        zone.style.borderColor = '';
        zone.style.removeProperty('--question-opacity');
        zone.style.removeProperty('--question-glow');
        zone.style.removeProperty('--question-color');
        zone.style.removeProperty('--question-shadow');
    }

    addZoneClickHandler(zone) {
        zone.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            // Sur mobile, ne pas rouvrir l'histoire si elle vient d'être fermée
            if (this.isMobile && zone.dataset.recentlyClosed === 'true') {
                return;
            }

            // Retirer l'animation de pulsation quand on clique
            zone.classList.remove('book-pulse');

            this.openZoneStory(zone);
        });
    }

    openZoneStory(zone) {
        const zoneNumber = zone.dataset.zone;

        zone.classList.add('zooming');

        setTimeout(() => {
            this.storyManager.openStory(zoneNumber, this.isMobile);
            zone.classList.remove('zooming');
        }, 500);
    }

    setupZoneClickHandlers() {
        // Setup click handlers for already activated zones
        this.zones.forEach(zone => {
            if (zone.classList.contains('permanently-activated')) {
                this.addZoneClickHandler(zone);
            }
        });
    }

    checkForAthulanActivation() {
        console.log('[Athulan Check] Checking activation conditions...');
        console.log('- isMobile:', this.isMobile);
        console.log('- allNormalZonesCompleted:', this.allNormalZonesCompleted);
        console.log('- data-realm:', document.body.getAttribute('data-realm'));

        // Ne vérifier que sur mobile et si toutes les zones normales sont complétées
        if (!this.isMobile || !this.allNormalZonesCompleted) {
            return;
        }

        // Vérifier si le mode Athulan est actif
        if (document.body.getAttribute('data-realm') === 'athulan') {
            const athulanZone = document.querySelector('.zone-athulan');
            console.log('- Athulan zone found:', !!athulanZone);
            console.log('- Already activated:', this.activatedZones.has('athulan'));

            if (athulanZone && !this.activatedZones.has('athulan')) {
                console.log('[Athulan] Activating zone on mobile...');

                // S'assurer que la zone est visible
                athulanZone.style.display = 'block';

                // Ajouter l'attribut data-zone si manquant
                if (!athulanZone.dataset.zone) {
                    athulanZone.dataset.zone = 'athulan';
                }

                // Activer la zone Athulan après un délai
                setTimeout(() => {
                    this.activateMobileZone(athulanZone);
                }, 1000);
            }
        }
    }

    // Méthode appelée par StoryManager quand une histoire est fermée sur mobile
    onMobileStoryClosed(zoneNumber) {
        if (!this.isMobile) return;

        // Marquer la zone comme récemment fermée pour éviter la réouverture immédiate
        const zone = document.querySelector(`.zone-${zoneNumber}`);
        if (zone) {
            zone.dataset.recentlyClosed = 'true';
            zone.classList.remove('book-pulse'); // Retirer l'animation si elle est encore là
            setTimeout(() => {
                delete zone.dataset.recentlyClosed;
            }, 1000);
        }

        // Si c'était une zone normale, passer à la suivante
        if (zoneNumber !== 'athulan' && this.mobileZoneOrder.includes(zoneNumber)) {
            this.currentMobileZoneIndex++;
            this.waitingForStoryRead = false;

            // Activer la prochaine zone après un court délai
            setTimeout(() => {
                this.activateNextMobileZone();
            }, 800);
        }
        // Si c'était Athulan, on a fini
        else if (zoneNumber === 'athulan') {
            console.log('[Athulan] All zones explored, including Athulan!');
            this.waitingForStoryRead = false;

            // Optionnel : Ajouter un effet de fin ou un message
            this.showCompletionEffect();
        }
    }

    // Nouvelle méthode pour afficher un effet de complétion
    showCompletionEffect() {
        // Ajouter un effet visuel subtil pour indiquer la fin
        const athulanZone = document.querySelector('.zone-athulan');
        if (athulanZone) {
            athulanZone.classList.add('final-glow');

            // Créer un style temporaire pour l'effet
            const style = document.createElement('style');
            style.textContent = `
                @keyframes finalGlow {
                    0%, 100% { 
                        box-shadow: 0 0 80px rgba(138, 43, 226, 0.3),
                                   inset 0 0 60px rgba(75, 0, 130, 0.2);
                    }
                    50% { 
                        box-shadow: 0 0 120px rgba(138, 43, 226, 0.6),
                                   inset 0 0 80px rgba(75, 0, 130, 0.4);
                    }
                }
                .final-glow {
                    animation: finalGlow 4s ease-in-out 3;
                }
            `;
            document.head.appendChild(style);

            setTimeout(() => {
                athulanZone.classList.remove('final-glow');
                style.remove();
            }, 12000);
        }
    }

    // Méthode pour forcer la vérification de l'état (utile pour le debug)
    forceCheckCompletion() {
        // Vérifier si toutes les zones normales sont activées
        const allActivated = this.mobileZoneOrder.every(zoneNum => {
            return this.activatedZones.has(zoneNum);
        });

        if (allActivated) {
            this.allNormalZonesCompleted = true;
            this.currentMobileZoneIndex = this.mobileZoneOrder.length;
            console.log('All normal zones completed, checking for Athulan...');
            this.checkForAthulanActivation();
        }
    }
}