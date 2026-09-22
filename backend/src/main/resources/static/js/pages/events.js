import { modal } from '../modal.js';
import { toast } from '../toast.js';
import { auth } from '../auth.js';

// Initial seed events stored in localStorage for demo experience
const DEFAULT_EVENTS = [
  {
    id: 1,
    title: 'SLIIT Annual Tech Symposium 2026',
    category: 'Academic & Tech',
    date: '2026-10-24',
    time: '09:00 AM',
    venue: 'Main Auditorium, Malabe',
    expectedAttendees: 450,
    budget: '$8,500',
    status: 'Confirmed',
    coordinator: 'Dr. Bandara',
    description: 'Premier academic convention exploring AI agentic breakthroughs, distributed systems, and modern software architectures.'
  },
  {
    id: 2,
    title: 'Executive Networking & Awards Gala',
    category: 'Corporate',
    date: '2026-11-12',
    time: '06:30 PM',
    venue: 'Grand Ballroom, Colombo',
    expectedAttendees: 280,
    budget: '$15,000',
    status: 'Planning',
    coordinator: 'Ms. Perera',
    description: 'Exclusive black-tie networking gathering for corporate partners, alumni, and industry delegates.'
  },
  {
    id: 3,
    title: 'National Robotics Hackathon 2026',
    category: 'Competition',
    date: '2026-12-05',
    time: '08:00 AM',
    venue: 'Innovation Tech Hub',
    expectedAttendees: 150,
    budget: '$6,200',
    status: 'In Review',
    coordinator: 'Mr. Fernando',
    description: '36-hour non-stop prototyping hackathon challenging teams to build robotics and IoT solutions.'
  },
  {
    id: 4,
    title: 'Alumni Homecoming Festival',
    category: 'Social',
    date: '2027-01-18',
    time: '04:00 PM',
    venue: 'Campus Grounds & Amphitheater',
    expectedAttendees: 800,
    budget: '$12,000',
    status: 'Confirmed',
    coordinator: 'Mr. Silva',
    description: 'Annual cultural reunion featuring live musical performances, food vendors, and alumni reunions.'
  }
];

export const EventsPage = {
  events: [],

  render() {
    const currentUser = auth.getUser();
    const currentRole = currentUser?.role;

    const canCreateEvent = [
      'ADMIN',
      'OPERATIONS_MANAGER',
      'EVENT_COORDINATOR'
    ].includes(currentRole);

    return `
      <div class="animate-fade-in">

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">

          <div>
            <h1 style="font-size: 26px; margin-bottom: 4px;">Events Workspace</h1>
            <p style="color: var(--text-muted); font-size: 14px;">
              Plan, coordinate venues, estimate budgets, and manage attendees
            </p>
          </div>

          ${
        canCreateEvent
            ? `
                <button id="create-event-btn" class="btn btn-primary">
                  <svg width="18" height="18" viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  <span>Create New Event</span>
                </button>
              `
            : ''
    }

        </div>

        <!-- Filter Controls -->
        <div
          class="glass-panel"
          style="padding: 16px 20px; margin-bottom: 24px; display: flex; gap: 16px; flex-wrap: wrap;"
        >

          <div class="input-with-icon" style="flex: 1; min-width: 240px;">

            <span class="input-icon">
              <svg width="18" height="18" viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>

            <input
              type="text"
              id="event-search-input"
              class="form-control"
              placeholder="Search events by title, venue, or coordinator..."
            />

          </div>

          <div style="width: 180px;">

            <select id="event-status-filter" class="form-control">
              <option value="">All Statuses</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Planning">Planning</option>
              <option value="In Review">In Review</option>
            </select>

          </div>

        </div>

        <!-- Event Cards Grid -->
        <div
          style="display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 24px;"
          id="events-grid"
        >
          <!-- Dynamically Injected -->
        </div>

      </div>
    `;
  },

  attachEvents() {
    this.loadEvents();

    document
        .getElementById('event-search-input')
        ?.addEventListener('input', () => this.filterAndRender());

    document
        .getElementById('event-status-filter')
        ?.addEventListener('change', () => this.filterAndRender());

    const createButton = document.getElementById('create-event-btn');

    if (createButton) {
      createButton.addEventListener('click', () => this.openCreateModal());
    }
  },

  loadEvents() {
    const saved = localStorage.getItem('planned_events');

    if (saved) {
      try {
        this.events = JSON.parse(saved);
      } catch {
        this.events = DEFAULT_EVENTS;
      }
    } else {
      this.events = DEFAULT_EVENTS;
      localStorage.setItem(
          'planned_events',
          JSON.stringify(DEFAULT_EVENTS)
      );
    }

    this.filterAndRender();
  },

  filterAndRender() {
    const query =
        document
            .getElementById('event-search-input')
            ?.value
            .toLowerCase() || '';

    const statusFilter =
        document.getElementById('event-status-filter')?.value || '';

    const filtered = this.events.filter(e => {

      const matches =
          e.title.toLowerCase().includes(query) ||
          e.venue.toLowerCase().includes(query) ||
          (e.coordinator &&
              e.coordinator.toLowerCase().includes(query));

      const statusMatch =
          statusFilter ? e.status === statusFilter : true;

      return matches && statusMatch;
    });

    const grid = document.getElementById('events-grid');

    if (!grid) return;

    if (filtered.length === 0) {

      grid.innerHTML = `
        <div
          style="grid-column: 1/-1; text-align: center; padding: 60px; color: var(--text-dim);"
        >
          No events match your criteria.
        </div>
      `;

      return;
    }

    const currentUser = auth.getUser();
    const currentRole = currentUser?.role;

    const canRemoveEvent = [
      'ADMIN',
      'OPERATIONS_MANAGER'
    ].includes(currentRole);

    grid.innerHTML = filtered.map(ev => `

      <div
        class="glass-panel"
        style="
          padding: 24px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: all var(--transition-normal);
          border-top: 3px solid var(--primary);
        "
      >

        <div>

          <div
            style="
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 12px;
              gap: 10px;
            "
          >

            <span
              class="badge ${
        ev.status === 'Confirmed'
            ? 'badge-FINANCE_OFFICER'
            : ev.status === 'Planning'
                ? 'badge-EVENT_COORDINATOR'
                : 'badge-OPERATIONS_MANAGER'
    }"
            >
              <span class="badge-dot"></span>
              ${ev.status}
            </span>

            <span
              style="font-size: 12px; color: var(--text-dim);"
            >
              ${ev.category}
            </span>

          </div>

          <h3
            style="
              font-size: 18px;
              margin-bottom: 8px;
              line-height: 1.3;
            "
          >
            ${ev.title}
          </h3>

          <p
            style="
              color: var(--text-muted);
              font-size: 13px;
              line-height: 1.5;
              margin-bottom: 20px;
            "
          >
            ${ev.description}
          </p>

          <div
            style="
              display: flex;
              flex-direction: column;
              gap: 8px;
              margin-bottom: 20px;
              font-size: 13px;
              color: var(--text-muted);
            "
          >

            <div
              style="
                display: flex;
                align-items: center;
                gap: 8px;
              "
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <rect
                  x="3"
                  y="4"
                  width="18"
                  height="18"
                  rx="2"
                  ry="2"
                ></rect>
                <line
                  x1="16"
                  y1="2"
                  x2="16"
                  y2="6"
                ></line>
                <line
                  x1="8"
                  y1="2"
                  x2="8"
                  y2="6"
                ></line>
              </svg>

              <span>${ev.date} at ${ev.time}</span>
            </div>

            <div
              style="
                display: flex;
                align-items: center;
                gap: 8px;
              "
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
                ></path>
                <circle
                  cx="12"
                  cy="10"
                  r="3"
                ></circle>
              </svg>

              <span>${ev.venue}</span>
            </div>

            <div
              style="
                display: flex;
                align-items: center;
                gap: 8px;
              "
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
                ></path>
                <circle
                  cx="9"
                  cy="7"
                  r="4"
                ></circle>
              </svg>

              <span>
                ${ev.expectedAttendees} Attendees • Budget: ${ev.budget}
              </span>
            </div>

          </div>

        </div>

        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 16px;
            border-top: 1px solid var(--border-subtle);
          "
        >

          <span
            style="
              font-size: 12px;
              color: var(--text-dim);
            "
          >
            Lead:
            <strong style="color: var(--text-main);">
              ${ev.coordinator}
            </strong>
          </span>

          ${
        canRemoveEvent
            ? `
                <button
                  class="btn btn-danger btn-sm delete-ev-btn"
                  data-id="${ev.id}"
                >
                  Remove
                </button>
              `
            : ''
    }

        </div>

      </div>

    `).join('');

    grid.querySelectorAll('.delete-ev-btn').forEach(btn => {

      btn.addEventListener('click', () => {

        const id = parseInt(
            btn.getAttribute('data-id')
        );

        this.events = this.events.filter(
            e => e.id !== id
        );

        localStorage.setItem(
            'planned_events',
            JSON.stringify(this.events)
        );

        toast.success(
            'Event removed from schedule'
        );

        this.filterAndRender();
      });

    });
  },

  openCreateModal() {

    const currentUser = auth.getUser();

    const allowedRoles = [
      'ADMIN',
      'OPERATIONS_MANAGER',
      'EVENT_COORDINATOR'
    ];

    if (!currentUser || !allowedRoles.includes(currentUser.role)) {
      toast.error(
          'You do not have permission to create events.'
      );
      return;
    }

    modal.open({

      title: 'Plan a New Event',

      bodyHtml: `

        <form id="create-event-form">

          <div class="form-group">

            <label
              class="form-label"
              for="ev-title"
            >
              Event Title
            </label>

            <input
              type="text"
              id="ev-title"
              class="form-control"
              placeholder="e.g. SLIIT Tech Nexus 2026"
              required
            />

          </div>

          <div
            style="
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 16px;
            "
          >

            <div class="form-group">

              <label
                class="form-label"
                for="ev-category"
              >
                Category
              </label>

              <select
                id="ev-category"
                class="form-control"
              >
                <option value="Academic & Tech">
                  Academic & Tech
                </option>

                <option value="Corporate">
                  Corporate
                </option>

                <option value="Social & Cultural">
                  Social & Cultural
                </option>

                <option value="Competition">
                  Competition / Hackathon
                </option>

                <option value="Workshop">
                  Workshop
                </option>
              </select>

            </div>

            <div class="form-group">

              <label
                class="form-label"
                for="ev-status"
              >
                Initial Status
              </label>

              <select
                id="ev-status"
                class="form-control"
              >
                <option value="Planning">
                  Planning
                </option>

                <option value="In Review">
                  In Review
                </option>

                <option value="Confirmed">
                  Confirmed
                </option>
              </select>

            </div>

          </div>

          <div
            style="
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 16px;
            "
          >

            <div class="form-group">

              <label
                class="form-label"
                for="ev-date"
              >
                Event Date
              </label>

              <input
                type="date"
                id="ev-date"
                class="form-control"
                required
              />

            </div>

            <div class="form-group">

              <label
                class="form-label"
                for="ev-time"
              >
                Start Time
              </label>

              <input
                type="time"
                id="ev-time"
                class="form-control"
                value="09:00"
                required
              />

            </div>

          </div>

          <div class="form-group">

            <label
              class="form-label"
              for="ev-venue"
            >
              Venue / Location
            </label>

            <input
              type="text"
              id="ev-venue"
              class="form-control"
              placeholder="e.g. Main Auditorium"
              required
            />

          </div>

          <div
            style="
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 16px;
            "
          >

            <div class="form-group">

              <label
                class="form-label"
                for="ev-attendees"
              >
                Expected Attendees
              </label>

              <input
                type="number"
                id="ev-attendees"
                class="form-control"
                placeholder="250"
                required
              />

            </div>

            <div class="form-group">

              <label
                class="form-label"
                for="ev-budget"
              >
                Budget ($)
              </label>

              <input
                type="text"
                id="ev-budget"
                class="form-control"
                placeholder="$5,000"
                required
              />

            </div>

          </div>

          <div class="form-group">

            <label
              class="form-label"
              for="ev-desc"
            >
              Event Summary
            </label>

            <textarea
              id="ev-desc"
              class="form-control"
              rows="3"
              placeholder="Brief outline of the event objectives and requirements..."
            ></textarea>

          </div>

        </form>

      `,

      footerHtml: `

        <button
          class="btn btn-secondary"
          onclick="window.closeModal()"
        >
          Cancel
        </button>

        <button
          class="btn btn-primary"
          id="save-new-ev-btn"
        >
          Save & Publish
        </button>

      `
    });

    window.closeModal = () => modal.close();

    document
        .getElementById('save-new-ev-btn')
        .addEventListener('click', () => {

          const title =
              document
                  .getElementById('ev-title')
                  .value
                  .trim();

          const venue =
              document
                  .getElementById('ev-venue')
                  .value
                  .trim();

          const date =
              document
                  .getElementById('ev-date')
                  .value;

          if (!title || !venue || !date) {

            toast.warning(
                'Please enter the event title, venue, and date.'
            );

            return;
          }

          const newEv = {

            id: Date.now(),

            title,

            category:
            document
                .getElementById('ev-category')
                .value,

            status:
            document
                .getElementById('ev-status')
                .value,

            date,

            time:
            document
                .getElementById('ev-time')
                .value,

            venue,

            expectedAttendees:
                parseInt(
                    document
                        .getElementById('ev-attendees')
                        .value
                ) || 100,

            budget:
                document
                    .getElementById('ev-budget')
                    .value || '$3,000',

            coordinator:
                currentUser.name || 'You (Organizer)',

            description:
                document
                    .getElementById('ev-desc')
                    .value
                    .trim() ||
                'No description provided.'
          };

          this.events.unshift(newEv);

          localStorage.setItem(
              'planned_events',
              JSON.stringify(this.events)
          );

          toast.success(
              `Event "${title}" created!`
          );

          modal.close();

          this.filterAndRender();
        });
  }
};