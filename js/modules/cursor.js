import { isMobile } from '../utils/helpers.js';

export class HandDrawnCursor {
    constructor() {
        this.cursor = null;
        this.trails = [];
        this.mousePos = { x: 0, y: 0 };
        this.lastPos = { x: 0, y: 0 };
        this.isActive = true;
        this.trailInterval = null;
        this.isMobile = isMobile();

        this.init();
    }

    init() {
        // Ne pas initialiser le curseur sur mobile
        if (this.isMobile) {
            return;
        }

        this.createCursor();
        this.setupEventListeners();

        // Start with cursor active on desktop only
        this.activate();
    }

    createCursor() {
        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';
        document.body.appendChild(this.cursor);
    }

    setupEventListeners() {
        // Mouse movement
        document.addEventListener('mousemove', (e) => {
            this.mousePos.x = e.clientX;
            this.mousePos.y = e.clientY;

            if (this.isActive && !this.isMobile) {
                this.updateCursorPosition();

                // Create trail effect on fast movement
                const distance = Math.sqrt(
                    Math.pow(this.mousePos.x - this.lastPos.x, 2) +
                    Math.pow(this.mousePos.y - this.lastPos.y, 2)
                );

                if (distance > 30) {
                    this.createTrail();
                    this.lastPos.x = this.mousePos.x;
                    this.lastPos.y = this.mousePos.y;
                }
            }
        });

        // Mouse down/up
        document.addEventListener('mousedown', () => {
            if (this.isActive && !this.isMobile) {
                this.cursor.classList.add('clicking');
            }
        });

        document.addEventListener('mouseup', () => {
            if (this.isActive && !this.isMobile) {
                this.cursor.classList.remove('clicking');
            }
        });

        // Hover detection
        document.addEventListener('mouseover', (e) => {
            if (this.isActive && !this.isMobile) {
                const isInteractive = e.target.matches('a, button, .clickable-zone, .story-close-button, .social-button, .distortion-toggle, input, textarea');
                if (isInteractive) {
                    this.cursor.classList.add('hovering');
                }
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (this.isActive && !this.isMobile) {
                const isInteractive = e.target.matches('a, button, .clickable-zone, .story-close-button, .social-button, .distortion-toggle, input, textarea');
                if (isInteractive) {
                    this.cursor.classList.remove('hovering');
                }
            }
        });

        // Hide cursor when leaving window
        document.addEventListener('mouseleave', () => {
            if (this.isActive && !this.isMobile && this.cursor) {
                this.cursor.style.display = 'none';
            }
        });

        document.addEventListener('mouseenter', () => {
            if (this.isActive && !this.isMobile && this.cursor) {
                this.cursor.style.display = 'block';
            }
        });

        // Listen for window resize to check if we switched between mobile and desktop
        window.addEventListener('resize', () => {
            const wasDesktop = !this.isMobile;
            this.isMobile = isMobile();

            // Si on passe de desktop à mobile
            if (wasDesktop && this.isMobile) {
                this.deactivate();
                if (this.cursor) {
                    this.cursor.remove();
                    this.cursor = null;
                }
            }
            // Si on passe de mobile à desktop
            else if (!wasDesktop && !this.isMobile) {
                if (!this.cursor) {
                    this.createCursor();
                    this.setupEventListeners();
                }
                this.activate();
            }
        });
    }

    updateCursorPosition() {
        if (!this.cursor || this.isMobile) return;

        // Add slight lag for organic movement
        const lagFactor = 0.15;
        const targetX = this.mousePos.x;
        const targetY = this.mousePos.y;

        const currentX = parseFloat(this.cursor.style.left) || targetX;
        const currentY = parseFloat(this.cursor.style.top) || targetY;

        const newX = currentX + (targetX - currentX) * lagFactor;
        const newY = currentY + (targetY - currentY) * lagFactor;

        this.cursor.style.left = newX + 'px';
        this.cursor.style.top = newY + 'px';

        // Continue animation if cursor is active
        if (this.isActive && !this.isMobile) {
            requestAnimationFrame(() => this.updateCursorPosition());
        }
    }

    createTrail() {
        // NOUVEAU: Vérifier si le mode performance est actif
        if (document.body.classList.contains('performance-mode-active')) {
            return;
        }
        if (this.isMobile) return;

        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.left = this.mousePos.x + 'px';
        trail.style.top = this.mousePos.y + 'px';

        document.body.appendChild(trail);
        this.trails.push(trail);

        // Remove trail after animation
        setTimeout(() => {
            trail.remove();
            this.trails = this.trails.filter(t => t !== trail);
        }, 1000);

        // Limit number of trails
        if (this.trails.length > 5) {
            const oldTrail = this.trails.shift();
            oldTrail.remove();
        }
    }

    toggle() {
        // Ne pas permettre le toggle sur mobile
        if (this.isMobile) return;

        if (this.isActive) {
            this.deactivate();
        } else {
            this.activate();
        }
    }

    activate() {
        // Ne pas activer sur mobile
        if (this.isMobile) return;

        this.isActive = true;
        document.body.classList.add('custom-cursor-active');
        if (this.cursor) {
            this.cursor.style.display = 'block';
            this.updateCursorPosition();
        }
    }

    deactivate() {
        this.isActive = false;
        document.body.classList.remove('custom-cursor-active');
        if (this.cursor) {
            this.cursor.style.display = 'none';
        }

        // Clean up trails
        this.trails.forEach(trail => trail.remove());
        this.trails = [];
    }
}