import apiClient from '../api/axios' // Adjust path if your apiClient file is elsewhere

const SecteursService = {
    // Fetches all secteurs
    getAll: async () => {
        try {
            const response = await apiClient.get('/secteurs');
            // Assuming your Laravel API returns data in a 'data' key for collections
            return response.data || [];
        } catch (error) {
            console.error('Error fetching secteurs:', error.response?.data || error.message);
            throw error; // Re-throw to be caught by the hook's error handling
        }
    },

    // Fetches a single secteur by ID
    getById: async (id) => {
        try {
            const response = await await apiClient.get(`/secteurs/${id}`);
            return response.data.data; // Assuming single resource under 'data' key
        } catch (error) {
            console.error(`Error fetching secteur ${id}:`, error.response?.data || error.message);
            throw error;
        }
    },

    // Creates a new secteur
    create: async (secteurData) => {
        try {
            const response = await apiClient.post('/secteurs', secteurData);
            return response.data.data;
        } catch (error) {
            console.error('Error creating secteur:', error.response?.data || error.message);
            throw error;
        }
    },

    // Updates an existing secteur
    update: async (id, secteurData) => {
        try {
            // Use PUT or PATCH based on your Laravel API's expectation
            const response = await apiClient.put(`/secteurs/${id}`, secteurData); // Or .patch
            return response.data.data;
        } catch (error) {
            console.error(`Error updating secteur ${id}:`, error.response?.data || error.message);
            throw error;
        }
    },

    // Deletes a secteur
    delete: async (id) => {
        try {
            await apiClient.delete(`/secteurs/${id}`);
            return true; // Indicate success
        } catch (error) {
            console.error(`Error deleting secteur ${id}:`, error.response?.data || error.message);
            throw error;
        }
    },

    // Simplified search. Adjust based on your Laravel API's search implementation.
    // This assumes your Laravel API can handle a query parameter like /api/secteurs?search=term
    search: async (column, term) => {
        try {
            // Option 1: Generic search parameter (common for APIs)
            const response = await apiClient.get(`/secteurs?search=${encodeURIComponent(term)}`);
            // Option 2: Specific column search (if your API supports it)
            // const response = await apiClient.get(`/api/secteurs?${column}=${encodeURIComponent(term)}`);
            return response.data.data || [];
        } catch (error) {
            console.error('Error searching secteurs:', error.response?.data || error.message);
            throw error;
        }
    },
};

export default SecteursService;