/**
 * Modal Dialog Controller
 */
export const modal = {

  init() {
    let overlay = document.getElementById('modal-overlay');

    // Create overlay if it does not exist
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'modal-overlay';
      overlay.className = 'modal-overlay';

      document.body.appendChild(overlay);

      // Close when clicking outside the modal
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          modal.close();
        }
      });
    }

    // IMPORTANT:
    // Make sure modal-container exists even if overlay already exists
    let container = document.getElementById('modal-container');

    if (!container) {
      container = document.createElement('div');
      container.id = 'modal-container';
      container.className = 'modal-content';

      overlay.appendChild(container);
    }
  },

  open({ title, bodyHtml, footerHtml = '' }) {

    this.init();

    const overlay = document.getElementById('modal-overlay');
    const container = document.getElementById('modal-container');

    // Safety check
    if (!overlay || !container) {
      console.error('Modal elements were not created correctly.');
      return;
    }

    container.innerHTML = `
      <div class="modal-header">
        <h3>${title}</h3>

        <button
          class="btn-icon"
          id="modal-close-btn"
          type="button"
          style="border:none;"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div class="modal-body">
        ${bodyHtml}
      </div>

      ${
        footerHtml
            ? `<div class="modal-footer">${footerHtml}</div>`
            : ''
    }
    `;

    const closeButton = document.getElementById('modal-close-btn');

    if (closeButton) {
      closeButton.addEventListener('click', () => {
        modal.close();
      });
    }

    overlay.classList.add('active');
  },

  close() {
    const overlay = document.getElementById('modal-overlay');

    if (overlay) {
      overlay.classList.remove('active');
    }
  }
};