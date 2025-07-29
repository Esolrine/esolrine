export class LanguageUI {
    constructor(languageManager) {
        this.languageManager = languageManager;
        this.toggle = document.getElementById('languageToggle');
        this.dropdown = document.getElementById('languageDropdown');
        this.currentLangDisplay = this.toggle.querySelector('.language-current');
        this.options = document.querySelectorAll('.language-option');
        this.isOpen = false;

        this.init();
    }

    init() {
        this.updateDisplay();
        this.setupEventListeners();

        // Écouter les changements de langue
        window.addEventListener('languageChanged', () => {
            this.updateDisplay();
        });
    }

    setupEventListeners() {
        // Toggle dropdown
        this.toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown();
        });

        // Language options
        this.options.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const lang = option.dataset.lang;
                this.selectLanguage(lang);
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            if (this.isOpen) {
                this.closeDropdown();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.isOpen) {
                if (e.key === 'Escape') {
                    this.closeDropdown();
                }
            }
        });
    }

    toggleDropdown() {
        if (this.isOpen) {
            this.closeDropdown();
        } else {
            this.openDropdown();
        }
    }

    openDropdown() {
        this.dropdown.classList.add('active');
        this.isOpen = true;

        // Add animation to toggle button
        this.toggle.classList.add('active');

        // Update active states
        this.updateActiveStates();
    }

    closeDropdown() {
        this.dropdown.classList.remove('active');
        this.isOpen = false;
        this.toggle.classList.remove('active');
    }

    selectLanguage(lang) {
        if (lang !== this.languageManager.currentLanguage) {
            // Add transition effect
            document.body.classList.add('language-changing');

            // Change language
            this.languageManager.setLanguage(lang);

            // Remove transition effect after animation
            setTimeout(() => {
                document.body.classList.remove('language-changing');
            }, 500);
        }

        this.closeDropdown();
    }

    updateDisplay() {
        const currentLang = this.languageManager.currentLanguage.toUpperCase();
        this.currentLangDisplay.textContent = currentLang;
        this.updateActiveStates();
    }

    updateActiveStates() {
        this.options.forEach(option => {
            if (option.dataset.lang === this.languageManager.currentLanguage) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
    }
}