import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';

// jsdom has no modal dialogs and no popovers, the components use both.
if (!HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
    this.setAttribute('open', '');
  };
}

if (!HTMLDialogElement.prototype.close) {
  HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
    this.removeAttribute('open');
    this.dispatchEvent(new Event('close'));
  };
}

if (!HTMLElement.prototype.showPopover) {
  HTMLElement.prototype.showPopover = function showPopover() {};
}

if (!HTMLElement.prototype.hidePopover) {
  HTMLElement.prototype.hidePopover = function hidePopover() {};
}

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
