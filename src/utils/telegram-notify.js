/**
 * Telegram Notifications - Система уведомлений в Telegram
 * Отправляет уведомление в Telegram при посещении сайта
 * - Отслеживание уникальных посещений
 * - Сбор информации о посетителе (User Agent, Referrer, IP через API)
 * - Определение локации по IP
 * - Отправка уведомления в Telegram через Bot API
 * - Чтение конфигурации из .env файла (VITE_TELEGRAM_BOT_TOKEN, VITE_TELEGRAM_CHAT_ID)
 */

console.log('[TelegramNotify] 📱 Инициализация системы Telegram уведомлений...');

// ============================================
// КОНФИГУРАЦИЯ (из .env или значения по умолчанию)
// ============================================

// В Vite переменные окружения доступны через import.meta.env
// Используем напрямую import.meta.env, так как это ES модуль
const getEnvVar = (name, defaultValue) => {
    // Пытаемся получить из import.meta.env (основной способ для Vite)
    if (import.meta.env && import.meta.env[name]) {
        const value = import.meta.env[name];
        // Проверяем, что значение не пустое
        if (value && value.trim() !== '') {
            return value;
        }
    }
    // Fallback: пытаемся получить из window.__ENV__ (на случай, если env-loader установил)
    if (typeof window !== 'undefined' && window.__ENV__ && window.__ENV__[name]) {
        const value = window.__ENV__[name];
        if (value && value.trim() !== '') {
            return value;
        }
    }
    // Fallback: пытаемся получить из глобального объекта env
    if (typeof window !== 'undefined' && window.env && window.env[name]) {
        const value = window.env[name];
        if (value && value.trim() !== '') {
            return value;
        }
    }
    return defaultValue;
};

// Функция для получения конфигурации из переменных окружения
const getConfig = () => {
    const botToken = getEnvVar('VITE_TELEGRAM_BOT_TOKEN', 'YOUR_BOT_TOKEN');
    const chatId = getEnvVar('VITE_TELEGRAM_CHAT_ID', 'YOUR_CHAT_ID');
    const enabled = getEnvVar('VITE_TELEGRAM_ENABLED', 'true') !== 'false';
    
    return {
        botToken,
        chatId,
        enabled,
        sendOnPageLoad: true,
        sendUniqueOnly: false,
        delay: 1000
    };
};

// Инициализируем конфигурацию
let TELEGRAM_CONFIG = getConfig();

// Логирование для отладки
console.log('[TelegramNotify] 🔍 Проверка конфигурации:');
console.log('[TelegramNotify] 🔍 import.meta.env:', import.meta.env);
console.log('[TelegramNotify] 🔍 window.__ENV__:', window.__ENV__);
console.log('[TelegramNotify] 🔍 botToken:', TELEGRAM_CONFIG.botToken ? '✅ Установлен (' + TELEGRAM_CONFIG.botToken.substring(0, 10) + '...)' : '❌ Не установлен');
console.log('[TelegramNotify] 🔍 chatId:', TELEGRAM_CONFIG.chatId ? '✅ Установлен (' + TELEGRAM_CONFIG.chatId + ')' : '❌ Не установлен');
console.log('[TelegramNotify] 🔍 enabled:', TELEGRAM_CONFIG.enabled);

// ============================================
// ПРОВЕРКА УНИКАЛЬНОСТИ ПОСЕЩЕНИЯ
// ============================================

const isUniqueVisit = () => {
    if (!TELEGRAM_CONFIG.sendUniqueOnly) {
        return true; // Всегда отправляем, если не включен режим уникальных
    }
    
    const visitKey = 'telegram_notify_visit_' + new Date().toDateString();
    const lastVisit = localStorage.getItem(visitKey);
    
    if (lastVisit) {
        console.log('[TelegramNotify] ℹ️ Посещение уже было сегодня, пропускаем');
        return false;
    }
    
    localStorage.setItem(visitKey, Date.now().toString());
    return true;
};

// ============================================
// СБОР ИНФОРМАЦИИ О ПОСЕТИТЕЛЕ
// ============================================

const getVisitorInfo = async () => {
        const info = {
            timestamp: new Date().toISOString(),
            url: window.location.href,
            referrer: document.referrer || 'Direct',
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            viewportWidth: window.innerWidth,
            viewportHeight: window.innerHeight,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
        
        // Получение IP и локации через внешний API (с поддержкой CORS)
        try {
            // Получаем IP через API с поддержкой CORS
            const ipResponse = await fetch('https://api.ipify.org?format=json', {
                method: 'GET',
                mode: 'cors'
            });
            
            if (!ipResponse.ok) {
                throw new Error(`HTTP error! status: ${ipResponse.status}`);
            }
            
            const ipData = await ipResponse.json();
            info.ip = ipData.ip;
            
            // Получаем локацию по IP через альтернативный API с поддержкой HTTPS и CORS
            // Используем ipwho.is, который работает по HTTPS и обычно не блокируется в браузере
            try {
                const geoResponse = await fetch(`https://ipwho.is/${info.ip}`, {
                    method: 'GET',
                    mode: 'cors'
                });
                
                if (geoResponse.ok) {
                    const geoData = await geoResponse.json();
                    
                    // Проверяем статус ответа
                    if (geoData.success) {
                        const locationParts = [];
                        if (geoData.city) locationParts.push(geoData.city);
                        if (geoData.region) locationParts.push(geoData.region);
                        if (geoData.country) locationParts.push(geoData.country);
                        
                        if (locationParts.length > 0) {
                            info.location = locationParts.join(', ');
                        } else {
                            info.location = 'Не определена';
                        }
                    } else {
                        // Если API вернул ошибку (например, лимит превышен)
                        console.warn('[TelegramNotify] ⚠️ API вернул ошибку:', geoData.message || 'Неизвестная ошибка');
                        info.location = 'Не определена';
                    }
                } else {
                    throw new Error(`HTTP error! status: ${geoResponse.status}`);
                }
            } catch (geoError) {
                // Тихая обработка ошибки - не логируем, чтобы не засорять консоль
                // Это может быть из-за CORS, лимитов API или других проблем
                info.location = 'Не определена';
            }
        } catch (error) {
            // Тихая обработка ошибки получения IP
            // Это может быть из-за CORS, блокировщиков рекламы или других проблем
            info.ip = 'Не определен';
            info.location = 'Не определена';
        }
        
    return info;
};

// ============================================
// ФОРМИРОВАНИЕ СООБЩЕНИЯ (минимальный формат для Telegram)
// ============================================

const formatMessage = (info) => {
        // Здесь формируем короткое сообщение только с иконкой, IP и локацией
        const ip = info.ip || 'Не определен';
        
        // Если локация определена, показываем её, иначе пишем, что не определена
        const locationText = info.location && info.location !== 'Не определена'
            ? info.location
            : 'Локация не определена';
        
        const message = `📥
IP: ${ip}
${locationText}`;
        
        return message;
    };
    
    // ============================================
    // ОТПРАВКА УВЕДОМЛЕНИЯ В TELEGRAM
    // ============================================
    
const sendTelegramNotification = async (message) => {
    // Обновляем конфигурацию перед отправкой (на случай, если переменные загрузились позже)
    TELEGRAM_CONFIG = getConfig();
    
    if (!TELEGRAM_CONFIG.enabled) {
        console.log('[TelegramNotify] ℹ️ Уведомления отключены');
        return;
    }
    
    if (!TELEGRAM_CONFIG.botToken || !TELEGRAM_CONFIG.chatId || 
        TELEGRAM_CONFIG.botToken === 'YOUR_BOT_TOKEN' || 
        TELEGRAM_CONFIG.chatId === 'YOUR_CHAT_ID') {
        console.error('[TelegramNotify] ❌ Bot Token или Chat ID не настроены!');
        console.error('[TelegramNotify] ❌ Текущие значения:');
        console.error('[TelegramNotify] ❌ botToken:', TELEGRAM_CONFIG.botToken);
        console.error('[TelegramNotify] ❌ chatId:', TELEGRAM_CONFIG.chatId);
        console.error('[TelegramNotify] ❌ Добавьте в .env файл:');
        console.error('[TelegramNotify] ❌ VITE_TELEGRAM_BOT_TOKEN=ваш_токен');
        console.error('[TelegramNotify] ❌ VITE_TELEGRAM_CHAT_ID=ваш_chat_id');
        console.error('[TelegramNotify] ❌ После изменения .env перезапустите dev сервер!');
        return;
    }
    
    try {
        const url = `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage`;
        
        console.log('[TelegramNotify] 📤 Отправка уведомления в Telegram...');
        console.log('[TelegramNotify] 📤 URL:', url.replace(TELEGRAM_CONFIG.botToken, 'TOKEN_HIDDEN'));
        console.log('[TelegramNotify] 📤 Chat ID:', TELEGRAM_CONFIG.chatId);
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CONFIG.chatId,
                text: message,
                disable_web_page_preview: true
            })
        });
        
        const data = await response.json();
        
        if (data.ok) {
            console.log('[TelegramNotify] ✅ Уведомление успешно отправлено в Telegram');
            console.log('[TelegramNotify] ✅ Message ID:', data.result.message_id);
        } else {
            console.error('[TelegramNotify] ❌ Ошибка отправки в Telegram:');
            console.error('[TelegramNotify] ❌ Код ошибки:', data.error_code);
            console.error('[TelegramNotify] ❌ Описание:', data.description);
            console.error('[TelegramNotify] ❌ Полный ответ:', data);
        }
    } catch (error) {
        console.error('[TelegramNotify] ❌ Ошибка отправки уведомления:', error);
        console.error('[TelegramNotify] ❌ Stack trace:', error.stack);
    }
};

// ============================================
// ОСНОВНАЯ ФУНКЦИЯ
// ============================================

const notifyVisit = async () => {
    // Обновляем конфигурацию перед проверкой
    TELEGRAM_CONFIG = getConfig();
    
    console.log('[TelegramNotify] 📱 Запуск notifyVisit...');
    console.log('[TelegramNotify] 📱 Текущая конфигурация:', {
        botToken: TELEGRAM_CONFIG.botToken ? '✅ Установлен' : '❌ Не установлен',
        chatId: TELEGRAM_CONFIG.chatId ? '✅ Установлен' : '❌ Не установлен',
        enabled: TELEGRAM_CONFIG.enabled,
        sendOnPageLoad: TELEGRAM_CONFIG.sendOnPageLoad
    });
    
    if (!TELEGRAM_CONFIG.sendOnPageLoad) {
        console.log('[TelegramNotify] ℹ️ sendOnPageLoad отключен');
        return;
    }
    
    // Проверяем, что конфигурация загружена
    if (!TELEGRAM_CONFIG.botToken || !TELEGRAM_CONFIG.chatId || 
        TELEGRAM_CONFIG.botToken === 'YOUR_BOT_TOKEN' || 
        TELEGRAM_CONFIG.chatId === 'YOUR_CHAT_ID') {
        console.warn('[TelegramNotify] ⚠️ Конфигурация не загружена, ждем...');
        // Ждем немного и пробуем еще раз
        setTimeout(() => {
            TELEGRAM_CONFIG = getConfig();
            if (TELEGRAM_CONFIG.botToken && TELEGRAM_CONFIG.botToken !== 'YOUR_BOT_TOKEN' &&
                TELEGRAM_CONFIG.chatId && TELEGRAM_CONFIG.chatId !== 'YOUR_CHAT_ID') {
                console.log('[TelegramNotify] ✅ Конфигурация загружена, продолжаем...');
                notifyVisit();
            } else {
                console.error('[TelegramNotify] ❌ Конфигурация все еще не загружена после ожидания');
            }
        }, 500);
        return;
    }
    
    if (!isUniqueVisit()) {
        return;
    }
    
    console.log('[TelegramNotify] 📱 Сбор информации о посетителе...');
    
    try {
        const visitorInfo = await getVisitorInfo();
        const message = formatMessage(visitorInfo);
        
        console.log('[TelegramNotify] 📱 Сообщение сформировано:', message.substring(0, 100) + '...');
        
        // Отправляем уведомление (задержка уже встроена в sendTelegramNotification не нужна, так как конфигурация уже загружена)
        sendTelegramNotification(message);
    } catch (error) {
        console.error('[TelegramNotify] ❌ Ошибка при сборе информации:', error);
    }
};

// ============================================
// ИНИЦИАЛИЗАЦИЯ
// ============================================

const initTelegramNotify = () => {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', notifyVisit);
        } else {
        notifyVisit();
    }
};
    
// Экспорт для использования в других модулях
window.TelegramNotify = {
    config: TELEGRAM_CONFIG,
    notifyVisit,
    sendTelegramNotification
};

// Автоматическая инициализация
initTelegramNotify();

console.log('[TelegramNotify] ✅ Система Telegram уведомлений инициализирована');

// Проверка конфигурации
if (TELEGRAM_CONFIG.botToken && TELEGRAM_CONFIG.botToken !== 'YOUR_BOT_TOKEN' &&
    TELEGRAM_CONFIG.chatId && TELEGRAM_CONFIG.chatId !== 'YOUR_CHAT_ID') {
    console.log('[TelegramNotify] ✅ Конфигурация загружена из .env');
} else {
    console.warn('[TelegramNotify] ⚠️ ВАЖНО: Добавьте в .env файл:');
    console.warn('[TelegramNotify] ⚠️ VITE_TELEGRAM_BOT_TOKEN=ваш_токен');
    console.warn('[TelegramNotify] ⚠️ VITE_TELEGRAM_CHAT_ID=ваш_chat_id');
    console.warn('[TelegramNotify] ⚠️ После изменения .env перезапустите dev сервер!');
}

