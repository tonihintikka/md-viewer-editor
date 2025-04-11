import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.css';
import { FileProvider } from './context/FileContext';
import { ThemeProvider } from './context/ThemeContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <FileProvider>
        <App />
      </FileProvider>
    </ThemeProvider>
  </React.StrictMode>
);
