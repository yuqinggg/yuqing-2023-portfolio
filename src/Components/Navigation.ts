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

export class Navigation extends BaseComponent {
  declare config: NavigationConfig;

  constructor(config: NavigationConfig) {
    super(config);
  }

  render(): string {
    const { brand, brandHref, links } = this.config;

    const linksHtml = links
      .map(
        (link) => `
      <li class="nav-item">
        <a class="nav-link js-scroll-trigger" href="${this.escapeHtml(link.href)}">${this.escapeHtml(link.name)}</a>
      </li>
    `
      )
      .join('');

    return `
    <nav class="navbar navbar-expand-sm navbar-light bg-white fixed-top py-3 navbar-theme-light" id="mainNav" data-navbar-theme="light">
      <div class="container">
        <a class="navbar-brand js-scroll-trigger" href="${this.escapeHtml(brandHref)}">${this.escapeHtml(brand)}</a>
        <button
          class="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarResponsive"
          aria-controls="navbarResponsive"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <button class="navbar-theme-toggle ml-2" type="button" data-navbar-theme-toggle aria-pressed="false" aria-label="Switch navbar to dark mode">
          <span class="navbar-theme-toggle-icon" data-navbar-theme-icon aria-hidden="true">☾</span>
          <span data-navbar-theme-label>Dark mode</span>
        </button>
        <div class="collapse navbar-collapse" id="navbarResponsive">
          <ul class="navbar-nav ml-auto">
            ${linksHtml}
          </ul>
        </div>
      </div>
    </nav>
    `;
  }
}

/**
 * Factory function for convenient Navigation creation
 */
export function createNavigation(config: NavigationConfig): string {
  const nav = new Navigation(config);
  return nav.render();
}
