import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const message = error.response?.data?.detail || "A network error occurred. Please try again.";
        return Promise.reject(new Error(message));
    }
);

export const api = {
    getResumes: () => apiClient.get('/resumes'),
    getJobs: () => apiClient.get('/jobs'),
    getGapAnalysis: (payload) => apiClient.post('/gap-analysis', payload),
    getRoadmap: (payload) => apiClient.post('/roadmap', payload),
    getInterviewPrep: (payload) => apiClient.post('/interview', payload),
};