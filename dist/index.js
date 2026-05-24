/**
 * Main entry point for component system
 * This file initializes the component library
 */
import { BaseComponent } from './components/BaseComponent';
import { Navigation, createNavigation } from './components/Navigation';
// Export all components for use in HTML files
export { BaseComponent };
export { Navigation, createNavigation };
// Register components in global scope
window.Components = {
    BaseComponent,
    Navigation,
    createNavigation,
};
console.log('Component system initialized');
//# sourceMappingURL=index.js.map