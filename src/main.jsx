import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Загрузка переменных окружения из .env (должен быть первым)
import './utils/env-loader';

// Инициализация Telegram уведомлений
import './utils/telegram-notify';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);