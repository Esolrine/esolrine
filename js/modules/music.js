
export class MusicManager {
    constructor() {
        this.audio = document.getElementById('backgroundMusic');
        this.playButton = document.getElementById('musicToggle');
        this.volumeSlider = document.getElementById('volumeSlider');
        this.musicControls = document.querySelector('.music-controls');

        this.playIcon = this.playButton.querySelector('.play-icon');
        this.pauseIcon = this.playButton.querySelector('.pause-icon');

        this.isPlaying = false;
        this.volume = 0.7; // Default volume

        this.init();
    }

    init() {
        // Set initial volume
        this.audio.volume = this.volume;
        this.volumeSlider.value = this.volume * 100;

        // Setup event listeners
        this.setupEventListeners();

        // Check if music should autoplay (saved preference)
        this.checkAutoplay();
    }

    setupEventListeners() {
        // Play/Pause button
        this.playButton.addEventListener('click', () => {
            this.togglePlayback();
        });

        // Volume slider
        this.volumeSlider.addEventListener('input', (e) => {
            this.setVolume(e.target.value / 100);
        });

        // Audio events
        this.audio.addEventListener('play', () => {
            this.onPlay();
        });

        this.audio.addEventListener('pause', () => {
            this.onPause();
        });

        this.audio.addEventListener('ended', () => {
            this.onEnded();
        });

        // Space bar to toggle music
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && e.target === document.body) {
                e.preventDefault();
                this.togglePlayback();
            }
        });
    }

    togglePlayback() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    play() {
        this.audio.play().then(() => {
            this.isPlaying = true;
            this.savePlaybackState(true);
        }).catch(error => {
            console.log('Audio playback failed:', error);
            // Handle autoplay policy
            this.showPlayPrompt();
        });
    }

    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.savePlaybackState(false);
    }

    setVolume(value) {
        this.volume = Math.max(0, Math.min(1, value));
        this.audio.volume = this.volume;
        this.saveVolumePreference(this.volume);

        // Visual feedback
        if (this.volume === 0) {
            this.volumeSlider.classList.add('muted');
        } else {
            this.volumeSlider.classList.remove('muted');
        }
    }

    onPlay() {
        this.playIcon.style.display = 'none';
        this.pauseIcon.style.display = 'block';
        this.musicControls.classList.add('playing');
    }

    onPause() {
        this.playIcon.style.display = 'block';
        this.pauseIcon.style.display = 'none';
        this.musicControls.classList.remove('playing');
    }

    onEnded() {
        // The audio will loop automatically due to the loop attribute
        this.onPause();
    }

    // Local storage for preferences
    savePlaybackState(isPlaying) {
        localStorage.setItem('esolrine-music-playing', isPlaying);
    }

    saveVolumePreference(volume) {
        localStorage.setItem('esolrine-music-volume', volume);
    }

    checkAutoplay() {
        // Get saved preferences
        const savedVolume = localStorage.getItem('esolrine-music-volume');
        const wasPlaying = localStorage.getItem('esolrine-music-playing') === 'true';

        if (savedVolume !== null) {
            this.setVolume(parseFloat(savedVolume));
            this.volumeSlider.value = this.volume * 100;
        }

        // Try to autoplay if it was playing before
        if (wasPlaying) {
            // Delay autoplay attempt to ensure page is loaded
            setTimeout(() => {
                this.play();
            }, 1000);
        }
    }

    showPlayPrompt() {
        // Create a subtle prompt to start music
        if (!document.querySelector('.music-prompt')) {
            const prompt = document.createElement('div');
            prompt.className = 'music-prompt';
            prompt.innerHTML = `
                <div class="prompt-content">
                    <p>🎵 Click anywhere to start the music</p>
                </div>
            `;
            document.body.appendChild(prompt);

            const startMusic = () => {
                this.play();
                prompt.remove();
                document.removeEventListener('click', startMusic);
                document.removeEventListener('touchstart', startMusic);
            };

            document.addEventListener('click', startMusic);
            document.addEventListener('touchstart', startMusic);
        }
    }
}