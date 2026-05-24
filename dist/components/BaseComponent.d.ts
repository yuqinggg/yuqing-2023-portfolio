/**
 * BaseComponent - Template for all reusable components
 * Provides common functionality that all components inherit
 */
export interface ComponentConfig {
    [key: string]: any;
}
export declare abstract class BaseComponent {
    protected config: ComponentConfig;
    protected element: HTMLElement | null;
    constructor(config?: ComponentConfig);
    /**
     * Render - Abstract method that subclasses must implement
     */
    abstract render(): string;
    /**
     * Mount - Attach component to DOM
     */
    mount(targetSelector: string): void;
    /**
     * AfterMount - Hook for setup after component is mounted
     */
    protected afterMount(): void;
    /**
     * Get a config value with optional default
     */
    protected getConfig<T>(key: string, defaultValue?: T): T | undefined;
    /**
     * Helper to add event listeners
     */
    protected addEventListener(selector: string, event: string, callback: (e: Event) => void): void;
    /**
     * Helper to escape HTML for safety
     */
    protected escapeHtml(text: string): string;
}
//# sourceMappingURL=BaseComponent.d.ts.map