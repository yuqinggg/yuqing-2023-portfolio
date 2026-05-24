/**
 * BaseComponent - Template for all reusable components
 * Provides common functionality that all components inherit
 */
export class BaseComponent {
    constructor(config = {}) {
        this.element = null;
        this.config = config;
    }
    /**
     * Mount - Attach component to DOM
     */
    mount(targetSelector) {
        const target = document.querySelector(targetSelector);
        if (target && target instanceof HTMLElement) {
            target.innerHTML = this.render();
            this.element = target;
            this.afterMount();
        }
    }
    /**
     * AfterMount - Hook for setup after component is mounted
     */
    afterMount() {
        // Override in subclasses for post-render logic
    }
    /**
     * Get a config value with optional default
     */
    getConfig(key, defaultValue) {
        return this.config[key] !== undefined ? this.config[key] : defaultValue;
    }
    /**
     * Helper to add event listeners
     */
    addEventListener(selector, event, callback) {
        const elements = this.element?.querySelectorAll(selector);
        if (elements) {
            elements.forEach((el) => {
                if (el instanceof HTMLElement) {
                    el.addEventListener(event, callback);
                }
            });
        }
    }
    /**
     * Helper to escape HTML for safety
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}
//# sourceMappingURL=BaseComponent.js.map