import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import axios from 'axios';

// Configure global axios defaults (used by components that don't use custom instances)
axios.defaults.baseURL = 'http://localhost:5000';
// Remove withCredentials since we're allowing all origins
// axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Accept'] = 'application/json';

// Add interceptors for debugging
axios.interceptors.request.use(request => {
  // Don't log sensitive data
  const requestCopy = {...request};
  if (requestCopy.data) {
    if (requestCopy.data.password) {
      requestCopy.data = {...requestCopy.data, password: '******'};
    }
  }
  console.log('Starting Request:', requestCopy);
  return request;
});

axios.interceptors.response.use(
  response => {
    console.log('Response Success:', response.status, response.data);
    return response;
  },
  error => {
    console.error('Response Error:', 
      error.message, 
      error.response ? {status: error.response.status, data: error.response.data} : 'No response'
    );
    return Promise.reject(error);
  }
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(); 