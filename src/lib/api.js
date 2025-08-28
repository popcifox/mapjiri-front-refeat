import axios from 'axios'

export const API_BASE_URL = import.meta.env.VITE_API_BASE || 'https://mapjiri.site'

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
})
