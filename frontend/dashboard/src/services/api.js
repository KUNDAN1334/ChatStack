import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Client APIs
export const createClient = (clientData) => 
  api.post('/api/clients', clientData);

export const listClients = () => 
  api.get('/api/clients');

export const getClient = (clientId) => 
  api.get(`/api/clients/${clientId}`);

// Analytics APIs
export const getAnalytics = (apiKey) => 
  api.get('/api/analytics', {
    headers: { 'X-API-Key': apiKey }
  });

export const getLeads = (apiKey) => 
  api.get('/api/analytics/leads', {
    headers: { 'X-API-Key': apiKey }
  });

export default api;
