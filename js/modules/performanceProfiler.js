export class PerformanceProfiler {
    constructor() {
        this.isActive = false;
        this.animationMetrics = new Map();
        this.functionMetrics = new Map();
        this.frameMetrics = [];
        this.currentFrame = 0;

        // Créer l'interface
        this.createUI();

        // Intercepter les fonctions
        this.setupFunctionInterceptors();

        // Observer les animations
        this.setupAnimationObserver();

        // Keyboard shortcut
        this.setupKeyboardShortcut();
    }

    createUI() {
        // Container principal
        this.container = document.createElement('div');
        this.container.id = 'performance-profiler';
        this.container.innerHTML = `
            <style>
                #performance-profiler {
                    position: fixed;
                    top: 10px;
                    right: 10px;
                    width: 400px;
                    max-height: 80vh;
                    background: rgba(0, 0, 0, 0.95);
                    border: 2px solid #0f0;
                    border-radius: 5px;
                    font-family: 'Courier New', monospace;
                    font-size: 11px;
                    color: #0f0;
                    display: none;
                    z-index: 999999;
                    overflow: hidden;
                }
                
                #performance-profiler.active {
                    display: block;
                }
                
                .perf-header {
                    background: #111;
                    padding: 10px;
                    border-bottom: 1px solid #0f0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .perf-title {
                    font-size: 14px;
                    font-weight: bold;
                }
                
                .perf-close {
                    cursor: pointer;
                    font-size: 18px;
                    line-height: 1;
                }
                
                .perf-tabs {
                    display: flex;
                    background: #222;
                    border-bottom: 1px solid #0f0;
                }
                
                .perf-tab {
                    flex: 1;
                    padding: 8px;
                    text-align: center;
                    cursor: pointer;
                    border-right: 1px solid #0f0;
                    transition: background 0.2s;
                }
                
                .perf-tab:last-child {
                    border-right: none;
                }
                
                .perf-tab.active {
                    background: #0f0;
                    color: #000;
                }
                
                .perf-content {
                    height: 400px;
                    overflow-y: auto;
                    padding: 10px;
                }
                
                .perf-item {
                    padding: 5px;
                    margin-bottom: 5px;
                    background: #111;
                    border-radius: 3px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .perf-item.warning {
                    background: #330;
                    border: 1px solid #ff0;
                }
                
                .perf-item.critical {
                    background: #300;
                    border: 1px solid #f00;
                }
                
                .perf-name {
                    flex: 1;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                
                .perf-value {
                    font-weight: bold;
                    margin-left: 10px;
                }
                
                .perf-bar {
                    height: 4px;
                    background: #333;
                    margin-top: 3px;
                    border-radius: 2px;
                    overflow: hidden;
                }
                
                .perf-bar-fill {
                    height: 100%;
                    background: #0f0;
                    transition: width 0.3s;
                }
                
                .perf-fps {
                    font-size: 24px;
                    text-align: center;
                    margin-bottom: 10px;
                }
                
                .fps-good { color: #0f0; }
                .fps-ok { color: #ff0; }
                .fps-bad { color: #f00; }
                
                .perf-summary {
                    padding: 10px;
                    background: #111;
                    border-radius: 3px;
                    margin-bottom: 10px;
                }
                
                ::-webkit-scrollbar {
                    width: 8px;
                }
                
                ::-webkit-scrollbar-track {
                    background: #111;
                }
                
                ::-webkit-scrollbar-thumb {
                    background: #0f0;
                    border-radius: 4px;
                }
            </style>
            
            <div class="perf-header">
                <div class="perf-title">🚀 Performance Profiler</div>
                <div class="perf-close" onclick="window.performanceProfiler.toggle()">×</div>
            </div>
            
            <div class="perf-tabs">
                <div class="perf-tab active" data-tab="overview">Overview</div>
                <div class="perf-tab" data-tab="animations">Animations</div>
                <div class="perf-tab" data-tab="javascript">JavaScript</div>
                <div class="perf-tab" data-tab="rendering">Rendering</div>
            </div>
            
            <div class="perf-content" id="perf-content">
                <!-- Le contenu sera injecté ici -->
            </div>
        `;

        document.body.appendChild(this.container);

        // Event listeners pour les tabs
        this.container.querySelectorAll('.perf-tab').forEach(tab => {
            tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
        });

        this.currentTab = 'overview';
    }

    setupKeyboardShortcut() {
        document.addEventListener('keydown', (e) => {
            // Shift + P
            if (e.shiftKey && e.key === 'P') {
                e.preventDefault();
                this.toggle();
            }
        });
    }

    toggle() {
        this.isActive = !this.isActive;
        this.container.classList.toggle('active', this.isActive);

        if (this.isActive) {
            this.start();
        } else {
            this.stop();
        }
    }

    start() {
        this.frameLoop();
        this.updateInterval = setInterval(() => this.updateUI(), 500);
    }

    stop() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
    }

    frameLoop() {
        if (!this.isActive) return;

        const now = performance.now();

        // Calculer FPS
        if (this.lastFrameTime) {
            const delta = now - this.lastFrameTime;
            this.frameMetrics.push(delta);

            // Garder seulement les 60 dernières frames
            if (this.frameMetrics.length > 60) {
                this.frameMetrics.shift();
            }
        }

        this.lastFrameTime = now;
        this.currentFrame++;

        requestAnimationFrame(() => this.frameLoop());
    }

    setupAnimationObserver() {
        // Observer toutes les animations CSS
        setInterval(() => {
            if (!this.isActive) return;

            const animations = document.getAnimations();
            this.animationMetrics.clear();

            animations.forEach(animation => {
                if (animation instanceof CSSAnimation || animation instanceof CSSTransition) {
                    const target = animation.effect.target;
                    const name = animation.animationName || 'transition';
                    const props = this.getAnimatedProperties(animation);

                    const key = `${name} on ${this.getElementSelector(target)}`;

                    this.animationMetrics.set(key, {
                        name: key,
                        properties: props,
                        duration: animation.effect.getTiming().duration,
                        iterations: animation.effect.getTiming().iterations,
                        playState: animation.playState,
                        element: target,
                        cost: this.calculateAnimationCost(props)
                    });
                }
            });
        }, 100);
    }

    getAnimatedProperties(animation) {
        const keyframes = animation.effect.getKeyframes();
        const properties = new Set();

        keyframes.forEach(keyframe => {
            Object.keys(keyframe).forEach(prop => {
                if (prop !== 'offset' && prop !== 'easing' && prop !== 'composite') {
                    properties.add(prop);
                }
            });
        });

        return Array.from(properties);
    }

    calculateAnimationCost(properties) {
        // Propriétés coûteuses
        const expensiveProps = {
            'filter': 10,
            'boxShadow': 8,
            'width': 7,
            'height': 7,
            'top': 6,
            'left': 6,
            'right': 6,
            'bottom': 6,
            'borderRadius': 5,
            'backgroundColor': 4,
            'color': 3,
            'opacity': 1,
            'transform': 1
        };

        let cost = 0;
        properties.forEach(prop => {
            cost += expensiveProps[prop] || 5;
        });

        return cost;
    }

    getElementSelector(element) {
        if (!element) return 'unknown';

        let selector = element.tagName.toLowerCase();

        if (element.id) {
            selector += `#${element.id}`;
        } else if (element.className) {
            const classes = element.className.split(' ').filter(c => c).slice(0, 2);
            selector += `.${classes.join('.')}`;
        }

        return selector;
    }

    setupFunctionInterceptors() {
        // Liste des fonctions à monitorer
        const functionsToMonitor = [
            // Fairy
            { obj: 'window.esolrineGame.fairy', method: 'updateMovement' },
            { obj: 'window.esolrineGame.fairy', method: 'guidedMovement' },
            { obj: 'window.esolrineGame.fairy', method: 'wanderFreely' },

            // Lighting
            { obj: 'window.esolrineGame.lighting', method: 'drawZoneLights' },
            { obj: 'window.esolrineGame.lighting', method: 'animate' },

            // Zones
            { obj: 'window.esolrineGame.zoneManager', method: 'checkZoneCollision' },
            { obj: 'window.esolrineGame.zoneManager', method: 'startProgressiveLoading' },

            // Distortion
            { obj: 'window.esolrineGame.distortion', method: 'updateFrame' },

            // Cursor
            { obj: 'window.esolrineGame.cursor', method: 'updateCursorPosition' },
            { obj: 'window.esolrineGame.cursor', method: 'createTrail' }
        ];

        // Attendre que le jeu soit initialisé
        setTimeout(() => {
            functionsToMonitor.forEach(({ obj, method }) => {
                this.interceptFunction(obj, method);
            });
        }, 1000);
    }

    interceptFunction(objPath, methodName) {
        try {
            const parts = objPath.split('.');
            let obj = window;

            for (let i = 1; i < parts.length; i++) {
                obj = obj[parts[i]];
                if (!obj) return;
            }

            const original = obj[methodName];
            if (!original) return;

            obj[methodName] = (...args) => {
                const start = performance.now();
                const result = original.apply(obj, args);
                const duration = performance.now() - start;

                const key = `${objPath}.${methodName}`;

                if (!this.functionMetrics.has(key)) {
                    this.functionMetrics.set(key, {
                        name: key,
                        totalTime: 0,
                        calls: 0,
                        avgTime: 0,
                        maxTime: 0
                    });
                }

                const metrics = this.functionMetrics.get(key);
                metrics.totalTime += duration;
                metrics.calls++;
                metrics.avgTime = metrics.totalTime / metrics.calls;
                metrics.maxTime = Math.max(metrics.maxTime, duration);

                return result;
            };
        } catch (e) {
            console.warn(`Failed to intercept ${objPath}.${methodName}`);
        }
    }

    switchTab(tab) {
        this.currentTab = tab;

        // Update tab UI
        this.container.querySelectorAll('.perf-tab').forEach(t => {
            t.classList.toggle('active', t.dataset.tab === tab);
        });

        this.updateUI();
    }

    updateUI() {
        const content = document.getElementById('perf-content');
        if (!content) return;

        switch (this.currentTab) {
            case 'overview':
                content.innerHTML = this.renderOverview();
                break;
            case 'animations':
                content.innerHTML = this.renderAnimations();
                break;
            case 'javascript':
                content.innerHTML = this.renderJavaScript();
                break;
            case 'rendering':
                content.innerHTML = this.renderRendering();
                break;
        }
    }

    renderOverview() {
        const fps = this.calculateFPS();
        const fpsClass = fps >= 55 ? 'fps-good' : fps >= 30 ? 'fps-ok' : 'fps-bad';

        // Trouver les plus gros consommateurs
        const topAnimations = Array.from(this.animationMetrics.values())
            .sort((a, b) => b.cost - a.cost)
            .slice(0, 3);

        const topFunctions = Array.from(this.functionMetrics.values())
            .sort((a, b) => b.avgTime - a.avgTime)
            .slice(0, 3);

        return `
            <div class="perf-fps ${fpsClass}">${fps} FPS</div>
            
            <div class="perf-summary">
                <strong>Quick Stats:</strong><br>
                Active Animations: ${this.animationMetrics.size}<br>
                JS Functions Tracked: ${this.functionMetrics.size}<br>
                DOM Nodes: ${document.querySelectorAll('*').length}<br>
                Memory: ${performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1048576) + ' MB' : 'N/A'}
            </div>
            
            <strong>⚠️ Top Performance Issues:</strong>
            
            <div style="margin-top: 10px;">
                <em>Expensive Animations:</em>
                ${topAnimations.map(anim => `
                    <div class="perf-item ${anim.cost > 15 ? 'critical' : anim.cost > 10 ? 'warning' : ''}">
                        <div class="perf-name">${anim.name}</div>
                        <div class="perf-value">Cost: ${anim.cost}</div>
                    </div>
                `).join('')}
            </div>
            
            <div style="margin-top: 10px;">
                <em>Slow Functions:</em>
                ${topFunctions.map(fn => `
                    <div class="perf-item ${fn.avgTime > 5 ? 'critical' : fn.avgTime > 2 ? 'warning' : ''}">
                        <div class="perf-name">${fn.name}</div>
                        <div class="perf-value">${fn.avgTime.toFixed(2)}ms</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderAnimations() {
        const animations = Array.from(this.animationMetrics.values())
            .sort((a, b) => b.cost - a.cost);

        if (animations.length === 0) {
            return '<div style="text-align: center; margin-top: 50px;">No active animations detected</div>';
        }

        return animations.map(anim => {
            const costLevel = anim.cost > 15 ? 'critical' : anim.cost > 10 ? 'warning' : '';

            return `
                <div class="perf-item ${costLevel}">
                    <div>
                        <div class="perf-name">${anim.name}</div>
                        <div style="font-size: 10px; opacity: 0.7;">
                            Props: ${anim.properties.join(', ')}<br>
                            Duration: ${anim.duration}ms | State: ${anim.playState}
                        </div>
                        <div class="perf-bar">
                            <div class="perf-bar-fill" style="width: ${Math.min(anim.cost * 5, 100)}%; background: ${anim.cost > 15 ? '#f00' : anim.cost > 10 ? '#ff0' : '#0f0'}"></div>
                        </div>
                    </div>
                    <div class="perf-value">Cost: ${anim.cost}</div>
                </div>
            `;
        }).join('');
    }

    renderJavaScript() {
        const functions = Array.from(this.functionMetrics.values())
            .sort((a, b) => b.avgTime - a.avgTime);

        if (functions.length === 0) {
            return '<div style="text-align: center; margin-top: 50px;">No functions tracked yet</div>';
        }

        return functions.map(fn => {
            const level = fn.avgTime > 5 ? 'critical' : fn.avgTime > 2 ? 'warning' : '';

            return `
                <div class="perf-item ${level}">
                    <div>
                        <div class="perf-name">${fn.name}</div>
                        <div style="font-size: 10px; opacity: 0.7;">
                            Calls: ${fn.calls} | Max: ${fn.maxTime.toFixed(2)}ms
                        </div>
                        <div class="perf-bar">
                            <div class="perf-bar-fill" style="width: ${Math.min(fn.avgTime * 10, 100)}%; background: ${fn.avgTime > 5 ? '#f00' : fn.avgTime > 2 ? '#ff0' : '#0f0'}"></div>
                        </div>
                    </div>
                    <div class="perf-value">${fn.avgTime.toFixed(2)}ms</div>
                </div>
            `;
        }).join('');
    }

    renderRendering() {
        // Analyser les éléments qui causent des repaints
        const expensiveElements = this.findExpensiveElements();

        return `
            <div class="perf-summary">
                <strong>Rendering Stats:</strong><br>
                Layer Count: ${this.countLayers()}<br>
                Elements with filters: ${document.querySelectorAll('[style*="filter"]').length}<br>
                Elements with transforms: ${document.querySelectorAll('[style*="transform"]').length}<br>
                Fixed positioned: ${document.querySelectorAll('[style*="position: fixed"]').length}
            </div>
            
            <strong>Expensive Elements:</strong>
            ${expensiveElements.map(el => `
                <div class="perf-item ${el.cost > 10 ? 'warning' : ''}">
                    <div>
                        <div class="perf-name">${el.selector}</div>
                        <div style="font-size: 10px; opacity: 0.7;">
                            ${el.reasons.join(' | ')}
                        </div>
                    </div>
                    <div class="perf-value">Cost: ${el.cost}</div>
                </div>
            `).join('')}
        `;
    }

    findExpensiveElements() {
        const expensive = [];
        const elements = document.querySelectorAll('*');

        elements.forEach(el => {
            const styles = getComputedStyle(el);
            let cost = 0;
            const reasons = [];

            // Check for expensive properties
            if (styles.filter && styles.filter !== 'none') {
                cost += 5;
                reasons.push('filter');
            }

            if (styles.boxShadow && styles.boxShadow !== 'none') {
                cost += 3;
                reasons.push('box-shadow');
            }

            if (styles.backdropFilter && styles.backdropFilter !== 'none') {
                cost += 8;
                reasons.push('backdrop-filter');
            }

            if (styles.mixBlendMode && styles.mixBlendMode !== 'normal') {
                cost += 4;
                reasons.push('mix-blend-mode');
            }

            if (cost > 0) {
                expensive.push({
                    element: el,
                    selector: this.getElementSelector(el),
                    cost,
                    reasons
                });
            }
        });

        return expensive.sort((a, b) => b.cost - a.cost).slice(0, 10);
    }

    countLayers() {
        // Approximation du nombre de layers
        return document.querySelectorAll('[style*="transform"], [style*="will-change"], [style*="position: fixed"]').length;
    }

    calculateFPS() {
        if (this.frameMetrics.length < 2) return 60;

        const avgFrameTime = this.frameMetrics.reduce((a, b) => a + b, 0) / this.frameMetrics.length;
        return Math.round(1000 / avgFrameTime);
    }
}

// Auto-initialize
window.performanceProfiler = new PerformanceProfiler();

// Export
export default window.performanceProfiler;