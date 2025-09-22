// js/main.js
document.addEventListener("DOMContentLoaded", function() {
    // Function to load HTML snippets
    const loadHTML = async (selector, filePath) => {
        const element = document.querySelector(selector);
        if (element) {
            const response = await fetch(filePath);
            if (response.ok) {
                element.innerHTML = await response.text();
            }
        }
    };

    // Function to set up the authentication links in the header
    const setupAuthHeader = () => {
        const authLinksContainer = document.getElementById('auth-links');
        if (!authLinksContainer) return;

        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            const decodedToken = jwt_decode(accessToken);
            let dashboardUrl = '/index.html'; // Fallback
            if (decodedToken.user_type === 'applicant') {
                dashboardUrl = '/dashboard/applicant/candidate-dashboard-index.html';
            } else if (decodedToken.user_type === 'company') {
                dashboardUrl = '/dashboard/employer/employer-dashboard-index.html';
            }

            authLinksContainer.innerHTML = `
                <li><a href="${dashboardUrl}" class="login-btn-one">Dashboard</a></li>
                <li class="d-none d-md-block ms-4"><a href="#" id="logout-btn" class="btn-one">Logout</a></li>
            `;
            const logoutBtn = document.getElementById('logout-btn');
            if(logoutBtn) {
                logoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    window.location.href = '/index.html';
                });
            }
        } else {
            authLinksContainer.innerHTML = `
                <li><a href="/login.html" class="login-btn-one">Login | SignUp</a></li>
                <li class="d-none d-md-block ms-4"><a href="/signup.html" class="btn-one">Hire Top Talents</a></li>
            `;
        }
    };

    // Load header and footer, then set up auth links
    Promise.all([
        loadHTML('#header-placeholder', '/includes/header.html'),
        loadHTML('#footer-placeholder', '/includes/footer.html')
    ]).then(() => {
        // This runs after the header is loaded
        setupAuthHeader();
    });
});