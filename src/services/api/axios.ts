import axios from 'axios';
import { mockAdapter } from './mockAdapter.ts';

const apiBaseUrl = String(import.meta.env.VITE_API_URL ?? '/api/');
const useMockApi = String(import.meta.env.VITE_USE_MOCK_API) !== 'false';

export const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 15000,
  adapter: useMockApi ? mockAdapter : undefined,
});
