import axios from 'axios';

export const baseURL = 'http://localhost:8000/api/v1/';

export const axiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});
