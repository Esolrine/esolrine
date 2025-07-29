export class PerformanceMode {
    constructor() {
        this.lowPerformance = false;
        this.checkPerformance();
    }

    checkPerformance() {
        // Détecter automatiquement les problèmes de performance
        let frameCount = 0;
        let lastTime = performance.now();

        const measureFPS = () => {
            frameCount++;
            const currentTime = performance.now();

            if (currentTime - lastTime >= 1000) {
                const fps = frameCount;
                frameCount = 0;
                lastTime = currentTime;

                // Si moins de 30 FPS, activer le mode performance
                if (fps < 30) {
                    this.enableLowPerformanceMode();
                }
            }

            if (!this.lowPerformance) {
                requestAnimationFrame(measureFPS);
            }
        };

        // Mesurer pendant 5 secondes
        measureFPS();
        setTimeout(() => this.lowPerformance = true, 5000);
    }

    enableLowPerformanceMode() {
        console.log('Mode performance activé');

        // Désactiver les filtres
        document.querySelectorAll('#filmGrain, #bookFilter, #mangaFilter, #comicFilter')
            .forEach(filter => filter.classList.remove('active'));

        // Réduire les animations
        document.body.classList.add('reduce-animations');

        // Désactiver la distortion
        if (window.esolrineGame?.distortion?.isActive) {
            window.esolrineGame.distortion.stop();
        }
    }
}