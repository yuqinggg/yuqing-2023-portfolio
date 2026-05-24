import { BaseComponent, ComponentConfig } from './BaseComponent';
export interface NavigationLink {
    name: string;
    href: string;
}
export interface NavigationConfig extends ComponentConfig {
    brand: string;
    brandHref: string;
    links: NavigationLink[];
}
export declare class Navigation extends BaseComponent {
    config: NavigationConfig;
    constructor(config: NavigationConfig);
    render(): string;
}
/**
 * Factory function for convenient Navigation creation
 */
export declare function createNavigation(config: NavigationConfig): string;
//# sourceMappingURL=Navigation.d.ts.map