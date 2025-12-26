# ios 18 Jailbreak Tool - Vite + React

Современный адаптивный сайт для iOS-утилиты с тёмным дизайном, построенный на Vite + React.

## 🚀 Технологии

- **Vite** - быстрый сборщик
- **React 18** - UI библиотека
- **JSZip** - генерация ZIP архивов на клиенте

## 📁 Структура проекта

```
/
├── public/              # Статические файлы (копируются в dist)
│   └── favicon.svg
├── src/
│   ├── components/      # React компоненты
│   │   ├── Header.jsx
│   │   ├── Hero.jsx
│   │   ├── Features.jsx
│   │   ├── FAQ.jsx
│   │   └── ...
│   ├── hooks/          # React хуки
│   │   └── useZipDownload.js
│   ├── utils/          # Утилиты
│   │   ├── env-loader.js
│   │   └── telegram-notify.js
│   ├── App.jsx         # Главный компонент
│   ├── main.jsx        # Точка входа
│   ├── index.css       # Импорт стилей
│   └── styles.css      # Глобальные стили
├── index.html          # HTML шаблон
├── vite.config.js      # Конфигурация Vite
├── package.json        # Зависимости
└── netlify.toml        # Конфигурация Netlify
```

## 🛠️ Установка и запуск

### Локальная разработка

```bash
# Установка зависимостей
npm install

# Запуск dev сервера
npm run dev

# Сборка для продакшена
npm run build

# Превью продакшен сборки
npm run preview
```

### Деплой на Netlify

1. Закоммить изменения в Git
2. Запушить в репозиторий
3. Netlify автоматически:
   - Установит зависимости (`npm install`)
   - Соберёт проект (`npm run build`)
   - Задеплоит из папки `dist`

## 🎨 Особенности

- ✅ Полностью адаптивный дизайн
- ✅ Тёмная тема
- ✅ Генерация ZIP на клиенте (15 МБ)
- ✅ Smooth scroll навигация
- ✅ FAQ аккордеон
- ✅ Табы для инструкций по установке
- ✅ Telegram уведомления о посещениях

## 📝 TODO

- [ ] Добавить реальный SHA-256 hash после генерации IPA.

## 🚀 Команды

```bash
npm run dev      # Запуск dev сервера (http://localhost:5173)
npm run build    # Сборка для продакшена
npm run preview  # Превью продакшен сборки
```

## 📄 Лицензия

Все права защищены © 2025 ios 18 Jailbreak Tool
# jailtool2