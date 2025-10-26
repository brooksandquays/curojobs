// js/api.js

const BASE_URL = 'http://127.0.0.1:8000/api/v1/';
// const BASE_URL = 'https://app.curojobs.com/api/v1/';

// This function specifically handles getting a new access token
const getNewAccessToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
        // If there's no refresh token, the user needs to log in again
        window.location.href = '/login.html';
        return null;
    }

    try {
        const response = await fetch(`${BASE_URL}accounts/token/refresh/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh: refreshToken }),
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('accessToken', data.access);
            return data.access;
        } else {
            // If the refresh token is invalid/expired, log the user out
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login.html';
            return null;
        }
    } catch (error) {
        console.error('Token refresh error:', error);
        return null;
    }
};

// This is our main, reusable function for all authenticated API calls
const apiFetch = async (url, options = {}) => {
    let accessToken = localStorage.getItem('accessToken');
    
    // Add Authorization header to the request
    options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${accessToken}`,
    };

    let response = await fetch(url, options);

    if (response.status === 401) {
        // Token expired, let's try to refresh it
        const newAccessToken = await getNewAccessToken();
        if (newAccessToken) {
            // Update the header with the new token
            options.headers['Authorization'] = `Bearer ${newAccessToken}`;
            // Retry the original request
            response = await fetch(url, options);
        } else {
            // If refresh failed, we can't proceed
            return null;
        }
    }

    return response;
};