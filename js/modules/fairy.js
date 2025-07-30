export class Fairy {
    constructor(lighting) {
        this.element = document.getElementById('blueEntity');
        this.lighting = lighting;
        this.zoneManager = null;

        // Position and movement
        this.position = { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 };
        this.velocity = { x: 0, y: 0 };
        this.mousePos = { x: 0, y: 0 };

        // Behavior parameters - MODIFIÉS pour des mouvements plus amples
        this.fleeDistance = 200; // Réduit de 350 pour interaction plus proche
        this.maxSpeed = 30; // Réduit de 5 pour mouvements plus calmes
        this.wanderSpeed = 1.5; // Réduit de 2.5
        this.fleeSpeed = 30; // Réduit de 6
        this.friction = 0.92; // Réduit de 0.96 pour plus de fluidité
        this.smoothing = 0.08; // Nouveau : facteur de lissage

        // AI parameters - MODIFIÉS pour mouvements plus naturels
        this.wanderAngle = Math.random() * Math.PI * 2;
        this.wanderDistance = 150; // Augmenté de 100
        this.wanderChangeRate = 0.02; // Réduit de 0.05 pour changements plus doux

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setInitialPosition();
        this.startMovement();
    }

    setZoneManager(zoneManager) {
        this.zoneManager = zoneManager;
    }

    setupEventListeners() {
        document.addEventListener('mousemove', (e) => {
            this.mousePos.x = e.clientX;
            this.mousePos.y = e.clientY;
        });

        window.addEventListener('resize', () => this.constrainToScreen());
    }

    setInitialPosition() {
        this.position.x = window.innerWidth * 0.5;
        this.position.y = window.innerHeight * 0.5;
        this.updatePosition();
    }

    startMovement() {
        let lastUpdate = 0;
        const updateRate = 1000 / 30; // 30 FPS au lieu de 60

        const animate = (timestamp) => {
            if (timestamp - lastUpdate >= updateRate) {
                this.updateMovement();
                if (this.zoneManager) {
                    this.zoneManager.checkZoneCollision(this.position);
                }
                lastUpdate = timestamp;
            }
            requestAnimationFrame(animate);
        };
        animate(0);
    }

    updateMovement() {
        const distanceToMouse = this.getDistance(this.position, this.mousePos);

        // NOUVEAU : Système de guidage plus naturel
        if (distanceToMouse < this.fleeDistance) {
            // Calculer la force de répulsion basée sur la distance
            const repulsionStrength = 1 - (distanceToMouse / this.fleeDistance);
            this.guidedMovement(repulsionStrength);
            this.element.classList.add('fleeing');
        } else {
            this.wanderFreely();
            this.element.classList.remove('fleeing');
        }

        // Apply friction
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;

        // Update position with smoothing
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // Keep in bounds
        this.constrainToScreen();

        // Update display
        this.updatePosition();
    }

    // NOUVELLE MÉTHODE : Mouvement guidé plus naturel
    guidedMovement(repulsionStrength) {
        const direction = this.getDirection(this.mousePos, this.position);

        // Force de base plus douce
        let force;

        // Courbe de force exponentielle pour interaction plus naturelle
        if (repulsionStrength > 0.8) {
            force = Math.pow(repulsionStrength, 2) * 0.5;
        } else if (repulsionStrength > 0.5) {
            force = repulsionStrength * 0.25;
        } else {
            force = repulsionStrength * 0.15;
        }

        // Appliquer la force avec lissage
        const forceX = direction.x * this.fleeSpeed * force;
        const forceY = direction.y * this.fleeSpeed * force;

        // Interpolation douce
        this.velocity.x += forceX * this.smoothing;
        this.velocity.y += forceY * this.smoothing;

        // Ajouter une légère déviation latérale pour mouvements plus organiques
        const perpX = -direction.y * 0.2;
        const perpY = direction.x * 0.2;
        this.velocity.x += perpX * Math.sin(Date.now() * 0.001) * force;
        this.velocity.y += perpY * Math.sin(Date.now() * 0.001) * force;

        // Limiter la vitesse
        const speed = Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2);
        if (speed > this.maxSpeed) {
            this.velocity.x = (this.velocity.x / speed) * this.maxSpeed;
            this.velocity.y = (this.velocity.y / speed) * this.maxSpeed;
        }
    }

    wanderFreely() {
        // Mouvement de vagabondage plus ample et naturel
        this.wanderAngle += (Math.random() - 0.5) * this.wanderChangeRate;

        // Ajouter une ondulation sinusoïdale pour un mouvement plus organique
        const time = Date.now() * 0.0005;
        const waveX = Math.sin(time) * 30;
        const waveY = Math.cos(time * 0.7) * 30;

        const wanderTarget = {
            x: this.position.x + Math.cos(this.wanderAngle) * this.wanderDistance + waveX,
            y: this.position.y + Math.sin(this.wanderAngle) * this.wanderDistance + waveY
        };

        const wanderForce = this.getDirection(this.position, wanderTarget);
        const wanderStrength = 0.5; // Réduit pour mouvements plus doux

        this.velocity.x += wanderForce.x * wanderStrength * this.smoothing;
        this.velocity.y += wanderForce.y * wanderStrength * this.smoothing;

        // Variation organique réduite
        const organicVariation = 0.2;
        this.velocity.x += (Math.random() - 0.5) * organicVariation;
        this.velocity.y += (Math.random() - 0.5) * organicVariation;

        // Attraction centrale plus douce
        const centerX = window.innerWidth * 0.5;
        const centerY = window.innerHeight * 0.5;
        const directionToCenter = this.getDirection(this.position, { x: centerX, y: centerY });
        const distanceFromCenter = this.getDistance(this.position, { x: centerX, y: centerY });

        if (distanceFromCenter > 400) { // Augmenté pour plus de liberté
            const centerForce = Math.min(distanceFromCenter / 2000, 0.5); // Plus doux
            this.velocity.x += directionToCenter.x * centerForce;
            this.velocity.y += directionToCenter.y * centerForce;
        }

        // Évitement des bordures
        this.avoidBorders();

        // Limiter la vitesse
        const speed = Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2);
        if (speed > this.wanderSpeed) {
            const dampening = this.wanderSpeed / speed;
            this.velocity.x *= dampening;
            this.velocity.y *= dampening;
        }
    }

    avoidBorders() {
        const margin = 80; // Réduit de 120
        const avoidanceForce = 0.8; // Réduit de 1.5

        if (this.position.x < margin) {
            this.velocity.x += avoidanceForce * (margin - this.position.x) / margin;
        }
        if (this.position.x > window.innerWidth - margin) {
            this.velocity.x -= avoidanceForce * (margin - (window.innerWidth - this.position.x)) / margin;
        }
        if (this.position.y < margin) {
            this.velocity.y += avoidanceForce * (margin - this.position.y) / margin;
        }
        if (this.position.y > window.innerHeight - margin) {
            this.velocity.y -= avoidanceForce * (margin - (window.innerHeight - this.position.y)) / margin;
        }
    }

    constrainToScreen() {
        const margin = 30; // Réduit de 50

        if (this.position.x < margin) {
            this.position.x = margin;
            this.velocity.x = Math.abs(this.velocity.x) * 0.3;
        }
        if (this.position.x > window.innerWidth - margin) {
            this.position.x = window.innerWidth - margin;
            this.velocity.x = -Math.abs(this.velocity.x) * 0.3;
        }
        if (this.position.y < margin) {
            this.position.y = margin;
            this.velocity.y = Math.abs(this.velocity.y) * 0.3;
        }
        if (this.position.y > window.innerHeight - margin) {
            this.position.y = window.innerHeight - margin;
            this.velocity.y = -Math.abs(this.velocity.y) * 0.3;
        }
    }

    updatePosition() {
        this.element.style.left = this.position.x + 'px';
        this.element.style.top = this.position.y + 'px';

        // Update lighting system
        if (this.lighting) {
            this.lighting.updateFairyPosition(this.position.x, this.position.y);
        }
    }

    getDistance(pos1, pos2) {
        return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2));
    }

    getDirection(from, to) {
        const distance = this.getDistance(from, to);
        if (distance === 0) return { x: 0, y: 0 };
        return {
            x: (to.x - from.x) / distance,
            y: (to.y - from.y) / distance
        };
    }

    startLoadingAnimation() {
        this.element.classList.add('loading', 'zone-activating');
    }

    stopLoadingAnimation() {
        this.element.classList.remove('loading', 'zone-activating', 'zone-completed');
    }

    completeZone() {
        this.element.classList.add('zone-completed');
        setTimeout(() => {
            this.element.classList.remove('loading', 'zone-activating', 'zone-completed');
        }, 5000);
    }
}