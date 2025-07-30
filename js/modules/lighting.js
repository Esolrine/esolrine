export class DynamicLighting {
    constructor() {
        this.canvas = document.getElementById('lightingCanvas');
        this.ctx = this.canvas.getContext('2d');

        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        this.illuminatedZones = new Set();
        this.zoneCoordinates = this.calculateZoneCoordinates();

        this.fairyPosition = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
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
            5: { x: window.innerWidth * 0.28, y: window.innerHeight * 28, width: window.innerWidth * 0.44, height: window.innerHeight * 0.44 }
        };
    }

    updateFairyPosition(x, y) {
        this.fairyPosition.x = x;
        this.fairyPosition.y = y;
    }

    illuminateZone(zoneId) {
        this.illuminatedZones.add(zoneId);
    }
}