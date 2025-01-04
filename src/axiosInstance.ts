// src/axiosInstance.js
import axios from 'axios';
import { store } from './store/configureStore';
import { clearSessionEndTime, userLoggedOut } from './reducers/authReducer';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8888/wapi/admin/', // Replace with your API base URL
  // baseURL: 'https://mis.watershed.karnataka.gov.in/wapi/admin', // Replace with your API base URL
});

axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.user.token;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    if (!response) {
      // Network or other error
      return Promise.reject(error);
    };

    switch (response.status) {
      case 401:
        store.dispatch(userLoggedOut());
        store.dispatch(clearSessionEndTime());
        // Optionally redirect to login page
        window.location.href = '/watershed/login';
        break;

      case 403:
        // Handle forbidden access
        alert('You do not have permission to perform this action.');
        break;

      case 404:
        // Handle resource not found
        alert(response.data.message || 'The requested resource was not found.');
        // Optionally, you can redirect to a 404 page
        // window.location.href = '/404';
        break;

      case 422:
        // Handle validation errors
        // const validationErrors = response.data.errors;
        alert(response.data.message || 'Please Try again.' );
        // You can handle these errors in your components accordingly
        break;

      default:
        // Handle other errors
        console.error('Error:', response?.data?.message);
        return alert(response.data.message);
    }

    return {code: 400, message: response?.data?.message};
  }
  );

export default axiosInstance;
