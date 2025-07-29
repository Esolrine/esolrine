export class VisualFilters {
    constructor() {
        this.filters = {
            film: { element: document.getElementById('filmGrain') },
            book: { element: document.getElementById('bookFilter') },
            vignette: { element: document.getElementById('vignetteFilter') },
            manga: { element: document.getElementById('mangaFilter') },
            comic: { element: document.getElementById('comicFilter') }
        };

        this.activeFilters = new Set();
        this.enableDefaultFilters();
    }

    enableDefaultFilters() {
        // Réduire les filtres par défaut pour améliorer les performances
        const defaultFilters = ['book', 'vignette'];
        defaultFilters.forEach(filterType => {
            this.enableFilter(filterType);
            this.activeFilters.add(filterType);
        });
    }

    toggleFilter(filterType) {
        if (this.activeFilters.has(filterType)) {
            this.disableFilter(filterType);
            this.activeFilters.delete(filterType);
        } else {
            this.enableFilter(filterType);
            this.activeFilters.add(filterType);
        }
    }

    enableFilter(filterType) {
        const filter = this.filters[filterType];
        if (filter) {
            filter.element.classList.add('active');
        }
    }

    disableFilter(filterType) {
        const filter = this.filters[filterType];
        if (filter) {
            filter.element.classList.remove('active');
        }
    }

    disableAllFilters() {
        this.activeFilters.forEach(filterType => {
            this.disableFilter(filterType);
        });
        this.activeFilters.clear();
    }

    enableStoryMode() {
        this.enableFilter('book');
        this.enableFilter('vignette');
        this.activeFilters.add('book');
        this.activeFilters.add('vignette');
    }

    enableCinematicMode() {
        this.enableFilter('film');
        this.activeFilters.add('film');
    }
}