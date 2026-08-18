import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
document.documentElement.style.setProperty(
  '--login-background',
  `url(${import.meta.env.BASE_URL}images.jpg)`
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
