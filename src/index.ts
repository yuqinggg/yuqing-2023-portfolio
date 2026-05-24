/**
 * Main entry point for component system
 * This file initializes the component library
 */

import { BaseComponent, ComponentConfig } from './components/BaseComponent';
import { Navigation, createNavigation, NavigationConfig, NavigationLink } from './components/Navigation';

// Export all components for use in HTML files
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

// Register components in global scope
window.Components = {
  BaseComponent,
  Navigation,
  createNavigation,
};

console.log('Component system initialized');
