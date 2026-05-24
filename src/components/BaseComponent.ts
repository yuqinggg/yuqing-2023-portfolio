/**
 * BaseComponent - Template for all reusable components
 * Provides common functionality that all components inherit
 */

export interface ComponentConfig {
  [key: string]: any;
}

export abstract class BaseComponent {
  protected config: ComponentConfig;
  protected element: HTMLElement | null = null;

  constructor(config: ComponentConfig = {}) {
    this.config = config;
  }

  /**
   * Render - Abstract method that subclasses must implement
   */
  abstract render(): string;

  /**
   * Mount - Attach component to DOM
   */
  mount(targetSelector: string): void {
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
  protected afterMount(): void {
    // Override in subclasses for post-render logic
  }

  /**
   * Get a config value with optional default
   */
  protected getConfig<T>(key: string, defaultValue?: T): T | undefined {
    return this.config[key] !== undefined ? this.config[key] : defaultValue;
  }

  /**
   * Helper to add event listeners
   */
  protected addEventListener(
    selector: string,
    event: string,
    callback: (e: Event) => void
  ): void {
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
  protected escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}
