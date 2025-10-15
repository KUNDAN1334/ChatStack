import axios from 'axios';

const API_BASE_URL = window.PRODESK_API_URL || 'http://localhost:8000';

export const sendMessage = async (apiKey, message, sessionId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/chat`, {
      api_key: apiKey,
      message: message,
      session_id: sessionId
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const captureLead = async (apiKey, sessionId, leadData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/leads`, {
      api_key: apiKey,
      session_id: sessionId,
      ...leadData
    });
    return response.data;
  } catch (error) {
    console.error('Lead API Error:', error);
    throw error;
  }
};
