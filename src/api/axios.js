import axios from 'axios';

// IMPORTANT: Use environment variables for your backend URL
// This value comes from your React app's .env file (e.g., REACT_APP_BACKEND_URL=http://localhost:8000)
const LARAVEL_API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

if (!LARAVEL_API_BASE_URL) {
    console.error('REACT_APP_BACKEND_URL is not defined in your environment variables.');
    // You might want to throw an error or handle this more robustly in a real app
}

const apiClient = axios.create({
    baseURL: LARAVEL_API_BASE_URL,
    withCredentials: true, // Crucial for sending and receiving cookies (for Laravel Sanctum)
    withXSRFToken: true,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json', // Explicitly set content type for POST/PUT
    },
});

// --- Request Interceptor for CSRF Token ---
// This interceptor ensures the CSRF cookie is fetched before state-changing requests.
// It uses the same apiClient instance, which is generally fine because
// the CSRF cookie request itself doesn't typically require a CSRF token.
apiClient.interceptors.request.use(
    async (config) => {
        const methodsRequiringCSRF = ['post', 'put', 'patch', 'delete'];
        if (methodsRequiringCSRF.includes(config.method.toLowerCase())) {
            try {
                // Only hit the csrf-cookie endpoint if it's not the csrf-cookie request itself
                // to prevent infinite loops if for some reason the CSRF endpoint needs CSRF (unlikely for Sanctum)
                if (!config.url.includes('/sanctum/csrf-cookie')) {
                    await apiClient.get('/sanctum/csrf-cookie');
                    console.log('CSRF cookie requested/refreshed.');
                }
            } catch (error) {
                console.error('Failed to obtain CSRF token:', error.response?.data || error.message);
                // If CSRF acquisition fails, it's critical. Reject the request promise
                // so the original API call (login, etc.) does not proceed.
                // This will propagate to the thunk's catch block.
                return Promise.reject(new Error('Failed to obtain CSRF token.'));
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// --- Response Interceptor for Global Error Handling (Optional but Recommended) ---
// This can be used for things like redirecting to login on 401 Unauthorized
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Check if the error is due to an expired session or unauthenticated access
        if (error.response?.status === 401 && !error.config.url.includes('/login')) {
            // You might want to dispatch a logout action or redirect to login here
            // For Redux Toolkit, you might need to import your store and dispatch directly,
            // or handle this in a more centralized error handling middleware if used globally.
            console.warn('Unauthorized access or session expired. Consider redirecting to login.');
            // Example: store.dispatch(logoutClient()); // Requires store import
            // Or simply re-throw and handle in individual thunks if more specific behavior is needed.
        }
        return Promise.reject(error);
    }
);

export default apiClient;