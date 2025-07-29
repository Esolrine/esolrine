export class DistortionEffect {
    constructor() {
        this.turbulence = document.getElementById('turbulence');
        this.displacement = document.getElementById('displacement');
        this.isActive = false;
        this.animationId = null;

        this.baseFrequency = 0.02;
        this.currentFrequency = this.baseFrequency;
        this.baseScale = 5.0;

        this.frequencyOffsets = [-0.02, 0.01, -0.01, 0.02, 0.015, -0.015, 0.005, -0.008];
        this.scaleOffsets = [-2, 1.5, -1, 2.5, 1, -1.5, 0.5, -0.8];

        this.offsetIndex = 0;
        this.frameInterval = null;
        this.animationSpeed = 200;

        this.seedValue = 1;
        this.intensity = 0.5;

        this.init();
    }

    init() {
        this.checkActivatedZones();
    }

    toggle() {
        if (this.isActive) {
            this.stop();
        } else {
            this.start();
        }
    }

    start() {
        this.isActive = true;

        document.querySelectorAll('.clickable-zone').forEach(zone => {
            zone.classList.add('distortion-active');
        });

        const backgroundContainer = document.getElementById('backgroundContainer');
        if (backgroundContainer) {
            backgroundContainer.classList.add('distortion-active');
        }

        this.startFrameAnimation();
    }

    stop() {
        this.isActive = false;
        this.controlsContainer.style.display = 'none';

        document.querySelectorAll('.clickable-zone').forEach(zone => {
            zone.classList.remove('distortion-active');
        });

        const backgroundContainer = document.getElementById('backgroundContainer');
        if (backgroundContainer) {
            backgroundContainer.classList.remove('distortion-active');
        }

        if (this.frameInterval) {
            clearInterval(this.frameInterval);
            this.frameInterval = null;
        }

        this.turbulence.setAttribute('baseFrequency', this.baseFrequency);
        this.displacement.setAttribute('scale', this.baseScale);
        this.turbulence.setAttribute('seed', '1');
    }

    startFrameAnimation() {
        this.frameInterval = setInterval(() => {
            this.updateFrame();
        }, this.animationSpeed);
    }

    updateFrame() {
        this.offsetIndex = (this.offsetIndex + 1) % this.frequencyOffsets.length;

        const frequencyOffset = this.frequencyOffsets[this.offsetIndex] * this.intensity;
        const scaleOffset = this.scaleOffsets[this.offsetIndex] * this.intensity;

        const newFrequency = Math.max(0.001, this.baseFrequency + frequencyOffset);
        const newScale = Math.max(0, this.baseScale + scaleOffset);

        const randomVariation = (Math.random() - 0.5) * 0.002 * this.intensity;

        this.turbulence.setAttribute('baseFrequency',
            `${newFrequency + randomVariation} ${newFrequency + randomVariation}`
        );
        this.displacement.setAttribute('scale', newScale);
    }

    checkActivatedZones() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const zone = mutation.target;
                    if (zone.classList.contains('permanently-activated') && this.isActive) {
                        setTimeout(() => {
                            zone.classList.add('distortion-active');
                        }, 1000);
                    }
                }
            });
        });

        document.querySelectorAll('.clickable-zone').forEach(zone => {
            observer.observe(zone, { attributes: true });
        });
    }

    setIntensity(intensity) {
        this.intensity = Math.max(0, Math.min(1, intensity));
        this.intensitySlider.value = this.intensity * 100;
    }

    setAnimationSpeed(speed) {
        this.animationSpeed = speed;
        if (this.isActive && this.frameInterval) {
            clearInterval(this.frameInterval);
            this.startFrameAnimation();
        }
    }
}