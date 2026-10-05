import axios from 'axios';

export const API_BASE_URL = String(import.meta.env.VITE_API_URL ?? '/api').replace(/\/$/, '');

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});
