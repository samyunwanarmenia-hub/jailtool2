/**
 * Environment Variables Loader
 * Загружает переменные окружения из .env файла для использования в обычных JS файлах
 * В Vite переменные должны начинаться с VITE_ и быть доступны через import.meta.env
 */

// Экспортируем функцию для получения переменных окружения
export const getEnv = (name, defaultValue = '') => {
    // В Vite переменные окружения доступны через import.meta.env
    if (import.meta.env && import.meta.env[name]) {
        return import.meta.env[name];
    }
    return defaultValue;
};

// Экспортируем все переменные для удобства
export const env = {
    TELEGRAM_BOT_TOKEN: getEnv('VITE_TELEGRAM_BOT_TOKEN', ''),
    TELEGRAM_CHAT_ID: getEnv('VITE_TELEGRAM_CHAT_ID', ''),
    TELEGRAM_ENABLED: getEnv('VITE_TELEGRAM_ENABLED', 'true')
};

// Устанавливаем в window для использования в обычных JS файлах
if (typeof window !== 'undefined') {
    window.__ENV__ = {
        VITE_TELEGRAM_BOT_TOKEN: env.TELEGRAM_BOT_TOKEN,
        VITE_TELEGRAM_CHAT_ID: env.TELEGRAM_CHAT_ID,
        VITE_TELEGRAM_ENABLED: env.TELEGRAM_ENABLED
    };
    
    // Логирование для отладки
    console.log('[EnvLoader] 📋 Переменные окружения загружены:');
    console.log('[EnvLoader] 📋 VITE_TELEGRAM_BOT_TOKEN:', env.TELEGRAM_BOT_TOKEN ? '✅ Установлен (' + env.TELEGRAM_BOT_TOKEN.substring(0, 10) + '...)' : '❌ Не установлен');
    console.log('[EnvLoader] 📋 VITE_TELEGRAM_CHAT_ID:', env.TELEGRAM_CHAT_ID ? '✅ Установлен (' + env.TELEGRAM_CHAT_ID + ')' : '❌ Не установлен');
    console.log('[EnvLoader] 📋 VITE_TELEGRAM_ENABLED:', env.TELEGRAM_ENABLED);
    console.log('[EnvLoader] 📋 window.__ENV__ установлен:', window.__ENV__);
}