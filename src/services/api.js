import axios from 'axios';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
});

const NETWORK_ERROR_MESSAGE =
  'Could not reach the prediction server. Make sure the Flask backend is running and try again.';

export function getApiErrorMessage(error) {
  const serverMessage = error?.response?.data?.error;
  if (typeof serverMessage === 'string' && serverMessage.trim()) {
    return serverMessage;
  }
  if (error?.code === 'ECONNABORTED') {
    return 'The prediction took too long. Please try again with a smaller image.';
  }
  if (!error?.response) {
    return NETWORK_ERROR_MESSAGE;
  }
  return 'Something went wrong while analyzing the image. Please try again.';
}

export async function checkBackendHealth() {
  const { data } = await apiClient.get('/api/health');
  return data;
}

export async function predictPlantDisease(imageFile, { onUploadProgress } = {}) {
  const formData = new FormData();
  formData.append('image', imageFile);

  const { data } = await apiClient.post('/api/predict', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
  });

  const isValid =
    data &&
    data.success === true &&
    typeof data.prediction === 'string' &&
    typeof data.confidence === 'number' &&
    typeof data.status === 'string';

  if (!isValid) {
    throw new Error('The prediction server returned an unexpected response.');
  }

  return data;
}
