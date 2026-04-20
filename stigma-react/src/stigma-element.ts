import { createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { StigmaForm } from './components/StigmaForm';
import type { StigmaEnvelope } from './types/stigma';
import './index.css';

class StigmaFormElement extends HTMLElement {
  private root: Root | null = null;
  private mountPoint: HTMLDivElement | null = null;

  connectedCallback() {
    this.mountPoint = document.createElement('div');
    this.appendChild(this.mountPoint);
    this.root = createRoot(this.mountPoint);
    this.render();
  }

  disconnectedCallback() {
    this.root?.unmount();
    this.root = null;
    if (this.mountPoint?.parentNode === this) {
      this.removeChild(this.mountPoint);
    }
    this.mountPoint = null;
  }

  static get observedAttributes() {
    return ['data', 'title', 'for-print'];
  }

  attributeChangedCallback() {
    if (this.root) this.render();
  }

  private render() {
    if (!this.root) return;
    const jsonStr =
      this.getAttribute('data') ?? (this.textContent ? this.textContent.trim() : '') ?? '';
    const title = this.getAttribute('title') ?? undefined;
    const forPrint = this.getAttribute('for-print') != null;
    if (!jsonStr) {
      this.root.render(createElement('div', { className: 'p-4 text-sm text-gray-500 italic' }, 'stigma-form: no data provided'));
      return;
    }
    try {
      const data: StigmaEnvelope = JSON.parse(jsonStr);
      this.root.render(createElement(StigmaForm, { data, title, forPrint }));
    } catch (e) {
      console.error('stigma-form: invalid JSON', e);
      this.root.render(
        createElement(
          'div',
          { className: 'p-4 text-sm text-red-600' },
          'stigma-form: invalid JSON in data attribute',
        ),
      );
    }
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('stigma-form')) {
  customElements.define('stigma-form', StigmaFormElement);
}

export { StigmaFormElement };
