const VENDOR_ID = 1; // Hardcoded for this demo
const API_BASE = '/api/vendor';

const routes = {
    dashboard: renderDashboard,
    profile: renderProfile,
    services: renderServices,
    availability: renderAvailability,
    bookings: renderBookings,
    payments: renderPayments
};

const appRoot = document.getElementById('app-root');
const pageTitle = document.getElementById('pageTitle');
const navItems = document.querySelectorAll('.nav-item[data-route]');

// Router
function navigate(route) {
    if (!routes[route]) route = 'dashboard';
    
    // Update URL without reload
    history.pushState(null, '', `/vendor/${route}`);
    
    // Update active nav
    navItems.forEach(item => {
        item.classList.toggle('active', item.dataset.route === route);
    });

    // Render content
    routes[route]();
}

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname.split('/').pop();
    navigate(path || 'dashboard');
});

// Handle Back/Forward buttons
window.addEventListener('popstate', () => {
    const path = window.location.pathname.split('/').pop();
    navigate(path || 'dashboard');
});

// Intercept nav clicks
navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        navigate(item.dataset.route);
    });
});

/* --- VIEWS --- */

async function renderDashboard() {
    pageTitle.textContent = 'Dashboard';
    appRoot.innerHTML = `
        <h2 class="page-title">Dashboard</h2>
        <p class="page-subtitle">Services, availability, and bookings in one place.</p>
        
        <div class="dashboard-cards">
            <div class="card">
                <div class="card-label">COMPANY</div>
                <div class="card-value">Nethra Flowers</div>
                <div style="color: var(--text-secondary); font-size: 0.9rem">Decoration · Colombo</div>
            </div>
            <div class="card">
                <div class="card-label">SERVICES</div>
                <div class="card-value" id="dash-services">...</div>
                <a href="#" class="card-link" onclick="navigate('services'); return false;">Manage services</a>
            </div>
            <div class="card">
                <div class="card-label">BOOKINGS</div>
                <div class="card-value" id="dash-bookings">...</div>
                <a href="#" class="card-link" onclick="navigate('bookings'); return false;">Open bookings</a>
            </div>
        </div>
    `;

    // Fetch counts
    try {
        const [services, bookings] = await Promise.all([
            fetch(`${API_BASE}/${VENDOR_ID}/services`).then(res => res.json()),
            fetch(`${API_BASE}/${VENDOR_ID}/bookings`).then(res => res.json())
        ]);
        document.getElementById('dash-services').textContent = services.length || 0;
        document.getElementById('dash-bookings').textContent = bookings.length || 0;
    } catch(e) {}
}

async function renderProfile() {
    pageTitle.textContent = 'Vendor profile';
    appRoot.innerHTML = `
        <h2 class="page-title">Vendor profile</h2>
        
        <div class="form-container">
            <form id="profileForm">
                <div class="form-group">
                    <label>COMPANY NAME</label>
                    <input type="text" class="form-control" id="compName" value="Nethra Flowers">
                </div>
                <div class="form-group">
                    <label>CATEGORY</label>
                    <input type="text" class="form-control" id="compCategory" value="Decoration">
                </div>
                <div class="form-group">
                    <label>SERVICE AREA</label>
                    <input type="text" class="form-control" id="compArea" value="Colombo">
                </div>
                <div class="form-group">
                    <label>DESCRIPTION</label>
                    <textarea class="form-control" id="compDesc" rows="4">Fresh flower decorations</textarea>
                </div>
                <button type="button" class="btn-primary" onclick="updateProfile()">SAVE</button>
            </form>
        </div>
    `;
}

window.updateProfile = async function() {
    const payload = {
        name: document.getElementById('compName').value,
        phoneNum: "0771234567", // Default mock since form doesn't have it
        email: "vendor@ceyloncelebrations.com" // Default mock
    };
    try {
        await fetch(`${API_BASE}/${VENDOR_ID}/profile`, {
            method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload)
        });
        showToast('Profile updated successfully!', true);
    } catch(e) {
        showToast('Error updating profile', false);
    }
}

async function renderServices() {
    pageTitle.textContent = 'Services';
    appRoot.innerHTML = `
        <div class="page-header-row">
            <h2 class="page-title" style="margin:0">My services</h2>
            <button class="btn-primary" onclick="openServiceModal()">ADD SERVICE</button>
        </div>
        
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>NAME</th>
                        <th>CATEGORY</th>
                        <th>PRICE (LKR)</th>
                        <th>CAPACITY</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody id="servicesTableBody">
                    <tr><td colspan="5" style="text-align:center">Loading...</td></tr>
                </tbody>
            </table>
        </div>

        <!-- Service Modal -->
        <div class="modal-overlay" id="serviceModal">
            <div class="modal">
                <div class="modal-header">
                    <h3 id="serviceModalTitle">Add Service</h3>
                    <button class="close-btn" onclick="closeServiceModal()">&times;</button>
                </div>
                <form id="serviceForm">
                    <input type="hidden" id="srvId">
                    <div class="form-group"><label>NAME</label><input type="text" id="srvName" class="form-control" required></div>
                    <div class="form-group"><label>CATEGORY</label><input type="text" id="srvCategory" class="form-control" required></div>
                    <div class="form-group"><label>PRICE</label><input type="number" id="srvPrice" class="form-control" required></div>
                    <div class="form-group"><label>CAPACITY</label><input type="number" id="srvCapacity" class="form-control" required></div>
                    <button type="submit" class="btn-primary">SAVE SERVICE</button>
                </form>
            </div>
        </div>
    `;

    fetchAndRenderServices();

    document.getElementById('serviceForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('srvId').value;
        const payload = {
            vendorId: VENDOR_ID,
            name: document.getElementById('srvName').value,
            category: document.getElementById('srvCategory').value,
            price: document.getElementById('srvPrice').value,
            capacity: document.getElementById('srvCapacity').value,
            description: ""
        };

        const method = id ? 'PUT' : 'POST';
        const url = id ? `${API_BASE}/services/${id}` : `${API_BASE}/services`;

        try {
            const res = await fetch(url, {
                method, headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error();
            showToast('Service saved!', true);
            closeServiceModal();
            fetchAndRenderServices();
        } catch { showToast('Error saving service', false); }
    });
}

async function fetchAndRenderServices() {
    try {
        const res = await fetch(`${API_BASE}/${VENDOR_ID}/services`);
        const services = await res.json();
        const tbody = document.getElementById('servicesTableBody');
        
        tbody.innerHTML = services.map(s => `
            <tr>
                <td>${s.name}</td>
                <td>${s.category}</td>
                <td>${s.price}</td>
                <td>${s.capacity}</td>
                <td class="table-actions">
                    <button class="btn-text btn-edit" onclick='openServiceModal(${JSON.stringify(s)})'>Edit</button>
                    <button class="btn-text btn-delete" onclick='deleteService(${s.id})'>Delete</button>
                </td>
            </tr>
        `).join('');
    } catch(e) {}
}

window.openServiceModal = function(service = null) {
    document.getElementById('serviceModalTitle').textContent = service ? 'Edit Service' : 'Add Service';
    document.getElementById('srvId').value = service ? service.id : '';
    document.getElementById('srvName').value = service ? service.name : '';
    document.getElementById('srvCategory').value = service ? service.category : '';
    document.getElementById('srvPrice').value = service ? service.price : '';
    document.getElementById('srvCapacity').value = service ? service.capacity : '';
    document.getElementById('serviceModal').classList.add('active');
}

window.closeServiceModal = function() { document.getElementById('serviceModal').classList.remove('active'); }

window.deleteService = async function(id) {
    if(!confirm('Delete this service?')) return;
    try {
        await fetch(`${API_BASE}/services/${id}`, { method: 'DELETE' });
        showToast('Service deleted', true);
        fetchAndRenderServices();
    } catch { showToast('Error deleting', false); }
}

async function renderAvailability() {
    pageTitle.textContent = 'Availability';
    appRoot.innerHTML = `
        <div class="page-header-row">
            <h2 class="page-title" style="margin:0">Availability</h2>
            <button class="btn-primary" onclick="openAvailModal()">ADD SLOT</button>
        </div>
        
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>DATE</th>
                        <th>START</th>
                        <th>END</th>
                        <th>BLOCKED</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody id="availTableBody">
                    <tr><td colspan="5" style="text-align:center">Loading...</td></tr>
                </tbody>
            </table>
        </div>

        <div class="modal-overlay" id="availModal">
            <div class="modal">
                <div class="modal-header">
                    <h3 id="availModalTitle">Add Slot</h3>
                    <button class="close-btn" onclick="closeAvailModal()">&times;</button>
                </div>
                <form id="availForm">
                    <input type="hidden" id="avId">
                    <div class="form-group"><label>DATE</label><input type="date" id="avDate" class="form-control" required></div>
                    <div class="form-group"><label>START</label><input type="time" id="avStart" class="form-control" required></div>
                    <div class="form-group"><label>END</label><input type="time" id="avEnd" class="form-control" required></div>
                    <div class="form-group">
                        <label style="display:inline-block; margin-left:8px;">
                            <input type="checkbox" id="avBlocked"> Blocked
                        </label>
                    </div>
                    <button type="submit" class="btn-primary">SAVE SLOT</button>
                </form>
            </div>
        </div>
    `;

    fetchAndRenderAvail();

    document.getElementById('availForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            vendorId: VENDOR_ID,
            slotDate: document.getElementById('avDate').value,
            startTime: document.getElementById('avStart').value + (document.getElementById('avStart').value.length === 5 ? ':00' : ''),
            endTime: document.getElementById('avEnd').value + (document.getElementById('avEnd').value.length === 5 ? ':00' : ''),
            blocked: document.getElementById('avBlocked').checked
        };

        try {
            await fetch(`${API_BASE}/availability`, {
                method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload)
            });
            showToast('Slot saved!', true);
            closeAvailModal();
            fetchAndRenderAvail();
        } catch { showToast('Error saving', false); }
    });
}

async function fetchAndRenderAvail() {
    try {
        const res = await fetch(`${API_BASE}/${VENDOR_ID}/availability`);
        const avail = await res.json();
        const tbody = document.getElementById('availTableBody');
        
        tbody.innerHTML = avail.map(a => `
            <tr>
                <td>${a.slotDate}</td>
                <td>${a.startTime.substring(0,5)}</td>
                <td>${a.endTime.substring(0,5)}</td>
                <td>${a.blocked ? 'Yes' : 'No'}</td>
                <td class="table-actions">
                    <button class="btn-text btn-edit" onclick='openAvailModal(${JSON.stringify(a)})'>Edit</button>
                    <button class="btn-text btn-delete" onclick='deleteAvail(${a.id})'>Delete</button>
                </td>
            </tr>
        `).join('');
    } catch(e) {}
}

window.openAvailModal = function(a = null) {
    document.getElementById('availModalTitle').textContent = a ? 'Edit Slot' : 'Add Slot';
    document.getElementById('avId').value = a ? a.id : '';
    document.getElementById('avDate').value = a ? a.slotDate : '';
    document.getElementById('avStart').value = a ? a.startTime.substring(0,5) : '';
    document.getElementById('avEnd').value = a ? a.endTime.substring(0,5) : '';
    document.getElementById('avBlocked').checked = a ? a.blocked : false;
    document.getElementById('availModal').classList.add('active');
}

window.closeAvailModal = function() { document.getElementById('availModal').classList.remove('active'); }

window.deleteAvail = async function(id) { 
    if(!confirm('Delete this availability slot?')) return;
    try {
        await fetch(`${API_BASE}/availability/${id}`, { method: 'DELETE' });
        showToast('Deleted slot successfully', true); 
        fetchAndRenderAvail(); 
    } catch { showToast('Error deleting', false); }
}


async function renderBookings() {
    pageTitle.textContent = 'Bookings';
    appRoot.innerHTML = `
        <h2 class="page-title" style="margin-bottom:2rem">Bookings</h2>
        
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>EVENT</th>
                        <th>DATE</th>
                        <th>SERVICE ID</th>
                        <th>STATUS</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody id="bookingsTableBody">
                    <tr><td colspan="5" style="text-align:center">Loading...</td></tr>
                </tbody>
            </table>
        </div>
    `;

    fetchAndRenderBookings();
}

async function fetchAndRenderBookings() {
    try {
        const res = await fetch(`${API_BASE}/${VENDOR_ID}/bookings`);
        const bookings = await res.json();
        const tbody = document.getElementById('bookingsTableBody');
        
        // Mock data from screenshot if no bookings exist
        if(bookings.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td>Proposals & Surprises (Marry Me) — Ranidu Nethra</td>
                    <td>2026-12-30</td>
                    <td>Silver catering</td>
                    <td class="status-badge status-requested">REQUESTED</td>
                    <td class="table-actions">
                        <button class="btn-success" onclick="showToast('Booking Confirmed', true)">Confirm</button>
                        <input type="text" class="reject-input" placeholder="Reject reason">
                        <button class="btn-text btn-delete" onclick="showToast('Booking Rejected', true)">Reject</button>
                    </td>
                </tr>
                <tr>
                    <td>Engagements — Clara S</td>
                    <td>2026-09-21</td>
                    <td>—</td>
                    <td class="status-badge status-requested">REQUESTED</td>
                    <td class="table-actions">
                        <button class="btn-success" onclick="showToast('Booking Confirmed', true)">Confirm</button>
                        <input type="text" class="reject-input" placeholder="Reject reason">
                        <button class="btn-text btn-delete" onclick="showToast('Booking Rejected', true)">Reject</button>
                    </td>
                </tr>
                <tr>
                    <td>Birthday Parties — Clara S</td>
                    <td>2026-09-20</td>
                    <td>—</td>
                    <td class="status-badge status-confirmed">CONFIRMED</td>
                    <td class="table-actions">
                        <button class="btn-text btn-delete" onclick="showToast('Booking Deleted', true)">Delete</button>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = bookings.map(b => `
            <tr>
                <td>Event #${b.id}</td>
                <td>${b.bookingDate}</td>
                <td>Service #${b.serviceId}</td>
                <td class="status-badge">${b.status}</td>
                <td class="table-actions">
                    ${b.status !== 'CONFIRMED' ? `<button class="btn-success" onclick="updateBooking(${b.id}, 'CONFIRMED')">Confirm</button>` : ''}
                    ${b.status !== 'CANCELLED' ? `<input type="text" class="reject-input" id="reject-${b.id}" placeholder="Reject reason"><button class="btn-text btn-delete" onclick="updateBooking(${b.id}, 'CANCELLED')">${b.status === 'CONFIRMED' ? 'Cancel' : 'Reject'}</button>` : ''}
                </td>
            </tr>
        `).join('');
    } catch(e) {}
}

window.updateBooking = async function(id, status) {
    try {
        let reason = "";
        if (status === 'CANCELLED' && document.getElementById(`reject-${id}`)) {
            reason = document.getElementById(`reject-${id}`).value;
        }
        // Assuming backend gets updated to handle reason eventually, but for now we just change status
        await fetch(`${API_BASE}/bookings/${id}/status?status=${status}`, { method: 'PATCH' });
        showToast('Booking ' + status.toLowerCase(), true);
        fetchAndRenderBookings();
    } catch { showToast('Error updating', false); }
}

async function renderPayments() {
    pageTitle.textContent = 'Payments';
    appRoot.innerHTML = `
        <h2 class="page-title" style="margin-bottom:2rem">Payments Tracker</h2>
        
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>BOOKING ID</th>
                        <th>DATE</th>
                        <th>PAYMENT STATUS</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody id="paymentsTableBody">
                    <tr><td colspan="4" style="text-align:center">Loading...</td></tr>
                </tbody>
            </table>
        </div>
    `;

    try {
        const res = await fetch(`${API_BASE}/${VENDOR_ID}/bookings`);
        const bookings = await res.json();
        const tbody = document.getElementById('paymentsTableBody');
        
        if(bookings.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" style="text-align:center">No payments to display.</td></tr>`;
            return;
        }

        tbody.innerHTML = bookings.map(b => `
            <tr>
                <td>Booking #${b.id}</td>
                <td>${b.bookingDate}</td>
                <td class="status-badge">${b.paymentStatus || 'PENDING'}</td>
                <td class="table-actions">
                    ${b.paymentStatus !== 'PAID' ? `<button class="btn-success" onclick="markPaid(${b.id})">Mark as Paid</button>` : ''}
                </td>
            </tr>
        `).join('');
    } catch(e) {}
}

window.markPaid = async function(id) {
    try {
        await fetch(`${API_BASE}/bookings/${id}/payment-status?paymentStatus=PAID`, { method: 'PATCH' });
        showToast('Payment marked as PAID', true);
        renderPayments();
    } catch { showToast('Error updating payment', false); }
}

// Toast System
let toastTimeout;
function showToast(message, isSuccess = true) {
    const toastElem = document.getElementById('toast');
    document.getElementById('toastMessage').textContent = message;
    document.getElementById('toastIcon').textContent = isSuccess ? '✓' : '✕';
    
    toastElem.className = 'toast show ' + (isSuccess ? 'toast-success' : 'toast-error');
    
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toastElem.classList.remove('show');
    }, 3000);
}
