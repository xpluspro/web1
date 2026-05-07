import React from 'react';
import ReactDOM from 'react-dom/client';
import 'antd/dist/reset.css';
import { BrowserRouter } from 'react-router-dom';
import './spa.css';
import { AppRoot } from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppRoot />
    </BrowserRouter>
  </React.StrictMode>
);
