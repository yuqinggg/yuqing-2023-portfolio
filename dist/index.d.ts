/**
 * Main entry point for component system
 * This file initializes the component library
 */
import { BaseComponent, ComponentConfig } from './components/BaseComponent';
import { Navigation, createNavigation, NavigationConfig, NavigationLink } from './components/Navigation';
export { BaseComponent, ComponentConfig };
export { Navigation, createNavigation, NavigationConfig, NavigationLink };
/**
 * Global namespace for component access from HTML
 */
declare global {
    interface Window {
        Components: {
            BaseComponent: typeof BaseComponent;
            Navigation: typeof Navigation;
            createNavigation: typeof createNavigation;
        };
    }
}
//# sourceMappingURL=index.d.ts.map