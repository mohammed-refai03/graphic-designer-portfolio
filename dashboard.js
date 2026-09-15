/* ==========================================================================
   STACKLY — GRAPHIC DESIGNER PORTFOLIO
   DASHBOARD ENGINE (CONTENT TOGGLING, CHARTS & INTERACTION)
   ========================================================================== */

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

document.addEventListener('DOMContentLoaded', () => {
  // 0. DYNAMIC USER PROFILE SYNC FROM LOGIN
  try {
    const storedEmail = localStorage.getItem('userEmail');
    const storedRole = localStorage.getItem('userRole');

    if (storedEmail) {
      const emailEls = document.querySelectorAll('.sidebar-user-email, .topbar-user-email, #profile-user-email, #admin-profile-user-email');
      emailEls.forEach(el => { el.textContent = storedEmail; });

      const initialChar = storedEmail.charAt(0).toUpperCase();
      if (initialChar) {
        const avatarEls = document.querySelectorAll('.sidebar-user-avatar.initial-avatar, .topbar-user-avatar.initial-avatar');
        avatarEls.forEach(el => { el.textContent = initialChar; });
      }
    }

    if (storedRole) {
      const roleEls = document.querySelectorAll('.sidebar-user-name, .topbar-user-name');
      roleEls.forEach(el => { el.textContent = storedRole; });
    }
  } catch (err) {
    console.warn('Unable to load user profile from LocalStorage:', err);
  }

  // 0.1 404 NAVIGATION FOR ALL DASHBOARD MAIN CONTENT BUTTONS & LINKS
  const bodyActionElements = document.querySelectorAll('.dashboard-body button, .dashboard-body a, .dashboard-body .tbl-action-btn');
  bodyActionElements.forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = '404.html';
    });
  });

  // Scroll to top on page refresh/reload
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

  // 1. MOBILE SIDEBAR DRAWER TOGGLE & CLOSE
  const sidebar = document.getElementById('dashboard-sidebar');
  const mobileToggle = document.getElementById('mobile-sidebar-toggle');
  const mobileClose = document.getElementById('mobile-sidebar-close');

  function openDashboardMobileSidebar() {
    if (sidebar) {
      sidebar.classList.add('active');
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    }
  }

  function closeDashboardMobileSidebar() {
    if (sidebar) {
      sidebar.classList.remove('active');
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
  }
  
  if (mobileToggle && sidebar) {
    mobileToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (sidebar.classList.contains('active')) {
        closeDashboardMobileSidebar();
      } else {
        openDashboardMobileSidebar();
      }
    });

    if (mobileClose) {
      mobileClose.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeDashboardMobileSidebar();
      });
    }

    // Close sidebar on click outside on mobile
    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 900 && sidebar.classList.contains('active')) {
        if (!sidebar.contains(e.target) && !mobileToggle.contains(e.target) && (!mobileClose || !mobileClose.contains(e.target))) {
          closeDashboardMobileSidebar();
        }
      }
    });
  }

  // 2. CONTENT TOGGLING SYSTEM (SIDEBAR TABS)
  const sidebarLinks = document.querySelectorAll('.sidebar-link[data-tab]');
  const tabContents = document.querySelectorAll('.dashboard-tab-content');
  const topbarTitle = document.getElementById('topbar-title');

  sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetTabId = link.getAttribute('data-tab');
      const tabTitle = link.getAttribute('data-title') || link.innerText.trim();

      // Update sidebar active link
      sidebarLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      // Update topbar title
      if (topbarTitle) {
        topbarTitle.textContent = tabTitle;
      }

      // Switch tab contents with smooth transition & reset content starting point
      tabContents.forEach(content => {
        if (content.id === targetTabId) {
          content.classList.add('active');
          content.scrollTop = 0;
        } else {
          content.classList.remove('active');
        }
      });

      // Reset scroll position of main dashboard container and window to starting point
      const mainContainers = document.querySelectorAll('.dashboard-main, .dashboard-body, .dashboard-wrapper');
      mainContainers.forEach(container => {
        container.scrollTop = 0;
      });
      window.scrollTo(0, 0);

      // Close mobile drawer if open and restore scrolling
      if (window.innerWidth <= 900 && sidebar) {
        closeDashboardMobileSidebar();
      }

      // Re-trigger chart render for the active view
      initTabCharts(targetTabId);
    });
  });

  // 3. CHART.JS INITIALIZATION & MANAGEMENT
  const chartsRegistry = {};

  function initTabCharts(tabId) {
    if (typeof Chart === 'undefined') return;

    // Default chart styling defaults for dark theme
    Chart.defaults.color = '#A0A0A0';
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.borderColor = 'rgba(38, 38, 38, 0.6)';

    // ADMIN OVERVIEW CHARTS
    if (tabId === 'tab-overview' && document.getElementById('chart-project-performance')) {
      renderChart('chart-project-performance', 'line', {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
        datasets: [
          {
            label: 'Portfolio Views (K)',
            data: [12, 19, 28, 35, 42, 68, 95, 128],
            borderColor: '#A855F7',
            backgroundColor: 'rgba(168, 85, 247, 0.15)',
            fill: true,
            tension: 0.4
          },
          {
            label: 'Client Inquiries',
            data: [4, 7, 12, 15, 18, 24, 32, 48],
            borderColor: '#C084FC',
            backgroundColor: 'rgba(192, 132, 252, 0.05)',
            fill: true,
            tension: 0.4
          }
        ]
      });

      renderChart('chart-client-growth', 'doughnut', {
        labels: ['Brand Identity', 'UI / Digital', '3D Design', 'Motion Graphics'],
        datasets: [{
          data: [40, 25, 20, 15],
          backgroundColor: ['#A855F7', '#C084FC', '#34D399', '#FBBF24'],
          borderWidth: 0
        }]
      });
    }

    // ADMIN PROJECTS CHARTS
    if (tabId === 'tab-projects' && document.getElementById('chart-projects-category')) {
      renderChart('chart-projects-category', 'pie', {
        labels: ['Branding', 'Poster & Editorial', 'Motion & 3D', 'UI/UX System'],
        datasets: [{
          data: [35, 25, 20, 20],
          backgroundColor: ['#A855F7', '#C084FC', '#60A5FA', '#34D399'],
          borderWidth: 0
        }]
      });

      renderChart('chart-projects-status', 'doughnut', {
        labels: ['Completed', 'In Progress', 'Draft / Review'],
        datasets: [{
          data: [36, 12, 4],
          backgroundColor: ['#34D399', '#FBBF24', '#A855F7'],
          borderWidth: 0
        }]
      });

      if (document.getElementById('chart-admin-project-velocity')) {
        renderChart('chart-admin-project-velocity', 'line', {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
          datasets: [{
            label: 'Completed Projects Velocity',
            data: [3, 5, 4, 7, 6, 9, 8, 12, 10],
            borderColor: '#34D399',
            backgroundColor: 'rgba(52, 211, 153, 0.15)',
            fill: true,
            tension: 0.3
          }]
        });
      }
    }

    // ADMIN CLIENTS CHARTS
    if (tabId === 'tab-clients' && document.getElementById('chart-client-growth-line')) {
      renderChart('chart-client-growth-line', 'bar', {
        labels: ['Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025', 'Q1 2026'],
        datasets: [{
          label: 'Active Clients',
          data: [12, 18, 24, 29, 34],
          backgroundColor: '#A855F7',
          borderRadius: 6
        }]
      });

      if (document.getElementById('chart-admin-client-sources')) {
        renderChart('chart-admin-client-sources', 'doughnut', {
          labels: ['Behance Portfolio', 'Dribbble Showcase', 'Direct Referrals', 'Organic Search'],
          datasets: [{
            data: [42, 28, 18, 12],
            backgroundColor: ['#A855F7', '#C084FC', '#34D399', '#60A5FA'],
            borderWidth: 0
          }]
        });
      }
    }

    // ADMIN SERVICES CHARTS
    if (tabId === 'tab-services' && document.getElementById('chart-service-popularity')) {
      renderChart('chart-service-popularity', 'bar', {
        labels: ['Brand Identity', 'Graphic & Print', 'Social Media', 'Digital UI', 'Motion Graphics', '3D Design'],
        datasets: [{
          label: 'Requests Count',
          data: [42, 38, 29, 35, 24, 18],
          backgroundColor: '#C084FC',
          borderRadius: 6
        }]
      });

      if (document.getElementById('chart-admin-service-revenue')) {
        renderChart('chart-admin-service-revenue', 'pie', {
          labels: ['Brand Identity (40%)', 'Digital UI (25%)', '3D & Packaging (20%)', 'Motion Graphics (15%)'],
          datasets: [{
            data: [40, 25, 20, 15],
            backgroundColor: ['#A855F7', '#60A5FA', '#34D399', '#FBBF24'],
            borderWidth: 0
          }]
        });
      }
    }

    // ADMIN ANALYTICS CHARTS
    if (tabId === 'tab-analytics' && document.getElementById('chart-analytics-large')) {
      renderChart('chart-analytics-large', 'line', {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
        datasets: [{
          label: 'Engagement Score',
          data: [65, 78, 82, 91, 88, 97],
          borderColor: '#34D399',
          backgroundColor: 'rgba(52, 211, 153, 0.15)',
          fill: true,
          tension: 0.3
        }]
      });

      if (document.getElementById('chart-admin-geo-device')) {
        renderChart('chart-admin-geo-device', 'bar', {
          labels: ['USA', 'Japan', 'Germany', 'UK', 'France', 'Canada'],
          datasets: [{
            label: 'Impressions (K)',
            data: [48, 32, 24, 19, 15, 10],
            backgroundColor: '#60A5FA',
            borderRadius: 6
          }]
        });
      }
    }

    // USER OVERVIEW CHARTS
    if (tabId === 'tab-user-overview' && document.getElementById('chart-user-progress')) {
      renderChart('chart-user-progress', 'line', {
        labels: ['Phase 1: Research', 'Phase 2: Concept', 'Phase 3: Design', 'Phase 4: Refine', 'Phase 5: Final'],
        datasets: [{
          label: 'Project Completion %',
          data: [100, 100, 85, 40, 0],
          borderColor: '#A855F7',
          backgroundColor: 'rgba(168, 85, 247, 0.2)',
          fill: true,
          tension: 0.3
        }]
      });

      renderChart('chart-user-status', 'pie', {
        labels: ['Active Projects', 'Completed', 'Pending Review'],
        datasets: [{
          data: [3, 8, 1],
          backgroundColor: ['#A855F7', '#34D399', '#FBBF24'],
          borderWidth: 0
        }]
      });
    }

    // USER PROJECTS CHARTS
    if (tabId === 'tab-user-projects' && document.getElementById('chart-user-project-milestones')) {
      renderChart('chart-user-project-milestones', 'bar', {
        labels: ['Jan 2026', 'Feb 2026', 'Mar 2026', 'Apr 2026', 'May 2026', 'Jun 2026'],
        datasets: [{
          label: 'Deliverables Delivered',
          data: [4, 6, 8, 5, 9, 12],
          backgroundColor: '#34D399',
          borderRadius: 6
        }]
      });
    }

    // USER MESSAGES CHARTS
    if (tabId === 'tab-user-messages' && document.getElementById('chart-user-message-velocity')) {
      renderChart('chart-user-message-velocity', 'line', {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Messages Exchanged',
          data: [12, 28, 45, 32, 18, 8, 14],
          borderColor: '#60A5FA',
          backgroundColor: 'rgba(96, 165, 250, 0.15)',
          fill: true,
          tension: 0.3
        }]
      });
    }

    // USER SERVICES CHARTS
    if (tabId === 'tab-user-services' && document.getElementById('chart-user-service-utilization')) {
      renderChart('chart-user-service-utilization', 'doughnut', {
        labels: ['Brand Identity', '3D Packaging', 'Motion Graphics', 'UI/UX Design'],
        datasets: [{
          data: [45, 25, 18, 12],
          backgroundColor: ['#A855F7', '#34D399', '#FBBF24', '#60A5FA'],
          borderWidth: 0
        }]
      });
    }

    // USER PROFILE CHARTS
    if (tabId === 'tab-user-profile' && document.getElementById('chart-user-storage-growth')) {
      renderChart('chart-user-storage-growth', 'line', {
        labels: ['Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025', 'Q1 2026'],
        datasets: [{
          label: 'Storage Usage (GB)',
          data: [8.5, 16.2, 24.8, 35.1, 45.2],
          borderColor: '#C084FC',
          backgroundColor: 'rgba(192, 132, 252, 0.15)',
          fill: true,
          tension: 0.3
        }]
      });
    }
  }

  function renderChart(canvasId, type, data) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    if (chartsRegistry[canvasId]) {
      chartsRegistry[canvasId].destroy();
    }

    chartsRegistry[canvasId] = new Chart(ctx, {
      type: type,
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true, position: 'bottom' }
        }
      }
    });
  }

  // Initial chart load for default active tab
  const activeTab = document.querySelector('.dashboard-tab-content.active');
  if (activeTab) {
    initTabCharts(activeTab.id);
  }

  // 4. INTERACTIVE TABLE SEARCH & FILTERING
  const searchInputs = document.querySelectorAll('.table-search-input');
  searchInputs.forEach(input => {
    input.addEventListener('input', () => {
      const query = input.value.toLowerCase();
      const table = input.closest('.dash-table-card').querySelector('.dash-table');
      if (table) {
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
          const text = row.innerText.toLowerCase();
          row.style.display = text.includes(query) ? '' : 'none';
        });
      }
    });
  });

  // 5. CHAT MESSAGING DEMO
  const chatInput = document.getElementById('chat-msg-input');
  const chatSendBtn = document.getElementById('chat-send-btn');
  const chatMessages = document.getElementById('chat-messages-container');

  if (chatSendBtn && chatInput && chatMessages) {
    function sendMessage() {
      const text = chatInput.value.trim();
      if (!text) return;

      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const msgHtml = `
        <div class="msg-bubble sent">
          <p>${text}</p>
          <div class="msg-time">${timeStr}</div>
        </div>
      `;
      chatMessages.insertAdjacentHTML('beforeend', msgHtml);
      chatInput.value = '';
      chatMessages.scrollTop = chatMessages.scrollHeight;

      // Simulated auto-reply after 1.5s
      setTimeout(() => {
        const replyHtml = `
          <div class="msg-bubble received">
            <p>Thank you for your message! Stackly has received your update and will get back to you shortly.</p>
            <div class="msg-time">${timeStr}</div>
          </div>
        `;
        chatMessages.insertAdjacentHTML('beforeend', replyHtml);
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }, 1200);
    }

    chatSendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });
  }

  // 6. PROFILE EDITING DEMO (USER DASHBOARD)
  const editProfileBtn = document.getElementById('edit-profile-btn');
  const saveProfileBtn = document.getElementById('save-profile-btn');
  const profileInputs = document.querySelectorAll('.profile-field-input');

  if (editProfileBtn && saveProfileBtn) {
    editProfileBtn.addEventListener('click', () => {
      profileInputs.forEach(i => i.removeAttribute('disabled'));
      editProfileBtn.style.display = 'none';
      saveProfileBtn.style.display = 'inline-flex';
    });

    saveProfileBtn.addEventListener('click', () => {
      profileInputs.forEach(i => i.setAttribute('disabled', 'true'));
      saveProfileBtn.style.display = 'none';
      editProfileBtn.style.display = 'inline-flex';
      alert('Profile updated successfully!');
    });
  }

  // 7. SYNC LOGIN EMAIL & ROLE STRICTLY IN PROFILE AREA
  try {
    const savedEmail = localStorage.getItem('userEmail');
    const savedRole = localStorage.getItem('userRole');

    if (savedEmail) {
      // Update User Dashboard Profile Email
      const profileUserEmail = document.getElementById('profile-user-email');
      if (profileUserEmail) profileUserEmail.textContent = savedEmail;

      // Update Admin Dashboard Profile Email
      const adminProfileUserEmail = document.getElementById('admin-profile-user-email');
      if (adminProfileUserEmail) adminProfileUserEmail.textContent = savedEmail;

      // Update initial letter on all avatar badges based on entered email
      const initialChar = savedEmail.charAt(0).toUpperCase();
      const initialBadges = document.querySelectorAll('.initial-avatar, .initial-avatar-lg');
      initialBadges.forEach(badge => {
        badge.textContent = initialChar;
      });
    }

    if (savedRole) {
      // Update User Dashboard Profile Role
      const profileRoleBadge = document.getElementById('profile-user-role-badge');
      if (profileRoleBadge) profileRoleBadge.textContent = savedRole;

      const profileRoleSubtitle = document.getElementById('profile-user-role-subtitle');
      if (profileRoleSubtitle) profileRoleSubtitle.textContent = `Role: ${savedRole} // Account Portal`;

      // Update Admin Dashboard Profile Role
      const adminRoleBadge = document.getElementById('admin-profile-user-role-badge');
      if (adminRoleBadge) adminRoleBadge.textContent = savedRole;

      const adminRoleSubtitle = document.getElementById('admin-profile-user-role-subtitle');
      if (adminRoleSubtitle) adminRoleSubtitle.textContent = `Role: ${savedRole} // Studio Management`;
    }
  } catch (err) {
    console.warn('Dashboard Profile Sync Error:', err);
  }
});

