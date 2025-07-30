export class AthulanMode {
    constructor() {
        this.isActive = false;
        this.mysticalMessages = [
            "La page se révèle à ceux qui connaissent le nom...",
        ];

        // Set global indicator
        window.__ATHULAN_AWAKENED__ = false;

        this.init();
    }

    init() {
        // Log mystical message with corrupted effect
        const message = this.getRandomMessage();
        console.log(
            `%c${message}`,
            `color: #8B2BE2; 
             font-size: 16px; 
             font-weight: bold; 
             text-shadow: 
                0 0 10px rgba(138, 43, 226, 0.8),
                0 0 20px rgba(138, 43, 226, 0.6),
                -2px -2px 3px rgba(255, 0, 0, 0.3),
                2px 2px 3px rgba(0, 0, 255, 0.3);
             font-family: monospace;
             letter-spacing: 2px;`
        );

        // Add corrupted ASCII art
        console.log(
            `%c
Ⱥ̸Ŧ̵Ħ̷ᵾ̸Ł̶Ⱥ̵Ꞥ
            `,
            'color: #8B2BE2; font-size: 10px; line-height: 10px;'
        );

        // Check URL on initialization
        this.checkURL();
    }

    checkURL() {
        const url = window.location.href.toLowerCase();
        const searchParams = new URLSearchParams(window.location.search).toString().toLowerCase();
        const hash = window.location.hash.toLowerCase();

        // Check if "athulan" appears anywhere in the URL
        const shouldActivate = url.includes('athulan') ||
            searchParams.includes('athulan') ||
            hash.includes('athulan');

        if (shouldActivate && !this.isActive) {
            this.activate();
        } else if (!shouldActivate && this.isActive) {
            this.deactivate();
        }
    }

    activate() {
        this.isActive = true;
        window.__ATHULAN_AWAKENED__ = true;

        // Change body attribute
        document.body.setAttribute('data-realm', 'athulan');

        // Add subtle page title change with corruption
        if (!document.title.includes('Awakened')) {
            document.title = 'Ɇ̸s̵ø̷ł̸ɍ̶ɨ̵ꞥ̷ɇ̸';
        }

        // Add corruption to console
        this.startConsoleCorruption();
    }

    deactivate() {
        this.isActive = false;
        window.__ATHULAN_AWAKENED__ = false;

        // Reset body attribute
        document.body.setAttribute('data-realm', 'standard');

        // Reset title
        document.title = 'Esolrine';

        // Stop console corruption
        this.stopConsoleCorruption();

        // Remove hidden comments
        const comments = [...document.body.childNodes].filter(node =>
            node.nodeType === Node.COMMENT_NODE &&
            node.textContent.includes('Ⱥ̸ŧ̵ħ̷ᵾ̸ł̶ⱥ̵ꞥ̷')
        );
        comments.forEach(comment => comment.remove());
    }

    getRandomMessage() {
        return this.mysticalMessages[Math.floor(Math.random() * this.mysticalMessages.length)];
    }

    startConsoleCorruption() {
        if (this.corruptionInterval) return;

        const corruptedMessages = [
            "Đ̵ø̷ ̸ɏ̶ø̵ᵾ̷ ̸f̶ɇ̵ɇ̷ł̸ ̶ɨ̵ŧ̷?̸",
            "Ⱥ̵ɍ̷ɇ̸ ̶ɏ̵ø̷ᵾ̸ ̶ɍ̵ɇ̷ⱥ̸đ̶ɏ̵?̷"
        ];

        let messageIndex = 0;
        this.corruptionInterval = setInterval(() => {
            if (!this.isActive) {
                this.stopConsoleCorruption();
                return;
            }

            console.log(
                `%c${corruptedMessages[messageIndex]}`,
                `color: #${Math.random() > 0.5 ? '8B2BE2' : 'ff0000'}; 
                 opacity: ${0.3 + Math.random() * 0.7};
                 font-size: ${10 + Math.random() * 5}px;
                 margin-left: ${Math.random() * 50}px;`
            );

            messageIndex = (messageIndex + 1) % corruptedMessages.length;
        }, 30000); // Every 30 seconds
    }

    stopConsoleCorruption() {
        if (this.corruptionInterval) {
            clearInterval(this.corruptionInterval);
            this.corruptionInterval = null;
        }
    }
}