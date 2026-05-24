import { BaseComponent } from './BaseComponent';
export class Navigation extends BaseComponent {
    constructor(config) {
        super(config);
    }
    render() {
        const { brand, brandHref, links } = this.config;
        const linksHtml = links
            .map((link) => `
      <li class="nav-item">
        <a class="nav-link js-scroll-trigger" href="${this.escapeHtml(link.href)}">${this.escapeHtml(link.name)}</a>
      </li>
    `)
            .join('');
        return `
    <nav class="navbar navbar-expand-sm navbar-light bg-white fixed-top py-3" id="mainNav">
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
export function createNavigation(config) {
    const nav = new Navigation(config);
    return nav.render();
}
//# sourceMappingURL=Navigation.js.map