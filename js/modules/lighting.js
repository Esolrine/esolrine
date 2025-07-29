
export class DynamicLighting {
    constructor() {
        this.canvas = document.getElementById('lightingCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.darknessOverlay = document.getElementById('darknessOverlay');

        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        this.illuminatedZones = new Set();
        this.zoneCoordinates = this.calculateZoneCoordinates();

        this.fairyPosition = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        this.fairyEnergy = 1.0;

        this.animate();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.zoneCoordinates = this.calculateZoneCoordinates();
    }

    calculateZoneCoordinates() {
        return {
            1: { x: window.innerWidth * 0.03, y: window.innerHeight * 0.03, width: window.innerWidth * 0.44, height: window.innerHeight * 0.44 },
            2: { x: window.innerWidth * 0.53, y: window.innerHeight * 0.03, width: window.innerWidth * 0.44, height: window.innerHeight * 0.44 },
            3: { x: window.innerWidth * 0.03, y: window.innerHeight * 0.53, width: window.innerWidth * 0.44, height: window.innerHeight * 0.44 },
            4: { x: window.innerWidth * 0.53, y: window.innerHeight * 0.53, width: window.innerWidth * 0.44, height: window.innerHeight * 0.44 },
            5: { x: window.innerWidth * 0.28, y: window.innerHeight * 0.28, width: window.innerWidth * 0.44, height: window.innerHeight * 0.44 }
        };
    }

    updateFairyPosition(x, y) {
        this.fairyPosition.x = x;
        this.fairyPosition.y = y;
    }

    updateFairyEnergy(energy) {
        this.fairyEnergy = energy;
    }

    illuminateZone(zoneId) {
        this.illuminatedZones.add(zoneId);
        this.updateSceneLighting();
    }

    updateSceneLighting() {
        const numZones = this.illuminatedZones.size;
        const overlay = this.darknessOverlay;

        overlay.classList.remove('one-zone-lit', 'two-zones-lit', 'three-zones-lit', 'four-zones-lit', 'all-zones-lit');

        if (numZones >= 5) {
            overlay.classList.add('all-zones-lit');
        } else if (numZones >= 4) {
            overlay.classList.add('four-zones-lit');
        } else if (numZones >= 3) {
            overlay.classList.add('three-zones-lit');
        } else if (numZones >= 2) {
            overlay.classList.add('two-zones-lit');
        } else if (numZones >= 1) {
            overlay.classList.add('one-zone-lit');
        }
    }

    drawZoneLights() {
        this.illuminatedZones.forEach(zoneId => {
            const zone = this.zoneCoordinates[zoneId];
            if (!zone) return;

            const centerX = zone.x + zone.width / 2;
            const centerY = zone.y + zone.height / 2;
            const baseRadius = Math.max(zone.width, zone.height) * 0.6;

            const colorConfigs = {
                1: { r: 255, g: 120, b: 80 },
                2: { r: 200, g: 120, b: 255 },
                3: { r: 120, g: 255, b: 150 },
                4: { r: 120, g: 200, b: 255 },
                5: { r: 255, g: 220, b: 120 }
            };

            const colorConfig = colorConfigs[zoneId] || { r: 255, g: 255, b: 255 };

            for (let i = 0; i < 3; i++) {
                const radius = baseRadius * (1 + i * 0.3);
                const intensity = 0.008 * (1 - i * 0.4);

                const gradient = this.ctx.createRadialGradient(
                    centerX, centerY, 0,
                    centerX, centerY, radius
                );

                gradient.addColorStop(0, `rgba(${colorConfig.r}, ${colorConfig.g}, ${colorConfig.b}, ${intensity})`);
                gradient.addColorStop(0.3, `rgba(${colorConfig.r}, ${colorConfig.g}, ${colorConfig.b}, ${intensity * 0.7})`);
                gradient.addColorStop(0.6, `rgba(${colorConfig.r}, ${colorConfig.g}, ${colorConfig.b}, ${intensity * 0.4})`);
                gradient.addColorStop(1, `rgba(${colorConfig.r}, ${colorConfig.g}, ${colorConfig.b}, 0)`);

                this.ctx.fillStyle = gradient;
                this.ctx.fillRect(
                    centerX - radius,
                    centerY - radius,
                    radius * 2,
                    radius * 2
                );
            }
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawZoneLights();
        requestAnimationFrame(() => this.animate());
    }
}