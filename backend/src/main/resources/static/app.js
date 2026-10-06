const VENDOR_ID = 1; // Hardcoded for this demo
const API_BASE = '/api/vendor';

// DOM Elements
const addServiceForm = document.getElementById('addServiceForm');
const addAvailabilityForm = document.getElementById('addAvailabilityForm');
const servicesContainer = document.getElementById('servicesContainer');
const refreshServicesBtn = document.getElementById('refreshServicesBtn');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');
const toastIcon = document.getElementById('toastIcon');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchServices();
    
    // Set min date for availability to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('slotDate').min = today;
});

// Create Service
addServiceForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const btn = document.getElementById('addServiceBtn');
    const btnText = btn.querySelector('.btn-text');
    const loader = btn.querySelector('.loader');
    
    // UI Loading state
    btnText.style.display = 'none';
    loader.style.display = 'block';
    btn.disabled = true;

    const payload = {
        vendorId: VENDOR_ID,
        name: document.getElementById('serviceName').value,
        category: document.getElementById('category').value,
        capacity: parseInt(document.getElementById('capacity').value),
        description: document.getElementById('description').value,
        price: parseFloat(document.getElementById('price').value)
    };

    try {
        const response = await fetch(`${API_BASE}/services`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error('Failed to create service');
        
        showToast('Service created successfully!', '✨');
        addServiceForm.reset();
        fetchServices(); // Refresh list
    } catch (error) {
        showToast(error.message, '❌');
    } finally {
        btnText.style.display = 'block';
        loader.style.display = 'none';
        btn.disabled = false;
    }
});

// Add Availability
addAvailabilityForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const btn = document.getElementById('addAvailabilityBtn');
    const btnText = btn.querySelector('.btn-text');
    const loader = btn.querySelector('.loader');
    
    btnText.style.display = 'none';
    loader.style.display = 'block';
    btn.disabled = true;

    const payload = {
        vendorId: VENDOR_ID,
        slotDate: document.getElementById('slotDate').value,
        startTime: document.getElementById('startTime').value + ':00', // API expects HH:mm:ss
        endTime: document.getElementById('endTime').value + ':00',
        blocked: document.getElementById('blocked').checked
    };

    try {
        const response = await fetch(`${API_BASE}/availability`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error('Failed to save availability');
        
        showToast('Availability saved!', '📅');
        addAvailabilityForm.reset();
    } catch (error) {
        showToast(error.message, '❌');
    } finally {
        btnText.style.display = 'block';
        loader.style.display = 'none';
        btn.disabled = false;
    }
});

// Fetch Services
async function fetchServices() {
    servicesContainer.innerHTML = `
        <div class="loading-state">
            <div class="spinner"></div>
            <p>Fetching your amazing services...</p>
        </div>
    `;

    try {
        const response = await fetch(`${API_BASE}/${VENDOR_ID}/services`);
        if (!response.ok) throw new Error('Failed to fetch services');
        
        const services = await response.json();
        
        if (services.length === 0) {
            servicesContainer.innerHTML = `
                <div class="loading-state" style="border: 1px dashed rgba(255,255,255,0.1); border-radius: 15px;">
                    <p style="font-size: 1.2rem; margin-bottom: 0.5rem">No services yet.</p>
                    <p style="font-size: 0.9rem">Create your first service above!</p>
                </div>
            `;
            return;
        }

        servicesContainer.innerHTML = services.reverse().map(service => `
            <div class="service-card">
                <div class="service-header">
                    <h3 class="service-title">${service.name}</h3>
                    <span class="badge">${service.category}</span>
                </div>
                <p class="service-desc">${service.description || 'No description provided.'}</p>
                <div class="service-footer">
                    <div class="service-capacity">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                        Up to ${service.capacity}
                    </div>
                    <div class="service-price">Rs. ${service.price.toLocaleString()}</div>
                </div>
            </div>
        `).join('');

    } catch (error) {
        servicesContainer.innerHTML = `
            <div class="loading-state" style="color: var(--danger)">
                <p>⚠️ Error loading services</p>
                <p style="font-size: 0.8rem; margin-top: 0.5rem">${error.message}</p>
            </div>
        `;
    }
}

refreshServicesBtn.addEventListener('click', fetchServices);

// Toast Notification System
let toastTimeout;
function showToast(message, icon = '✨') {
    toastMessage.textContent = message;
    toastIcon.textContent = icon;
    
    toast.classList.add('show');
    
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
