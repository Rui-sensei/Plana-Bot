const MONTH_NAMES = [
    '', 'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

// Login
async function login() {
    const password = document.getElementById('passwordInput').value;
    const errorEl = document.getElementById('loginError');
    
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });
        
        if (response.ok) {
            document.getElementById('loginScreen').style.display = 'none';
            document.getElementById('dashboardScreen').style.display = 'block';
            loadDashboard();
        } else {
            errorEl.textContent = 'Invalid password';
        }
    } catch (error) {
        errorEl.textContent = 'Connection error';
    }
}

// Logout
async function logout() {
    await fetch('/api/logout', { method: 'POST' });
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('dashboardScreen').style.display = 'none';
    document.getElementById('passwordInput').value = '';
}

// Load dashboard data
async function loadDashboard() {
    loadMongoDBStats();
    loadBirthdayStats();
    loadServerStats();
    loadRenderHealth();
}

// MongoDB Stats
async function loadMongoDBStats() {
    try {
        const response = await fetch('/api/mongodb/stats');
        const data = await response.json();
        
        // Primary Database
        const primaryEl = document.getElementById('primaryStatus');
        if (data.primary && data.primary.connected) {
            primaryEl.innerHTML = `
                <div class="status-connected">✅ Connected</div>
                <div class="status-info">
                    Data: ${formatBytes(data.primary.dataSize)}<br>
                    Objects: ${data.primary.objects.toLocaleString()}<br>
                    Collections: ${data.primary.collections}
                </div>
            `;
            
            // Storage progress
            const used = data.primary.totalSize;
            const total = 512 * 1024 * 1024; // 512 MB
            const percentage = (used / total * 100).toFixed(2);
            
            const progressEl = document.getElementById('primaryProgress');
            progressEl.style.width = percentage + '%';
            progressEl.textContent = percentage + '%';
            
            if (percentage > 80) progressEl.classList.add('progress-fill-danger');
            else if (percentage > 60) progressEl.classList.add('progress-fill-warning');
            
            document.getElementById('primaryStorageText').textContent = 
                `${formatBytes(used)} / ${formatBytes(total)} (${percentage}%)`;
        } else {
            primaryEl.innerHTML = '<div class="status-disconnected">❌ Not Connected</div>';
            document.getElementById('primaryProgress').style.width = '0%';
            document.getElementById('primaryStorageText').textContent = 'Not available';
        }
        
        // Secondary Database
        const secondaryEl = document.getElementById('secondaryStatus');
        if (data.secondary && data.secondary.connected) {
            secondaryEl.innerHTML = `
                <div class="status-connected">✅ Connected</div>
                <div class="status-info">
                    Data: ${formatBytes(data.secondary.dataSize)}<br>
                    Objects: ${data.secondary.objects.toLocaleString()}<br>
                    Collections: ${data.secondary.collections}
                </div>
            `;
            
            const used = data.secondary.totalSize;
            const total = 512 * 1024 * 1024;
            const percentage = (used / total * 100).toFixed(2);
            
            const progressEl = document.getElementById('secondaryProgress');
            progressEl.style.width = percentage + '%';
            progressEl.textContent = percentage + '%';
            
            if (percentage > 80) progressEl.classList.add('progress-fill-danger');
            else if (percentage > 60) progressEl.classList.add('progress-fill-warning');
            
            document.getElementById('secondaryStorageText').textContent = 
                `${formatBytes(used)} / ${formatBytes(total)} (${percentage}%)`;
        } else {
            secondaryEl.innerHTML = '<div class="status-disconnected">❌ Not Connected</div>';
            document.getElementById('secondaryProgress').style.width = '0%';
            document.getElementById('secondaryStorageText').textContent = 'Not available';
        }
        
    } catch (error) {
        console.error('Error loading MongoDB stats:', error);
        document.getElementById('primaryStatus').innerHTML = 
            '<div class="status-disconnected">❌ Error loading</div>';
        document.getElementById('secondaryStatus').innerHTML = 
            '<div class="status-disconnected">❌ Error loading</div>';
    }
}

// Birthday Stats
async function loadBirthdayStats() {
    try {
        const response = await fetch('/api/birthdays/stats');
        const data = await response.json();
        
        const statsEl = document.getElementById('birthdayStats');
        statsEl.innerHTML = `
            <div class="status-info">
                Total Birthdays: <strong>${data.total.toLocaleString()}</strong><br>
                Upcoming (7 days): <strong>${data.upcoming.length}</strong>
            </div>
        `;
        
        // Display upcoming birthdays
        const upcomingEl = document.getElementById('upcomingBirthdays');
        if (data.upcoming.length === 0) {
            upcomingEl.innerHTML = '<p class="loading">No upcoming birthdays in the next 7 days</p>';
        } else {
            upcomingEl.innerHTML = '<div class="birthday-list">' +
                data.upcoming.map(b => {
                    const daysUntil = getDaysUntil(b.month, b.day);
                    const daysText = daysUntil === 0 ? 'Today!' : 
                                     daysUntil === 1 ? 'Tomorrow' : 
                                     `in ${daysUntil} days`;
                    return `
                        <div class="birthday-item">
                            <div>
                                <div class="user-id">${b.userId}</div>
                                <div class="birthday-date">${MONTH_NAMES[b.month]} ${b.day}</div>
                            </div>
                            <div class="days-until">${daysText}</div>
                        </div>
                    `;
                }).join('') +
                '</div>';
        }
    } catch (error) {
        console.error('Error loading birthday stats:', error);
        document.getElementById('birthdayStats').innerHTML = 
            '<div class="status-disconnected">Error loading</div>';
    }
}

// Server Stats
async function loadServerStats() {
    try {
        const response = await fetch('/api/servers/stats');
        const data = await response.json();
        
        // This will be displayed in a separate section if needed
        console.log('Server stats:', data);
    } catch (error) {
        console.error('Error loading server stats:', error);
    }
}

// Render Health
async function loadRenderHealth() {
    try {
        const response = await fetch('/api/render/health');
        const data = await response.json();
        
        const statusEl = document.getElementById('renderStatus');
        const healthEl = document.getElementById('botHealth');
        
        const statusClass = data.status === 'healthy' ? 'status-connected' : 
                           data.status === 'degraded' ? 'status-info' : 
                           'status-disconnected';
        const statusIcon = data.status === 'healthy' ? '✅' : '⚠️';
        
        statusEl.innerHTML = `
            <div class="${statusClass}">${statusIcon} ${data.status.toUpperCase()}</div>
            <div class="status-info">
                Uptime: ${formatUptime(data.uptime)}<br>
                Primary DB: ${data.primaryDB ? '✅' : '❌'}<br>
                Secondary DB: ${data.secondaryDB ? '✅' : '❌'}
            </div>
        `;
        
        healthEl.innerHTML = `
            <div class="health-grid">
                <div class="health-item">
                    <strong>Status</strong>
                    ${data.status.toUpperCase()}
                </div>
                <div class="health-item">
                    <strong>Uptime</strong>
                    ${formatUptime(data.uptime)}
                </div>
                <div class="health-item">
                    <strong>Memory (RSS)</strong>
                    ${formatBytes(data.memory.rss)}
                </div>
                <div class="health-item">
                    <strong>Heap Used</strong>
                    ${formatBytes(data.memory.heapUsed)}
                </div>
                <div class="health-item">
                    <strong>Primary DB</strong>
                    ${data.primaryDB ? '✅ Connected' : '❌ Disconnected'}
                </div>
                <div class="health-item">
                    <strong>Secondary DB</strong>
                    ${data.secondaryDB ? '✅ Connected' : '⚠️ Not Available'}
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error loading Render health:', error);
        document.getElementById('renderStatus').innerHTML = 
            '<div class="status-disconnected">❌ Error loading</div>';
    }
}

// Helper Functions
function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

function formatUptime(seconds) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
}

function getDaysUntil(month, day) {
    const now = new Date();
    const currentYear = now.getFullYear();
    
    let birthday = new Date(currentYear, month - 1, day);
    
    if (birthday < now) {
        birthday = new Date(currentYear + 1, month - 1, day);
    }
    
    const diffTime = birthday - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
}

// Auto-refresh every 30 seconds
setInterval(loadDashboard, 30000);

// Handle Enter key on password input
document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('passwordInput');
    if (passwordInput) {
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') login();
        });
    }
});
