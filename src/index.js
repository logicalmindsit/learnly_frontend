// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// 1. IMPORT THE AuthProvider YOU JUST CREATED
import { AuthProvider } from '../src/Context/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    {/* 2. WRAP YOUR <App /> COMPONENT WITH THE PROVIDER */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);